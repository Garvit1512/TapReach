import { z } from "zod";

export const footerLinkSchema = z.object({
  label: z.string().min(1),
  url: z.string().default(""),
});

export const footerSchema = z.object({
  text: z.string().default(""),
  links: z.array(footerLinkSchema).default([]),
  socialLinks: z.array(footerLinkSchema).default([]),
});

export type FooterLink = z.infer<typeof footerLinkSchema>;
export type FooterContent = z.infer<typeof footerSchema>;

export const footerDefault: FooterContent = {
  text: `© ${new Date().getFullYear()} Your Business. All rights reserved.`,
  links: [],
  socialLinks: [],
};
