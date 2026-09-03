import type { IconName, SectionType } from "@/lib/content/types";

// Visual identity for each section type in the page builder.
export const SECTION_ICONS: Record<SectionType, IconName> = {
  hero: "camera",
  "page-header": "layout",
  stats: "star",
  "services-grid": "wrench",
  "services-detail": "wrench",
  "featured-project": "building",
  "feature-cards": "sparkle",
  "image-text": "camera",
  "rich-text": "layout",
  "testimonial-spotlight": "heart",
  "testimonials-grid": "heart",
  "projects-list": "building",
  "videos-grid": "video",
  "video-embed": "video",
  gallery: "camera",
  "process-steps": "check",
  timeline: "clock",
  faq: "eye",
  cta: "phone",
  "contact-form": "phone",
  "careers-positions": "users",
  "careers-perks": "users",
};

export const SECTION_COLORS: Record<SectionType, string> = Object.fromEntries(
  (Object.keys(SECTION_ICONS) as SectionType[]).map((t) => [t, "bg-gold/10 text-gold-dark"])
) as Record<SectionType, string>;
