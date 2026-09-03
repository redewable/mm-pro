import { DEFAULT_CONTENT } from "./defaults";
import { SECTION_REGISTRY } from "./sections";
import type {
  SiteContent,
  Page,
  Section,
  SectionType,
  ImageRef,
  Project,
} from "./types";

// Fills in anything missing from a stored document so old saves keep working
// when new fields are added, and so garbage from a bad write can't crash a
// public page.

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

export function str(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}
export function num(v: unknown, fallback = 0): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}
export function bool(v: unknown, fallback = false): boolean {
  return typeof v === "boolean" ? v : fallback;
}
export function strList(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}
export function imageRef(v: unknown, fallback?: ImageRef): ImageRef {
  if (isObj(v)) {
    return {
      url: str(v.url),
      alt: str(v.alt),
      ...(typeof v.caption === "string" ? { caption: v.caption } : {}),
    };
  }
  return fallback ?? { url: "", alt: "" };
}

function mergeShallow<T extends object>(defaults: T, stored: unknown): T {
  if (!isObj(stored)) return { ...defaults };
  const out: Record<string, unknown> = { ...(defaults as Record<string, unknown>) };
  for (const [k, v] of Object.entries(stored)) {
    if (v !== undefined) out[k] = v;
  }
  return out as T;
}

function normalizeSection(raw: unknown): Section | null {
  if (!isObj(raw)) return null;
  const type = str(raw.type) as SectionType;
  const def = SECTION_REGISTRY[type];
  if (!def) return null;
  return {
    id: str(raw.id) || `sec_${Math.random().toString(36).slice(2, 10)}`,
    type,
    visible: bool(raw.visible, true),
    data: { ...def.defaults, ...(isObj(raw.data) ? raw.data : {}) },
  };
}

function normalizePage(slug: string, raw: unknown, fallback?: Page): Page {
  const base: Page = fallback ?? {
    slug,
    title: slug,
    seoDescription: "",
    sections: [],
    published: true,
  };
  if (!isObj(raw)) return base;
  const sections = Array.isArray(raw.sections)
    ? raw.sections.map(normalizeSection).filter((x): x is Section => !!x)
    : base.sections;
  return {
    slug,
    title: str(raw.title, base.title),
    seoDescription: str(raw.seoDescription, base.seoDescription),
    ogImage: raw.ogImage ? imageRef(raw.ogImage) : base.ogImage,
    sections,
    published: bool(raw.published, true),
  };
}

function normalizeProject(raw: Record<string, unknown>): Project {
  const p = raw as unknown as Project;
  return {
    ...p,
    scope: strList(p.scope),
    gallery: Array.isArray(p.gallery) ? p.gallery.map((g) => imageRef(g)).filter((g) => g.url) : [],
    videoIds: strList(p.videoIds),
    updates: Array.isArray(p.updates)
      ? p.updates.filter(isObj).map((u) => ({
          id: str(u.id) || `upd_${Math.random().toString(36).slice(2, 10)}`,
          date: str(u.date),
          title: str(u.title),
          text: str(u.text),
          images: Array.isArray(u.images) ? u.images.map((g) => imageRef(g)).filter((g) => g.url) : [],
          ...(typeof u.videoId === "string" && u.videoId ? { videoId: u.videoId } : {}),
        }))
      : [],
    beforeAfter: Array.isArray(p.beforeAfter)
      ? p.beforeAfter.filter(isObj).map((b) => ({
          id: str(b.id) || `ba_${Math.random().toString(36).slice(2, 10)}`,
          before: imageRef(b.before),
          after: imageRef(b.after),
          ...(typeof b.caption === "string" ? { caption: b.caption } : {}),
        }))
      : [],
    cover: imageRef(p.cover),
    featured: bool(p.featured),
    published: bool(p.published, true),
  };
}

export function normalizeContent(raw: unknown): SiteContent {
  const d = DEFAULT_CONTENT;
  if (!isObj(raw)) return structuredClone(d);

  const pages: Record<string, Page> = {};
  const rawPages = isObj(raw.pages) ? raw.pages : {};
  for (const slug of Object.keys(d.pages)) {
    pages[slug] = normalizePage(slug, rawPages[slug], d.pages[slug]);
  }
  for (const slug of Object.keys(rawPages)) {
    if (!pages[slug]) pages[slug] = normalizePage(slug, rawPages[slug]);
  }

  const arr = <T>(v: unknown, fallback: T[]): T[] =>
    Array.isArray(v) ? (v.filter(isObj) as unknown as T[]) : fallback;

  return {
    version: num(raw.version, d.version),
    updatedAt: str(raw.updatedAt, d.updatedAt),
    business: {
      ...mergeShallow(d.business, raw.business),
      serviceAreas: isObj(raw.business) && Array.isArray(raw.business.serviceAreas)
        ? strList(raw.business.serviceAreas)
        : d.business.serviceAreas,
      socials: isObj(raw.business) ? arr(raw.business.socials, d.business.socials) : d.business.socials,
    },
    seo: {
      ...mergeShallow(d.seo, raw.seo),
      keywords: isObj(raw.seo) && Array.isArray(raw.seo.keywords) ? strList(raw.seo.keywords) : d.seo.keywords,
      faq: isObj(raw.seo) ? arr(raw.seo.faq, d.seo.faq) : d.seo.faq,
    },
    tracking: mergeShallow(d.tracking, raw.tracking),
    nav: arr(raw.nav, d.nav),
    pages,
    projects: (Array.isArray(raw.projects) ? raw.projects.filter(isObj) : (d.projects as unknown as Record<string, unknown>[])).map(normalizeProject),
    videos: arr(raw.videos, d.videos),
    testimonials: arr(raw.testimonials, d.testimonials),
    services: arr(raw.services, d.services),
    positions: arr(raw.positions, d.positions),
    media: arr(raw.media, d.media),
    auth: mergeShallow(d.auth, raw.auth),
  };
}
