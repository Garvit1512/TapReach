"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { undoLastAiCommand } from "./ai-actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Undo2 } from "lucide-react";

type Turn = { role: "user" | "assistant"; text: string };

const EXAMPLES = [
  "Change the hero heading to India's #1 Women Only Gym",
  "Add three testimonials from happy members",
  "Move testimonials above gallery",
  "Generate SEO title and description for this site",
];

export function CommandBar({ siteId, tenantId }: { siteId: string; tenantId: string }) {
  const router = useRouter();
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<Turn[]>([]);
  const [running, setRunning] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [undoing, startUndo] = useTransition();

  const send = async (text: string) => {
    if (!text.trim() || running) return;

    const sent: Turn = { role: "user", text: text.trim() };
    const priorHistory = history;
    setHistory((prev) => [...prev, sent]);
    setCommand("");
    setRunning(true);

    try {
      const res = await fetch("/api/ai/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId, command: sent.text, history: priorHistory }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Command failed.");

      setHistory((prev) => [...prev, { role: "assistant", text: data.summary || "Done." }]);

      if (data.status === "applied") {
        setCanUndo(true);
        router.refresh();
        toast.success(`Applied ${data.diff.length} change${data.diff.length === 1 ? "" : "s"}`);
      } else if (data.status === "no_change") {
        toast.info("No changes were made.");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Command failed.";
      setHistory((prev) => [...prev, { role: "assistant", text: message }]);
      toast.error(message);
    } finally {
      setRunning(false);
    }
  };

  const undo = () =>
    startUndo(async () => {
      try {
        await undoLastAiCommand(siteId, tenantId);
        setCanUndo(false);
        setHistory((prev) => [...prev, { role: "assistant", text: "Undid the last AI change." }]);
        router.refresh();
        toast.success("Undone");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Undo failed.");
      }
    });

  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Sparkles className="size-4" />
          AI command bar
        </div>
        {canUndo && (
          <Button variant="ghost" size="sm" onClick={undo} disabled={undoing}>
            <Undo2 className="size-3.5" />
            {undoing ? "Undoing..." : "Undo last AI change"}
          </Button>
        )}
      </div>

      {history.length > 0 && (
        <div className="mb-3 max-h-64 space-y-2 overflow-y-auto text-sm">
          {history.map((turn, i) => (
            <p
              key={i}
              className={
                turn.role === "user"
                  ? "rounded-md bg-background px-3 py-2"
                  : "px-3 py-2 text-muted-foreground"
              }
            >
              {turn.text}
            </p>
          ))}
          {running && <p className="px-3 py-2 text-muted-foreground">Working...</p>}
        </div>
      )}

      <Textarea
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send(command);
          }
        }}
        placeholder="Tell the AI what to change — e.g. 'Change the hero heading to Welcome to Iron Fitness'"
        rows={2}
        disabled={running}
      />

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={() => send(command)} disabled={running || !command.trim()}>
          {running ? "Running..." : "Run command"}
        </Button>
        {history.length === 0 &&
          EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => send(example)}
              disabled={running}
              className="rounded-full border px-3 py-1 text-xs text-muted-foreground hover:bg-background"
            >
              {example}
            </button>
          ))}
      </div>
    </div>
  );
}
