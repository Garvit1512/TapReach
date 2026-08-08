import type { ServicesContent } from "./schema";

export function ServicesRenderer({ content }: { content: ServicesContent }) {
  return (
    <section className="rounded-lg border p-8">
      <h2 className="text-2xl font-semibold tracking-tight">{content.heading}</h2>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {content.items.map((item, i) => (
          <div key={i} className="rounded-md border p-4">
            <h3 className="font-medium">{item.title}</h3>
            {item.description && (
              <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
