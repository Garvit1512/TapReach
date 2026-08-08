import type { GalleryContent } from "./schema";

export function GalleryRenderer({ content }: { content: GalleryContent }) {
  return (
    <section className="rounded-lg border p-8">
      <h2 className="text-2xl font-semibold tracking-tight">{content.heading}</h2>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {content.images.map((img, i) =>
          img.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={img.url} alt={img.alt} className="aspect-square w-full rounded-md object-cover" />
          ) : (
            <div key={i} className="aspect-square w-full rounded-md bg-muted" />
          ),
        )}
        {content.images.length === 0 && (
          <p className="col-span-full text-sm text-muted-foreground">No images yet.</p>
        )}
      </div>
    </section>
  );
}
