import { z } from "zod";

export const pricingTierSchema = z.object({
  name: z.string().min(1),
  price: z.string().default(""),
  period: z.string().default("one-time"),
  features: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  ctaText: z.string().default("Get started"),
});

export const pricingSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  tiers: z.array(pricingTierSchema).default([]),
});

export type PricingTier = z.infer<typeof pricingTierSchema>;
export type PricingContent = z.infer<typeof pricingSchema>;

export const pricingDefault: PricingContent = {
  heading: "Pricing",
  tiers: [
    { name: "Standard", price: "", period: "one-time", features: [], featured: false, ctaText: "Get started" },
  ],
};
