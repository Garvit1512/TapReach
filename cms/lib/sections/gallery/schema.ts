import { z } from "zod";

export const galleryImageSchema = z.object({
  url: z.string().min(1),
  alt: z.string().default(""),
});

export const gallerySchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  images: z.array(galleryImageSchema).default([]),
});

export type GalleryImage = z.infer<typeof galleryImageSchema>;
export type GalleryContent = z.infer<typeof gallerySchema>;

export const galleryDefault: GalleryContent = {
  heading: "Gallery",
  images: [],
};
