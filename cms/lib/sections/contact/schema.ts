import { z } from "zod";

export const contactSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  phone: z.string().default(""),
  email: z.string().default(""),
  address: z.string().default(""),
  formEnabled: z.boolean().default(true),
});

export type ContactContent = z.infer<typeof contactSchema>;

export const contactDefault: ContactContent = {
  heading: "Get in touch",
  phone: "",
  email: "",
  address: "",
  formEnabled: true,
};
