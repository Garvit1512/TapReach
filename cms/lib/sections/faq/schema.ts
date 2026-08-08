import { z } from "zod";

export const faqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().default(""),
});

export const faqSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  items: z.array(faqItemSchema).default([]),
});

export type FaqItem = z.infer<typeof faqItemSchema>;
export type FaqContent = z.infer<typeof faqSchema>;

export const faqDefault: FaqContent = {
  heading: "Frequently asked questions",
  items: [{ question: "Question one?", answer: "Answer one." }],
};
