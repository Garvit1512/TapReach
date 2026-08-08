import type { TestimonialsContent } from "./schema";

export function TestimonialsRenderer({ content }: { content: TestimonialsContent }) {
  return (
    <section className="rounded-lg border p-8">
      <h2 className="text-2xl font-semibold tracking-tight">{content.heading}</h2>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {content.items.map((t, i) => (
          <figure key={i} className="rounded-md border p-4">
            <blockquote className="text-sm">&ldquo;{t.quote}&rdquo;</blockquote>
            <figcaption className="mt-3 text-xs text-muted-foreground">
              {t.name}
              {t.business && ` · ${t.business}`}
            </figcaption>
          </figure>
        ))}
        {content.items.length === 0 && (
          <p className="text-sm text-muted-foreground">No testimonials yet.</p>
        )}
      </div>
    </section>
  );
}
