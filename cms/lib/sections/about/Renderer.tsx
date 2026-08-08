import type { AboutContent } from "./schema";

export function AboutRenderer({ content }: { content: AboutContent }) {
  return (
    <section className="grid grid-cols-1 gap-6 rounded-lg border p-8 md:grid-cols-2 md:items-center">
      {content.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={content.imageUrl} alt="" className="aspect-video w-full rounded-md object-cover" />
      ) : (
        <div className="aspect-video w-full rounded-md bg-muted" />
      )}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{content.heading}</h2>
        <p className="mt-3 whitespace-pre-line text-muted-foreground">{content.body}</p>
      </div>
    </section>
  );
}
