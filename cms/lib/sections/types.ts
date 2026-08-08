import type { z } from "zod";
import type { ComponentType } from "react";

export const SECTION_TYPES = [
  "hero",
  "about",
  "services",
  "gallery",
  "pricing",
  "testimonials",
  "contact",
  "faq",
  "footer",
] as const;

export type SectionType = (typeof SECTION_TYPES)[number];

export type Section = {
  id: string;
  site_id: string;
  tenant_id: string;
  type: SectionType;
  position: number;
  content: Record<string, unknown>;
  is_visible: boolean;
};

export type SectionDefinition<T = Record<string, unknown>> = {
  label: string;
  schema: z.ZodType<T>;
  defaultContent: T;
  Renderer: ComponentType<{ content: T }>;
  EditorForm: ComponentType<{ content: T; onSave: (content: T) => Promise<void> }>;
};
