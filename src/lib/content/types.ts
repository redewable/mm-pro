// Every editable piece of the site lives in one SiteContent document.
// The dashboard edits it; the public pages render it. Keeping it a single
// JSON document means any storage provider (Vercel Blob, Supabase, local
// disk) only has to store one record plus media files.

export type MediaKind = "image" | "video" | "file";

export interface MediaItem {
  id: string;
  url: string;
  kind: MediaKind;
  name: string;
  mime: string;
  size: number;
  width?: number;
  height?: number;
  alt?: string;
  createdAt: string;
}

export interface ImageRef {
  url: string;
  alt: string;
  caption?: string;
}

export interface LinkRef {
  label: string;
  href: string;
}

export type ProjectStatus = "planned" | "in-progress" | "completed";

// A dated progress note on a project ("Week 2: slab poured") with photos.
export interface ProjectUpdate {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  text: string;
  images: ImageRef[];
  videoId?: string;
}

export interface BeforeAfterPair {
  id: string;
  before: ImageRef;
  after: ImageRef;
  caption?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: ProjectStatus;
  summary: string;
  description: string;
  scope: string[];
  cover: ImageRef;
  gallery: ImageRef[];
  videoIds: string[];
  updates: ProjectUpdate[];
  beforeAfter: BeforeAfterPair[];
  location?: string;
  completedAt?: string; // ISO date (YYYY-MM-DD) or ""
  featured: boolean;
  published: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export type VideoSource = "upload" | "youtube" | "vimeo" | "facebook" | "url";

export interface Video {
  id: string;
  slug: string;
  title: string;
  description: string;
  source: VideoSource;
  url: string; // file URL for uploads, page/share URL for platforms
  poster?: ImageRef;
  projectId?: string;
  category: string;
  featured: boolean;
  published: boolean;
  publishedAt: string; // ISO date
  durationSeconds?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  project: string;
  rating: number; // 1-5
  source?: string; // "Facebook", "Google", "Text message"...
  featured: boolean;
  published: boolean;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  features: string[];
  icon: IconName;
  image?: ImageRef;
  primary: boolean; // shows in the big alternating layout on /services
  showOnHome: boolean;
  published: boolean;
}

export interface Position {
  id: string;
  title: string;
  type: string;
  summary: string;
  responsibilities: string[];
  experience: string[];
  bonus: string[];
  nonNegotiables: string[];
  published: boolean;
}

export interface NavLink {
  id: string;
  label: string;
  href: string;
  visible: boolean;
  location: "header" | "footer" | "both";
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface BusinessInfo {
  name: string;
  legalName: string;
  tagline: string;
  phone: string; // display format
  phoneE164: string; // +1...
  email: string;
  founderName: string;
  founderTitle: string;
  addressLine: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  serviceAreas: string[];
  serviceAreaSummary: string;
  hours: string;
  license: string;
  licenseIssuer: string;
  foundedYear: string;
  priceRange: string;
  footerQuote: string;
  footerBlurb: string;
  socials: SocialLink[];
  formRecipient: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface SeoSettings {
  siteUrl: string;
  defaultTitle: string;
  titleTemplate: string;
  description: string;
  keywords: string[];
  ogImage?: ImageRef;
  twitterHandle: string;
  googleSiteVerification: string;
  bingSiteVerification: string;
  faq: FaqItem[];
  allowAiCrawlers: boolean;
  llmsSummary: string;
  llmsExtra: string;
}

export interface TrackingSettings {
  ga4MeasurementId: string; // G-XXXX
  gtmContainerId: string; // GTM-XXXX
  googleAdsId: string; // AW-XXXX
  googleAdsFormConversionLabel: string;
  googleAdsPhoneConversionLabel: string;
  metaPixelId: string;
  microsoftClarityId: string;
  enabledInDev: boolean;
}

export type IconName =
  | "building"
  | "home"
  | "sparkle"
  | "light"
  | "layout"
  | "cube"
  | "clock"
  | "box"
  | "dollar"
  | "check"
  | "users"
  | "eye"
  | "wrench"
  | "star"
  | "shield"
  | "sun"
  | "heart"
  | "phone"
  | "camera"
  | "video";

// ---------- Page sections (the drag-and-drop page builder) ----------

export type SectionType =
  | "hero"
  | "page-header"
  | "stats"
  | "services-grid"
  | "services-detail"
  | "featured-project"
  | "feature-cards"
  | "image-text"
  | "rich-text"
  | "testimonial-spotlight"
  | "testimonials-grid"
  | "projects-list"
  | "videos-grid"
  | "video-embed"
  | "gallery"
  | "process-steps"
  | "timeline"
  | "faq"
  | "cta"
  | "contact-form"
  | "careers-positions"
  | "careers-perks";

export interface Section {
  id: string;
  type: SectionType;
  visible: boolean;
  // Section-specific data. Shape is defined by the registry in sections.ts
  data: Record<string, unknown>;
}

export interface Page {
  slug: string; // "home", "about", ...
  title: string; // shown in <title>
  seoDescription: string;
  ogImage?: ImageRef;
  sections: Section[];
  published: boolean;
}

export interface AuthSettings {
  // PBKDF2 hash of the dashboard password, if the owner changed it from the
  // dashboard. When empty, ADMIN_PASSWORD from the environment is used.
  passwordHash: string;
  passwordSalt: string;
}

export interface SiteContent {
  version: number;
  updatedAt: string;
  business: BusinessInfo;
  seo: SeoSettings;
  tracking: TrackingSettings;
  nav: NavLink[];
  pages: Record<string, Page>;
  projects: Project[];
  videos: Video[];
  testimonials: Testimonial[];
  services: Service[];
  positions: Position[];
  media: MediaItem[];
  auth: AuthSettings;
}

export type ContentCollectionKey =
  | "business"
  | "seo"
  | "tracking"
  | "nav"
  | "pages"
  | "projects"
  | "videos"
  | "testimonials"
  | "services"
  | "positions"
  | "media";
