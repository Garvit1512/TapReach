import { z } from "zod";

export const testimonialItemSchema = z.object({
  quote: z.string().min(1),
  name: z.string().default(""),
  business: z.string().default(""),
  rating: z.number().min(1).max(5).default(5),
});

export const testimonialsSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  items: z.array(testimonialItemSchema).default([]),
});

export type TestimonialItem = z.infer<typeof testimonialItemSchema>;
export type TestimonialsContent = z.infer<typeof testimonialsSchema>;

export const testimonialsDefault: TestimonialsContent = {
  heading: "What our customers say",
  items: [],
};
