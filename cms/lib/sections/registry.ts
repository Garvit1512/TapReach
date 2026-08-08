import type { SectionDefinition, SectionType } from "./types";

import { heroSchema, heroDefault } from "./hero/schema";
import { HeroRenderer } from "./hero/Renderer";
import { HeroEditorForm } from "./hero/EditorForm";

import { aboutSchema, aboutDefault } from "./about/schema";
import { AboutRenderer } from "./about/Renderer";
import { AboutEditorForm } from "./about/EditorForm";

import { servicesSchema, servicesDefault } from "./services/schema";
import { ServicesRenderer } from "./services/Renderer";
import { ServicesEditorForm } from "./services/EditorForm";

import { gallerySchema, galleryDefault } from "./gallery/schema";
import { GalleryRenderer } from "./gallery/Renderer";
import { GalleryEditorForm } from "./gallery/EditorForm";

import { pricingSchema, pricingDefault } from "./pricing/schema";
import { PricingRenderer } from "./pricing/Renderer";
import { PricingEditorForm } from "./pricing/EditorForm";

import { testimonialsSchema, testimonialsDefault } from "./testimonials/schema";
import { TestimonialsRenderer } from "./testimonials/Renderer";
import { TestimonialsEditorForm } from "./testimonials/EditorForm";

import { contactSchema, contactDefault } from "./contact/schema";
import { ContactRenderer } from "./contact/Renderer";
import { ContactEditorForm } from "./contact/EditorForm";

import { faqSchema, faqDefault } from "./faq/schema";
import { FaqRenderer } from "./faq/Renderer";
import { FaqEditorForm } from "./faq/EditorForm";

import { footerSchema, footerDefault } from "./footer/schema";
import { FooterRenderer } from "./footer/Renderer";
import { FooterEditorForm } from "./footer/EditorForm";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SECTION_REGISTRY: Record<SectionType, SectionDefinition<any>> = {
  hero: {
    label: "Hero",
    schema: heroSchema,
    defaultContent: heroDefault,
    Renderer: HeroRenderer,
    EditorForm: HeroEditorForm,
  },
  about: {
    label: "About",
    schema: aboutSchema,
    defaultContent: aboutDefault,
    Renderer: AboutRenderer,
    EditorForm: AboutEditorForm,
  },
  services: {
    label: "Services",
    schema: servicesSchema,
    defaultContent: servicesDefault,
    Renderer: ServicesRenderer,
    EditorForm: ServicesEditorForm,
  },
  gallery: {
    label: "Gallery",
    schema: gallerySchema,
    defaultContent: galleryDefault,
    Renderer: GalleryRenderer,
    EditorForm: GalleryEditorForm,
  },
  pricing: {
    label: "Pricing",
    schema: pricingSchema,
    defaultContent: pricingDefault,
    Renderer: PricingRenderer,
    EditorForm: PricingEditorForm,
  },
  testimonials: {
    label: "Testimonials",
    schema: testimonialsSchema,
    defaultContent: testimonialsDefault,
    Renderer: TestimonialsRenderer,
    EditorForm: TestimonialsEditorForm,
  },
  contact: {
    label: "Contact",
    schema: contactSchema,
    defaultContent: contactDefault,
    Renderer: ContactRenderer,
    EditorForm: ContactEditorForm,
  },
  faq: {
    label: "FAQ",
    schema: faqSchema,
    defaultContent: faqDefault,
    Renderer: FaqRenderer,
    EditorForm: FaqEditorForm,
  },
  footer: {
    label: "Footer",
    schema: footerSchema,
    defaultContent: footerDefault,
    Renderer: FooterRenderer,
    EditorForm: FooterEditorForm,
  },
};
