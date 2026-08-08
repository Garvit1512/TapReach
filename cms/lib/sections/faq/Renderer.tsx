import type { FaqContent } from "./schema";

export function FaqRenderer({ content }: { content: FaqContent }) {
  return (
    <section className="rounded-lg border p-8">
      <h2 className="text-2xl font-semibold tracking-tight">{content.heading}</h2>
      <div className="mt-6 space-y-4">
        {content.items.map((item, i) => (
          <div key={i}>
            <h3 className="font-medium">{item.question}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
