import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { FIELD_AGENT_SYSTEM } from "@/lib/prompts/field-agent";
import { COMMANDS, buildUserPrompt, type CommandId } from "@/lib/prompts/commands";

// Recon does live web research and can run well over a minute.
export const maxDuration = 300;

const client = new Anthropic();

interface Body {
  command: CommandId;
  primary: string;
  area?: string;
}

export async function POST(request: NextRequest) {
  // Re-check auth here, not just in the layout — a Route Handler is independently
  // callable, and this endpoint spends money.
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not set on the server." },
      { status: 500 },
    );
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

  const userPrompt = buildUserPrompt({
    command: body.command,
    primary: body.primary.trim(),
    area: body.area?.trim(),
  });

  // Only recon needs the web. Handing search to the others just invites the model
  // to go looking for context it was already given in the paste.
  const tools = def.webSearch
    ? [{ type: "web_search_20260209" as const, name: "web_search" as const, max_uses: 12 }]
    : undefined;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      try {
        const claude = client.beta.messages.stream({
          model: "claude-opus-5",
          max_tokens: 32000,
          // Thinking is on by default on Opus 5; asking for the summary gives the UI
          // something to show during the long silence while recon searches the web.
          thinking: { type: "adaptive", display: "summarized" },
          output_config: { effort: def.effort },
          // Opus 5's safety classifiers can decline; "default" re-runs on Anthropic's
          // recommended fallback rather than handing the user a dead screen.
          betas: ["server-side-fallback-2026-07-01"],
          fallbacks: "default",
          system: [
            {
              type: "text",
              text: FIELD_AGENT_SYSTEM,
              // Stable across every request — worth caching, it's a big prompt.
              cache_control: { type: "ephemeral" },
            },
          ],
          messages: [{ role: "user", content: userPrompt }],
          ...(tools ? { tools } : {}),
        });

        claude.on("thinking", (delta) => send("thinking", delta));
        claude.on("text", (delta) => send("text", delta));

        // Web search runs server-side; surface it so the user knows why it's slow.
        claude.on("streamEvent", (event) => {
          if (
            event.type === "content_block_start" &&
            event.content_block.type === "server_tool_use"
          ) {
            send("status", { tool: event.content_block.name });
          }
        });

        const final = await claude.finalMessage();

        if (final.stop_reason === "refusal") {
          send("error", {
            message:
              "Claude declined this request. Rephrase it, or drop anything that reads as a security or medical claim.",
          });
        } else if (final.stop_reason === "max_tokens") {
          send("error", { message: "Response hit the length limit — it may be cut short." });
        }

        send("done", { stopReason: final.stop_reason });
      } catch (err) {
        const message =
          err instanceof Anthropic.APIError
            ? err.status === 400 && /credit|balance/i.test(err.message)
              ? "The Anthropic account is out of API credits. Add credits at console.anthropic.com → Plans & Billing."
              : `Claude API error ${err.status}: ${err.message}`
            : err instanceof Error
              ? err.message
              : "Something went wrong.";
        send("error", { message });
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
