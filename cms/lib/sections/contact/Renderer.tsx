import type { ContactContent } from "./schema";

export function ContactRenderer({ content }: { content: ContactContent }) {
  return (
    <section className="rounded-lg border p-8">
      <h2 className="text-2xl font-semibold tracking-tight">{content.heading}</h2>
      <div className="mt-4 space-y-1 text-sm text-muted-foreground">
        {content.phone && <p>{content.phone}</p>}
        {content.email && <p>{content.email}</p>}
        {content.address && <p>{content.address}</p>}
      </div>
      {content.formEnabled && (
        <div className="mt-4 rounded-md border border-dashed p-4 text-sm text-muted-foreground">
          Contact form placeholder
        </div>
      )}
    </section>
  );
}
