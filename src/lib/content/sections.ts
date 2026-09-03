import type { SectionType } from "./types";

// Field schema for the page builder. The admin renders a form from this, so a
// new section type only needs an entry here plus a renderer in
// src/components/sections/.
export type FieldKind =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "select"
  | "image"
  | "link"
  | "icon"
  | "project"
  | "video"
  | "testimonial"
  | "string-list"
  | "items";

export interface FieldDef {
  key: string;
  label: string;
  kind: FieldKind;
  help?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  // for kind === "items": nested fields of each repeater row
  fields?: FieldDef[];
  itemLabel?: string;
}

export interface SectionDef {
  type: SectionType;
  label: string;
  description: string;
  fields: FieldDef[];
  // Which pages this section makes sense on. Empty = any page.
  defaults: Record<string, unknown>;
}

const cta = (key: string, label: string): FieldDef => ({
  key,
  label,
  kind: "link",
});

export const SECTION_REGISTRY: Record<SectionType, SectionDef> = {
  hero: {
    type: "hero",
    label: "Hero banner",
    description: "Full-width photo with headline and buttons.",
    fields: [
      { key: "eyebrow", label: "Small label above headline", kind: "text" },
      { key: "heading", label: "Headline", kind: "text" },
      {
        key: "headingAccent",
        label: "Headline (gold part)",
        kind: "text",
        help: "Shown after the headline in gold.",
      },
      { key: "text", label: "Paragraph", kind: "textarea" },
      { key: "image", label: "Background photo", kind: "image" },
      cta("primaryCta", "Primary button"),
      cta("secondaryCta", "Secondary button"),
    ],
    defaults: {
      eyebrow: "",
      heading: "",
      headingAccent: "",
      text: "",
      image: { url: "", alt: "" },
      primaryCta: { label: "", href: "" },
      secondaryCta: { label: "", href: "" },
    },
  },
  "page-header": {
    type: "page-header",
    label: "Page title",
    description: "Label, headline and intro paragraph at the top of a page.",
    fields: [
      { key: "eyebrow", label: "Small label", kind: "text" },
      { key: "heading", label: "Headline", kind: "text" },
      { key: "headingAccent", label: "Headline (gold part)", kind: "text" },
      { key: "text", label: "Intro paragraph", kind: "textarea" },
    ],
    defaults: { eyebrow: "", heading: "", headingAccent: "", text: "" },
  },
  stats: {
    type: "stats",
    label: "Stats row",
    description: "Row of big numbers with labels.",
    fields: [
      {
        key: "items",
        label: "Stats",
        kind: "items",
        itemLabel: "Stat",
        fields: [
          { key: "value", label: "Value", kind: "text", placeholder: "100%" },
          { key: "label", label: "Label", kind: "text" },
        ],
      },
    ],
    defaults: { items: [] },
  },
  "services-grid": {
    type: "services-grid",
    label: "Services grid",
    description: "Cards for each service marked 'show on home'.",
    fields: [
      { key: "eyebrow", label: "Small label", kind: "text" },
      { key: "heading", label: "Headline", kind: "text" },
      { key: "text", label: "Paragraph", kind: "textarea" },
      cta("cta", "Link below the grid"),
    ],
    defaults: {
      eyebrow: "What We Do",
      heading: "",
      text: "",
      cta: { label: "View All Services", href: "/services" },
    },
  },
  "services-detail": {
    type: "services-detail",
    label: "Services detail",
    description:
      "Primary services in alternating photo rows, then the rest of the service menu as cards. Edit the services themselves under Services.",
    fields: [
      { key: "additionalEyebrow", label: "Menu small label", kind: "text" },
      { key: "additionalHeading", label: "Menu headline", kind: "text" },
    ],
    defaults: {
      additionalEyebrow: "Additional Capabilities",
      additionalHeading: "Full Service Menu",
    },
  },
  "featured-project": {
    type: "featured-project",
    label: "Featured project",
    description: "Highlight one project with photo and scope.",
    fields: [
      { key: "eyebrow", label: "Small label", kind: "text" },
      {
        key: "projectId",
        label: "Project",
        kind: "project",
        help: "Leave empty to automatically show the newest featured project.",
      },
      cta("cta", "Link"),
    ],
    defaults: {
      eyebrow: "Featured Project",
      projectId: "",
      cta: { label: "See All Projects", href: "/portfolio" },
    },
  },
  "feature-cards": {
    type: "feature-cards",
    label: "Feature cards",
    description: "Grid of icon + title + text (e.g. 'Why M&M', 'Core Values').",
    fields: [
      { key: "eyebrow", label: "Small label", kind: "text" },
      { key: "heading", label: "Headline", kind: "text" },
      { key: "text", label: "Paragraph", kind: "textarea" },
      {
        key: "style",
        label: "Style",
        kind: "select",
        options: [
          { value: "plain", label: "Plain (no card border)" },
          { value: "cards", label: "Cards" },
        ],
      },
      {
        key: "align",
        label: "Heading alignment",
        kind: "select",
        options: [
          { value: "left", label: "Left" },
          { value: "center", label: "Center" },
        ],
      },
      {
        key: "items",
        label: "Items",
        kind: "items",
        itemLabel: "Item",
        fields: [
          { key: "icon", label: "Icon", kind: "icon" },
          { key: "title", label: "Title", kind: "text" },
          { key: "text", label: "Text", kind: "textarea" },
        ],
      },
    ],
    defaults: {
      eyebrow: "",
      heading: "",
      text: "",
      style: "plain",
      align: "left",
      items: [],
    },
  },
  "image-text": {
    type: "image-text",
    label: "Photo + text",
    description: "Photo on one side, headline and paragraphs on the other.",
    fields: [
      { key: "eyebrow", label: "Small label", kind: "text" },
      { key: "heading", label: "Headline", kind: "text" },
      {
        key: "body",
        label: "Paragraphs",
        kind: "textarea",
        help: "Separate paragraphs with a blank line.",
      },
      { key: "image", label: "Photo", kind: "image" },
      {
        key: "imageSide",
        label: "Photo side",
        kind: "select",
        options: [
          { value: "right", label: "Right" },
          { value: "left", label: "Left" },
        ],
      },
      {
        key: "aspect",
        label: "Photo shape",
        kind: "select",
        options: [
          { value: "4/3", label: "Landscape (4:3)" },
          { value: "1/1", label: "Square" },
          { value: "3/4", label: "Portrait (3:4)" },
        ],
      },
      { key: "bullets", label: "Bullet points", kind: "string-list" },
      cta("cta", "Link"),
      {
        key: "background",
        label: "Background",
        kind: "select",
        options: [
          { value: "plain", label: "White" },
          { value: "tint", label: "Warm gray" },
        ],
      },
    ],
    defaults: {
      eyebrow: "",
      heading: "",
      body: "",
      image: { url: "", alt: "" },
      imageSide: "right",
      aspect: "4/3",
      bullets: [],
      cta: { label: "", href: "" },
      background: "tint",
    },
  },
  "rich-text": {
    type: "rich-text",
    label: "Text block",
    description: "Headline and paragraphs, no photo.",
    fields: [
      { key: "eyebrow", label: "Small label", kind: "text" },
      { key: "heading", label: "Headline", kind: "text" },
      {
        key: "body",
        label: "Paragraphs",
        kind: "textarea",
        help: "Separate paragraphs with a blank line. Start a line with '- ' for a bullet.",
      },
      {
        key: "align",
        label: "Alignment",
        kind: "select",
        options: [
          { value: "left", label: "Left" },
          { value: "center", label: "Center" },
        ],
      },
    ],
    defaults: { eyebrow: "", heading: "", body: "", align: "left" },
  },
  "testimonial-spotlight": {
    type: "testimonial-spotlight",
    label: "Testimonial spotlight",
    description: "One big quote with stars.",
    fields: [
      {
        key: "testimonialId",
        label: "Testimonial",
        kind: "testimonial",
        help: "Leave empty to show the first featured testimonial.",
      },
      cta("cta", "Link"),
    ],
    defaults: {
      testimonialId: "",
      cta: { label: "Read More Reviews", href: "/testimonials" },
    },
  },
  "testimonials-grid": {
    type: "testimonials-grid",
    label: "Testimonials grid",
    description: "All published testimonials in cards.",
    fields: [
      { key: "limit", label: "Max to show (0 = all)", kind: "number" },
    ],
    defaults: { limit: 0 },
  },
  "projects-list": {
    type: "projects-list",
    label: "Projects list",
    description: "Alternating photo/details rows for projects.",
    fields: [
      {
        key: "status",
        label: "Which projects",
        kind: "select",
        options: [
          { value: "all", label: "All" },
          { value: "completed", label: "Completed only" },
          { value: "in-progress", label: "In progress only" },
          { value: "planned", label: "Upcoming only" },
        ],
      },
      { key: "limit", label: "Max to show (0 = all)", kind: "number" },
      {
        key: "layout",
        label: "Layout",
        kind: "select",
        options: [
          { value: "rows", label: "Alternating rows (detailed)" },
          { value: "grid", label: "Card grid (compact)" },
        ],
      },
    ],
    defaults: { status: "all", limit: 0, layout: "rows" },
  },
  "videos-grid": {
    type: "videos-grid",
    label: "Videos grid",
    description: "Grid of video cards that open a player.",
    fields: [
      { key: "eyebrow", label: "Small label", kind: "text" },
      { key: "heading", label: "Headline", kind: "text" },
      { key: "text", label: "Paragraph", kind: "textarea" },
      { key: "limit", label: "Max to show (0 = all)", kind: "number" },
      { key: "featuredOnly", label: "Featured videos only", kind: "boolean" },
      cta("cta", "Link"),
    ],
    defaults: {
      eyebrow: "",
      heading: "",
      text: "",
      limit: 0,
      featuredOnly: false,
      cta: { label: "", href: "" },
    },
  },
  "video-embed": {
    type: "video-embed",
    label: "Single video",
    description: "One large video player with a caption.",
    fields: [
      { key: "eyebrow", label: "Small label", kind: "text" },
      { key: "heading", label: "Headline", kind: "text" },
      { key: "text", label: "Paragraph", kind: "textarea" },
      { key: "videoId", label: "Video", kind: "video" },
    ],
    defaults: { eyebrow: "", heading: "", text: "", videoId: "" },
  },
  gallery: {
    type: "gallery",
    label: "Photo gallery",
    description: "Grid of photos with a lightbox.",
    fields: [
      { key: "eyebrow", label: "Small label", kind: "text" },
      { key: "heading", label: "Headline", kind: "text" },
      {
        key: "images",
        label: "Photos",
        kind: "items",
        itemLabel: "Photo",
        fields: [{ key: "image", label: "Photo", kind: "image" }],
      },
      {
        key: "columns",
        label: "Columns",
        kind: "select",
        options: [
          { value: "2", label: "2" },
          { value: "3", label: "3" },
          { value: "4", label: "4" },
        ],
      },
    ],
    defaults: { eyebrow: "", heading: "", images: [], columns: "3" },
  },
  "process-steps": {
    type: "process-steps",
    label: "Process steps",
    description: "Numbered steps (01, 02, ...).",
    fields: [
      { key: "eyebrow", label: "Small label", kind: "text" },
      { key: "heading", label: "Headline", kind: "text" },
      {
        key: "items",
        label: "Steps",
        kind: "items",
        itemLabel: "Step",
        fields: [
          { key: "title", label: "Title", kind: "text" },
          { key: "text", label: "Text", kind: "textarea" },
        ],
      },
    ],
    defaults: { eyebrow: "Our Process", heading: "How We Work", items: [] },
  },
  timeline: {
    type: "timeline",
    label: "Timeline",
    description: "Vertical timeline of milestones.",
    fields: [
      { key: "eyebrow", label: "Small label", kind: "text" },
      { key: "heading", label: "Headline", kind: "text" },
      {
        key: "items",
        label: "Milestones",
        kind: "items",
        itemLabel: "Milestone",
        fields: [
          { key: "label", label: "Label / year", kind: "text" },
          { key: "text", label: "Text", kind: "textarea" },
        ],
      },
    ],
    defaults: { eyebrow: "", heading: "", items: [] },
  },
  faq: {
    type: "faq",
    label: "FAQ",
    description:
      "Questions and answers. Also published as FAQ structured data for Google and AI search.",
    fields: [
      { key: "eyebrow", label: "Small label", kind: "text" },
      { key: "heading", label: "Headline", kind: "text" },
      {
        key: "useGlobal",
        label: "Use the FAQ list from SEO settings",
        kind: "boolean",
      },
      {
        key: "items",
        label: "Questions (used when the box above is off)",
        kind: "items",
        itemLabel: "Question",
        fields: [
          { key: "question", label: "Question", kind: "text" },
          { key: "answer", label: "Answer", kind: "textarea" },
        ],
      },
    ],
    defaults: {
      eyebrow: "FAQ",
      heading: "Common Questions",
      useGlobal: true,
      items: [],
    },
  },
  cta: {
    type: "cta",
    label: "Call to action",
    description: "Dark band with headline and buttons.",
    fields: [
      { key: "heading", label: "Headline", kind: "text" },
      { key: "text", label: "Paragraph", kind: "textarea" },
      cta("primaryCta", "Primary button"),
      { key: "showPhone", label: "Show phone number button", kind: "boolean" },
      {
        key: "style",
        label: "Style",
        kind: "select",
        options: [
          { value: "dark", label: "Navy background" },
          { value: "light", label: "Light background" },
        ],
      },
    ],
    defaults: {
      heading: "",
      text: "",
      primaryCta: { label: "Get Your Free Estimate", href: "/contact" },
      showPhone: true,
      style: "dark",
    },
  },
  "contact-form": {
    type: "contact-form",
    label: "Contact form + info",
    description: "The lead form with the contact sidebar.",
    fields: [
      { key: "serviceOptions", label: "Service dropdown options", kind: "string-list" },
      { key: "expectations", label: "'What to expect' bullets", kind: "string-list" },
      { key: "successMessage", label: "Success message", kind: "textarea" },
    ],
    defaults: { serviceOptions: [], expectations: [], successMessage: "" },
  },
  "careers-positions": {
    type: "careers-positions",
    label: "Open positions + application form",
    description: "Lists the positions from the Careers section and the apply form.",
    fields: [
      { key: "eyebrow", label: "Small label", kind: "text" },
      { key: "heading", label: "Headline", kind: "text" },
      { key: "applyEyebrow", label: "Apply form label", kind: "text" },
      { key: "applyHeading", label: "Apply form headline", kind: "text" },
      { key: "applyText", label: "Apply form paragraph", kind: "textarea" },
      { key: "applyNote", label: "Apply form small note", kind: "textarea" },
    ],
    defaults: {
      eyebrow: "Open Positions",
      heading: "What We're Hiring For",
      applyEyebrow: "Apply Now",
      applyHeading: "Tell Us About Yourself.",
      applyText: "",
      applyNote: "",
    },
  },
  "careers-perks": {
    type: "careers-perks",
    label: "Three-column perks",
    description: "Simple three-column text block on a tinted background.",
    fields: [
      {
        key: "items",
        label: "Columns",
        kind: "items",
        itemLabel: "Column",
        fields: [
          { key: "title", label: "Title", kind: "text" },
          { key: "text", label: "Text", kind: "textarea" },
        ],
      },
    ],
    defaults: { items: [] },
  },
};

export const SECTION_TYPES = Object.keys(SECTION_REGISTRY) as SectionType[];

export function sectionLabel(type: SectionType): string {
  return SECTION_REGISTRY[type]?.label ?? type;
}
