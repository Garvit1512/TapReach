import { z } from "zod";

export const aboutSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  body: z.string().default(""),
  imageUrl: z.string().default(""),
});

export type AboutContent = z.infer<typeof aboutSchema>;

export const aboutDefault: AboutContent = {
  heading: "About Us",
  body: "Tell customers what makes this business different.",
  imageUrl: "",
};
