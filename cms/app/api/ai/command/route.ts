import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/session";
import { loadSiteContext, buildSystemPrompt } from "@/lib/ai/context";
import { AI_TOOLS, executeToolCall } from "@/lib/ai/tools";

const MODEL = "claude-sonnet-5";
const MAX_TOOL_CALLS = 20;
const MAX_TURNS = 12;
const MAX_HISTORY_TURNS = 20;

export async function POST(request: Request) {
  const body = await request.json();
  const siteId = String(body.siteId ?? "");
  const command = String(body.command ?? "").trim();
  const history = Array.isArray(body.history) ? body.history.slice(-MAX_HISTORY_TURNS) : [];

  if (!siteId || !command) {
    return NextResponse.json({ error: "siteId and command are required." }, { status: 400 });
  }

  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const supabase = await createClient();

  // Re-derive the tenant from the site server-side, and confirm write access,
  // before spending an LLM call. Mirrors the sections_write RLS policy.
  const { data: site } = await supabase.from("sites").select("id, tenant_id").eq("id", siteId).maybeSingle();
  if (!site) return NextResponse.json({ error: "Site not found." }, { status: 404 });

  let canWrite = user.staffRole === "super_admin" || user.staffRole === "developer";
  if (!canWrite && user.staffRole === "support") {
    const { data: assignment } = await supabase
      .from("staff_tenant_assignments")
      .select("id")
      .eq("staff_user_id", user.id)
      .eq("tenant_id", site.tenant_id)
      .eq("context", "support")
      .maybeSingle();
    canWrite = !!assignment;
  }
  if (!canWrite) {
    return NextResponse.json({ error: "You don't have edit access to this site." }, { status: 403 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY is not configured on the server." }, { status: 500 });
  }

  const context = await loadSiteContext(siteId);
  const client = new Anthropic();

  const messages: Anthropic.MessageParam[] = [
    ...history
      .filter((m: { role?: string; text?: string }) => m?.text && (m.role === "user" || m.role === "assistant"))
      .map((m: { role: string; text: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.text,
      })),
    { role: "user", content: command },
  ];

  const diff: Record<string, unknown>[] = [];
  const toolCallLog: Record<string, unknown>[] = [];
  let clarification: { question: string; options?: string[] } | undefined;
  let toolCallCount = 0;
  let summary = "";

  try {
    for (let turn = 0; turn < MAX_TURNS; turn++) {
      const response = await client.messages.create({
        model: MODEL,
        max_tokens: 8000,
        thinking: { type: "adaptive" },
        system: [
          { type: "text", text: buildSystemPrompt(context), cache_control: { type: "ephemeral" } },
        ],
        tools: AI_TOOLS,
        messages,
      });

      const toolUses = response.content.filter(
        (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
      );

      const text = response.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("\n")
        .trim();
      if (text) summary = text;

      if (toolUses.length === 0) break;

      messages.push({ role: "assistant", content: response.content });

      const toolResults: Anthropic.ToolResultBlockParam[] = [];
      for (const toolUse of toolUses) {
        if (toolCallCount >= MAX_TOOL_CALLS) {
          toolResults.push({
            type: "tool_result",
            tool_use_id: toolUse.id,
            content: `Tool call limit (${MAX_TOOL_CALLS}) reached for this command. Stop and summarize what you changed.`,
            is_error: true,
          });
          continue;
        }
        toolCallCount++;

        const result = await executeToolCall(toolUse.name, toolUse.input as Record<string, unknown>, { siteId });
        toolCallLog.push({ name: toolUse.name, input: toolUse.input, ok: !result.isError });
        if (result.diffEntry) diff.push(result.diffEntry);
        if (result.clarification) clarification = result.clarification;

        toolResults.push({
          type: "tool_result",
          tool_use_id: toolUse.id,
          content: result.resultContent,
          is_error: result.isError,
        });
      }

      messages.push({ role: "user", content: toolResults });

      if (clarification) break;
      if (toolCallCount >= MAX_TOOL_CALLS) break;
    }
  } catch (err) {
    const message =
      err instanceof Anthropic.APIError ? `Claude API error (${err.status}): ${err.message}` : String(err);

    await supabase.from("ai_command_log").insert({
      site_id: siteId,
      user_id: user.id,
      raw_command: command,
      tool_calls: toolCallLog,
      diff,
      status: "error",
      error_message: message,
    });

    return NextResponse.json({ error: message }, { status: 502 });
  }

  const status = clarification ? "clarification" : diff.length > 0 ? "applied" : "no_change";

  const { data: logRow } = await supabase
    .from("ai_command_log")
    .insert({
      site_id: siteId,
      user_id: user.id,
      raw_command: command,
      tool_calls: toolCallLog,
      diff,
      status,
    })
    .select("id")
    .single();

  if (diff.length > 0) {
    revalidatePath(`/admin/tenants/${site.tenant_id}/sites/${siteId}/builder`);
    revalidatePath(`/admin/tenants/${site.tenant_id}/sites/${siteId}/preview`);
  }

  return NextResponse.json({
    status,
    summary: clarification ? clarification.question : summary,
    clarification,
    diff,
    commandLogId: logRow?.id ?? null,
  });
}
