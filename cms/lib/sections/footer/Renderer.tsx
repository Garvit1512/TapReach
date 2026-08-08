import type { FooterContent } from "./schema";

export function FooterRenderer({ content }: { content: FooterContent }) {
  return (
    <footer className="rounded-lg border p-6 text-sm text-muted-foreground">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p>{content.text}</p>
        <div className="flex flex-wrap gap-4">
          {content.links.map((l, i) => (
            <span key={i}>{l.label}</span>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          {content.socialLinks.map((s, i) => (
            <span key={i}>{s.label}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}
