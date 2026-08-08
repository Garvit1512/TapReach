import { z } from "zod";

export const serviceItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().default(""),
});

export const servicesSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  items: z.array(serviceItemSchema).default([]),
});

export type ServiceItem = z.infer<typeof serviceItemSchema>;
export type ServicesContent = z.infer<typeof servicesSchema>;

export const servicesDefault: ServicesContent = {
  heading: "Services",
  items: [{ title: "Service one", description: "What this service includes." }],
};
