"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { Output } from "./Output";
import { VoiceInput } from "./VoiceInput";
import type { CommandDef } from "@/lib/prompts/commands";

interface Props {
  def: CommandDef;
  /** Label + placeholder for the main input. */
  primaryLabel: string;
  primaryPlaceholder: string;
  /** Single-line input (recon) vs big textarea (everything else). */
  primaryKind: "line" | "paste";
  /** recon only — the second field. */
  areaLabel?: string;
  /** Shown above the form. */
  hint?: string;
  /** Lets the dictation button appear (debrief only). */
  allowVoice?: boolean;
}

export function AgentRunner({
  def,
  primaryLabel,
  primaryPlaceholder,
  primaryKind,
  areaLabel,
  hint,
  allowVoice,
}: Props) {
  const [primary, setPrimary] = useState("");
  const [area, setArea] = useState("");
  const [output, setOutput] = useState("");
  const [thinking, setThinking] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const appendDictation = useCallback((chunk: string) => {
    setPrimary((prev) => (prev ? `${prev} ${chunk}` : chunk));
  }, []);

  async function run() {
    if (!primary.trim() || running) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setRunning(true);
    setOutput("");
    setThinking("");
    setStatus(null);
    setError(null);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ command: def.id, primary, area }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const detail = await res.json().catch(() => null);
        throw new Error(detail?.error ?? `Request failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // SSE frames are separated by a blank line.
        const frames = buffer.split("\n\n");
        buffer = frames.pop() ?? "";

        for (const frame of frames) {
          const eventLine = frame.match(/^event: (.+)$/m);
          const dataLine = frame.match(/^data: (.+)$/m);
          if (!eventLine || !dataLine) continue;

          const event = eventLine[1];
          let data: unknown;
          try {
            data = JSON.parse(dataLine[1]);
          } catch {
            continue;
          }

          if (event === "text") {
            setOutput((prev) => prev + (data as string));
            setStatus(null);
          } else if (event === "thinking") {
            setThinking((prev) => (prev + (data as string)).slice(-400));
          } else if (event === "status") {
            const tool = (data as { tool?: string }).tool;
            setStatus(tool === "web_search" ? "Searching the web…" : "Working…");
          } else if (event === "error") {
            setError((data as { message: string }).message);
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    } finally {
      setRunning(false);
      setStatus(null);
    }
  }

  function stop() {
    abortRef.current?.abort();
    setRunning(false);
  }

  const canRun = primary.trim().length > 0 && !running;

  return (
    <div className="pb-28">
      <header className="sticky top-0 z-10 border-b border-line bg-bg/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <Link
            href="/"
            className="rounded-[10px] border border-line-2 px-2.5 py-1 text-[13px] text-fg-2 active:bg-elevated"
          >
            ←
          </Link>
          <div className="min-w-0">
            <h1 className="truncate font-[family-name:var(--font-display)] text-[15px] font-bold">
              {def.emoji} {def.label}
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-5">
        {hint && <p className="mb-4 text-[13.5px] leading-relaxed text-fg-3">{hint}</p>}

        <label className="mb-1.5 block text-[13px] font-semibold text-fg-2">{primaryLabel}</label>
        {primaryKind === "line" ? (
          <input
            value={primary}
            onChange={(e) => setPrimary(e.target.value)}
            placeholder={primaryPlaceholder}
            enterKeyHint="done"
            className="w-full rounded-[var(--tr-radius)] border border-line-2 bg-elevated px-3.5 py-3 text-[16px] text-fg outline-none placeholder:text-fg-muted focus:border-[var(--tr-green-line)]"
          />
        ) : (
          <textarea
            value={primary}
            onChange={(e) => setPrimary(e.target.value)}
            placeholder={primaryPlaceholder}
            rows={9}
            className="w-full resize-y rounded-[var(--tr-radius)] border border-line-2 bg-elevated px-3.5 py-3 text-[16px] leading-relaxed text-fg outline-none placeholder:text-fg-muted focus:border-[var(--tr-green-line)]"
          />
        )}

        {areaLabel && (
          <>
            <label className="mt-4 mb-1.5 block text-[13px] font-semibold text-fg-2">
              {areaLabel}
            </label>
            <input
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="Lajpat Nagar, Noida Sector 18, Gurgaon…"
              enterKeyHint="done"
              className="w-full rounded-[var(--tr-radius)] border border-line-2 bg-elevated px-3.5 py-3 text-[16px] text-fg outline-none placeholder:text-fg-muted focus:border-[var(--tr-green-line)]"
            />
          </>
        )}

        {allowVoice && (
          <div className="mt-3">
            <VoiceInput onText={appendDictation} />
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-[var(--tr-radius)] border border-[rgba(255,122,99,0.35)] bg-[rgba(255,122,99,0.08)] px-3.5 py-3 text-[13.5px] leading-relaxed text-[var(--tr-coral)]">
            {error}
          </div>
        )}

        {running && !output && (
          <div className="mt-5 rounded-[var(--tr-radius)] border border-line bg-raised px-3.5 py-4">
            <p className="flex items-center gap-2 text-[13px] font-semibold text-green">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green" />
              {status ?? "Thinking…"}
            </p>
            {thinking && (
              <p className="mt-2 line-clamp-3 text-[12.5px] leading-relaxed text-fg-muted">
                {thinking}
              </p>
            )}
          </div>
        )}

        {output && (
          <section className="mt-6 border-t border-line pt-5">
            <Output text={output} />
            {running && (
              <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-green align-middle" />
            )}
          </section>
        )}
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t border-line bg-bg/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur">
        <div className="mx-auto flex max-w-2xl gap-2">
          <button
            type="button"
            onClick={run}
            disabled={!canRun}
            className="flex-1 rounded-[12px] bg-green px-4 py-3.5 text-[15px] font-bold text-[#070707] transition-opacity disabled:opacity-35"
          >
            {running ? "Working…" : output ? "Run again" : "Go"}
          </button>
          {running && (
            <button
              type="button"
              onClick={stop}
              className="rounded-[12px] border border-line-2 px-4 py-3.5 text-[14px] font-semibold text-fg-2"
            >
              Stop
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
