import type { HeroContent } from "./schema";

export function HeroRenderer({ content }: { content: HeroContent }) {
  return (
    <section
      className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-lg bg-cover bg-center px-6 py-20 text-center"
      style={{
        backgroundImage: content.backgroundImageUrl
          ? `linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4)), url(${content.backgroundImageUrl})`
          : undefined,
        backgroundColor: content.backgroundImageUrl ? undefined : "var(--muted)",
        color: content.backgroundImageUrl ? "white" : undefined,
      }}
    >
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight">{content.heading}</h1>
      {content.subheading && (
        <p className="max-w-xl text-lg text-muted-foreground">{content.subheading}</p>
      )}
      {content.ctaText && (
        <span className="mt-2 inline-flex rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
          {content.ctaText}
        </span>
      )}
    </section>
  );
}
