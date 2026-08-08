import { z } from "zod";

export const heroSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  subheading: z.string().default(""),
  ctaText: z.string().default(""),
  ctaLink: z.string().default(""),
  backgroundImageUrl: z.string().default(""),
});

export type HeroContent = z.infer<typeof heroSchema>;

export const heroDefault: HeroContent = {
  heading: "Your Business, One Tap Away",
  subheading: "A short line about what makes this business worth visiting.",
  ctaText: "Get in touch",
  ctaLink: "#contact",
  backgroundImageUrl: "",
};
