import type { PricingContent } from "./schema";

export function PricingRenderer({ content }: { content: PricingContent }) {
  return (
    <section className="rounded-lg border p-8">
      <h2 className="text-2xl font-semibold tracking-tight">{content.heading}</h2>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {content.tiers.map((tier, i) => (
          <div
            key={i}
            className={`rounded-md border p-5 ${tier.featured ? "border-primary ring-1 ring-primary" : ""}`}
          >
            <h3 className="font-medium">{tier.name}</h3>
            <p className="mt-2 text-2xl font-semibold">
              {tier.price} <span className="text-sm font-normal text-muted-foreground">{tier.period}</span>
            </p>
            <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
              {tier.features.map((f, fi) => (
                <li key={fi}>• {f}</li>
              ))}
            </ul>
            <span className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              {tier.ctaText}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
