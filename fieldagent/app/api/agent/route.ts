import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { getProvider, ConfigError } from "@/lib/llm";
import { FIELD_AGENT_SYSTEM } from "@/lib/prompts/field-agent";
import { COMMANDS, buildUserPrompt, type CommandId } from "@/lib/prompts/commands";

// Recon (on the grok provider) does live web research and can run well over a minute.
export const maxDuration = 300;

interface Body {
  command: CommandId;
  primary: string;
  area?: string;
}

function friendlyError(err: unknown, consoleUrl: string, providerId: string): string {
  if (err instanceof OpenAI.APIError) {
    if (err.status === 401) {
      return `The ${providerId} API key is invalid or missing. Check it at ${consoleUrl}.`;
    }
    if (err.status === 429) {
      return providerId === "openrouter"
        ? "OpenRouter rate limit hit — free models are capped at 50 requests/day with no balance (1000/day if you've ever added $10+). Wait or try again tomorrow."
        : `${providerId} rate limit hit. Wait a moment and try again.`;
    }
    if (/credit|balance|insufficient|quota|no.*licenses/i.test(err.message)) {
      return `The ${providerId} account has no usable balance/credits for this model. Check ${consoleUrl} → Billing.`;
    }
    return `${providerId} API error ${err.status}: ${err.message}`;
  }
  return err instanceof Error ? err.message : "Something went wrong.";
}

export async function POST(request: NextRequest) {
  // Re-check auth here, not just in the layout — a Route Handler is independently
  // callable, and even the "free" provider still burns daily request quota.
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  let provider: ReturnType<typeof getProvider>;
  try {
    provider = getProvider();
  } catch (err) {
    const message = err instanceof ConfigError ? err.message : "LLM provider misconfigured.";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request body" }, { status: 400 });
  }

  const def = COMMANDS[body.command];
  if (!def) {
    return NextResponse.json({ error: "Unknown command" }, { status: 400 });
  }
  if (!body.primary?.trim()) {
    return NextResponse.json({ error: "Nothing to work with" }, { status: 400 });
  }

  // A command may *want* search (def.webSearch) without the active provider
  // actually being able to give it for free (provider.webSearchAvailable).
  const liveSearch = def.webSearch && provider.webSearchAvailable;

  const userPrompt = buildUserPrompt({
    command: body.command,
    primary: body.primary.trim(),
    area: body.area?.trim(),
    liveSearch,
  });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      try {
        if (liveSearch) {
          // Only the grok provider ever sets webSearchAvailable=true. Its search
          // tool only exists on /v1/responses, and xAI's docs don't publish that
          // endpoint's streaming SSE schema — rather than guess at an undocumented
          // wire format, this runs as one non-streaming call. The "status" event
          // covers the wait; recon already takes a minute-plus doing live research.
          send("status", { tool: "web_search" });

          const response = await provider.client.responses.create({
            model: provider.model,
            input: [
              { role: "system", content: FIELD_AGENT_SYSTEM },
              { role: "user", content: userPrompt },
            ],
            tools: [{ type: "web_search" }],
          });

          const text = response.output_text ?? "";
          if (!text.trim()) {
            send("error", { message: "Empty response from the model. Try again." });
          } else {
            send("text", text);
          }
          send("done", { stopReason: "complete" });
        } else {
          if (def.webSearch) {
            // Recon on a provider without free search — tell the user plainly
            // rather than silently degrading.
            send("status", { tool: "no_search" });
          }

          const completion = await provider.client.chat.completions.create({
            model: provider.model,
            stream: true,
            messages: [
              { role: "system", content: FIELD_AGENT_SYSTEM },
              { role: "user", content: userPrompt },
            ],
          });

          let sawText = false;
          let finishReason: string | null = null;

          for await (const chunk of completion) {
            const delta = chunk.choices[0]?.delta?.content;
            if (delta) {
              sawText = true;
              send("text", delta);
            }
            const reason = chunk.choices[0]?.finish_reason;
            if (reason) finishReason = reason;
          }

          if (!sawText) {
            send("error", {
              message:
                "Empty response from the model. Free-tier models occasionally return nothing — try again, or try a different OPENROUTER_MODEL.",
            });
          } else if (finishReason === "length") {
            send("error", { message: "Response hit the length limit — it may be cut short." });
          }
          send("done", { stopReason: finishReason ?? "complete" });
        }
      } catch (err) {
        send("error", { message: friendlyError(err, provider.consoleUrl, provider.id) });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
    },
  });
}
