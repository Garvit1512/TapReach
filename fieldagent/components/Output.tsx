"use client";

import { useState, type ReactNode } from "react";

/**
 * Renders the model's output.
 *
 * Deliberately hand-rolled rather than pulling a markdown library: the output
 * shapes are known (headings, bold, lists, fenced blocks) and the one feature that
 * actually matters here — a copy button on every fenced block, because that's the
 * Google Sheets workflow — is easier to build than to retrofit onto a renderer.
 */

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API needs a secure context; fall back to a selection copy.
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={`shrink-0 rounded-[10px] border px-3 py-1.5 text-[12px] font-semibold transition-colors ${
        copied
          ? "border-[var(--tr-green-line)] bg-[var(--tr-green-soft)] text-green"
          : "border-line-2 bg-elevated text-fg-2 active:bg-card"
      }`}
    >
      {copied ? "Copied ✓" : label}
    </button>
  );
}

/** A fenced block. Single-line tab-separated content gets the "paste into sheet" treatment. */
function Block({ content }: { content: string }) {
  const trimmed = content.replace(/\n+$/, "");
  const singleLine = !trimmed.includes("\n");
  // Tab-separated single line = a sheet row. Any other single line (e.g. the
  // pipe-separated weakness-log entry) is still one-tap copyable, just not a row.
  const kind = singleLine ? (trimmed.includes("\t") ? "sheet" : "line") : "card";
  const heading = kind === "sheet" ? "Sheet row" : kind === "line" ? "Log line" : "Card";

  return (
    <div className="my-3 overflow-hidden rounded-[var(--tr-radius)] border border-line-2 bg-[#0a0a0a]">
      <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-fg-3">
          {heading}
        </span>
        <CopyButton text={trimmed} label={kind === "sheet" ? "Copy row" : "Copy"} />
      </div>
      {/* Wide content scrolls inside its own container — the page never scrolls sideways. */}
      <pre className="overflow-x-auto px-3 py-3 text-[12.5px] leading-[1.6]">
        <code className="font-[ui-monospace,'SF_Mono',Menlo,monospace] whitespace-pre text-fg">
          {trimmed}
        </code>
      </pre>
    </div>
  );
}

/** Inline `code`, **bold**, *italic*, and bare URLs. */
function inline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*\n]+\*|https?:\/\/\S+)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const token = match[0];
    const key = `${keyPrefix}-${i++}`;

    if (token.startsWith("`")) {
      nodes.push(<code key={key}>{token.slice(1, -1)}</code>);
    } else if (token.startsWith("**")) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("*")) {
      nodes.push(<em key={key}>{token.slice(1, -1)}</em>);
    } else {
      nodes.push(
        <a key={key} href={token} target="_blank" rel="noopener noreferrer">
          {token}
        </a>,
      );
    }
    last = match.index + token.length;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Output({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  // Split on fences, keeping them. An unterminated fence (mid-stream) still renders.
  const segments = text.split(/```/);

  segments.forEach((segment, si) => {
    if (si % 2 === 1) {
      // Inside a fence. Drop an optional language tag on the first line.
      const body = segment.replace(/^[a-zA-Z0-9-]*\n/, "");
      if (body.trim()) parts.push(<Block key={`b-${si}`} content={body} />);
      return;
    }

    let list: ReactNode[] = [];
    let ordered = false;
    // Consecutive plain lines are one paragraph. Joining them before formatting is
    // what lets **bold** and *italic* survive a wrap — the model hard-wraps its
    // prose, so a quoted Hinglish line routinely straddles two source lines.
    let para: string[] = [];

    const flushList = (key: string) => {
      if (!list.length) return;
      parts.push(ordered ? <ol key={key}>{list}</ol> : <ul key={key}>{list}</ul>);
      list = [];
    };
    const flushPara = (key: string) => {
      if (!para.length) return;
      const text = para.join(" ");
      parts.push(<p key={key}>{inline(text, key)}</p>);
      para = [];
    };
    const flushAll = (key: string) => {
      flushPara(`p-${key}`);
      flushList(`l-${key}`);
    };

    segment.split("\n").forEach((line, li) => {
      const key = `${si}-${li}`;
      const t = line.trim();

      if (!t) {
        flushAll(key);
        return;
      }

      const bullet = t.match(/^[-*]\s+(.*)$/);
      const numbered = t.match(/^(\d+)[.)]\s+(.*)$/);

      if (bullet) {
        flushPara(`p-${key}`);
        if (ordered) flushList(`l-${key}`);
        ordered = false;
        list.push(<li key={key}>{inline(bullet[1], key)}</li>);
        return;
      }
      if (numbered) {
        flushPara(`p-${key}`);
        if (!ordered) flushList(`l-${key}`);
        ordered = true;
        list.push(<li key={key}>{inline(numbered[2], key)}</li>);
        return;
      }

      if (t.startsWith("#") || /^(---+|___+)$/.test(t)) {
        flushAll(key);
        if (t.startsWith("### ")) parts.push(<h3 key={key}>{inline(t.slice(4), key)}</h3>);
        else if (t.startsWith("## ")) parts.push(<h2 key={key}>{inline(t.slice(3), key)}</h2>);
        else if (t.startsWith("# ")) parts.push(<h2 key={key}>{inline(t.slice(2), key)}</h2>);
        else parts.push(<hr key={key} />);
        return;
      }

      // A continuation of the current paragraph.
      flushList(`l-${key}`);
      para.push(t);
    });

    flushAll(`end-${si}`);
  });

  return <div className="md">{parts}</div>;
}
