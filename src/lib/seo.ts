import type { SiteContent, Project, Video, FaqItem } from "@/lib/content/types";
import { videoEmbed, videoThumbnail } from "@/lib/content/helpers";

// JSON-LD builders. Every public page emits structured data so Google, Bing
// and AI search engines (ChatGPT, Perplexity, Claude, Gemini) can read the
// business, its services, projects and videos without guessing.

export function absoluteUrl(c: SiteContent, path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  const base = c.seo.siteUrl.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function organizationJsonLd(c: SiteContent) {
  const b = c.business;
  const services = c.services.filter((s) => s.published);
  return {
    "@context": "https://schema.org",
    "@type": ["GeneralContractor", "LocalBusiness"],
    "@id": `${c.seo.siteUrl}/#business`,
    name: b.name,
    legalName: b.legalName || b.name,
    url: c.seo.siteUrl,
    telephone: b.phoneE164,
    email: b.email,
    description: c.seo.description,
    slogan: b.tagline,
    image: absoluteUrl(c, c.seo.ogImage?.url || "/opengraph-image"),
    logo: absoluteUrl(c, "/mm-pro-logo.png"),
    priceRange: b.priceRange || undefined,
    foundingDate: b.foundedYear || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: b.addressLine || undefined,
      addressLocality: b.city,
      addressRegion: b.region,
      postalCode: b.postalCode || undefined,
      addressCountry: b.country,
    },
    geo:
      b.latitude && b.longitude
        ? { "@type": "GeoCoordinates", latitude: b.latitude, longitude: b.longitude }
        : undefined,
    openingHours: b.hours || undefined,
    areaServed: b.serviceAreas.map((name) => ({ "@type": "AdministrativeArea", name })),
    founder: { "@type": "Person", name: b.founderName, jobTitle: b.founderTitle },
    sameAs: b.socials.map((s) => s.url).filter(Boolean),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Construction Services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.title,
          description: s.description,
          url: absoluteUrl(c, `/services#${s.slug}`),
        },
      })),
    },
  };
}

export function websiteJsonLd(c: SiteContent) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${c.seo.siteUrl}/#website`,
    url: c.seo.siteUrl,
    name: c.business.name,
    publisher: { "@id": `${c.seo.siteUrl}/#business` },
  };
}

export function faqJsonLd(items: FaqItem[] | { question: string; answer: string }[]) {
  const list = items.filter((f) => f.question && f.answer);
  if (!list.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: list.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function breadcrumbJsonLd(c: SiteContent, crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((cr, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: cr.name,
      item: absoluteUrl(c, cr.path),
    })),
  };
}

export function projectJsonLd(c: SiteContent, p: Project, videos: Video[]) {
  const images = [p.cover, ...p.gallery].filter((i) => i.url).map((i) => absoluteUrl(c, i.url));
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": absoluteUrl(c, `/portfolio/${p.slug}#project`),
    name: p.title,
    headline: p.title,
    description: p.description || p.summary,
    url: absoluteUrl(c, `/portfolio/${p.slug}`),
    image: images,
    genre: p.category,
    creativeWorkStatus: p.status === "completed" ? "Completed" : "In progress",
    dateCreated: p.createdAt,
    dateModified: p.updatedAt,
    datePublished: p.completedAt || undefined,
    locationCreated: p.location ? { "@type": "Place", name: p.location } : undefined,
    creator: { "@id": `${c.seo.siteUrl}/#business` },
    keywords: [p.category, ...p.scope].join(", "),
    video: videos.map((v) => videoJsonLd(c, v)),
  };
}

export function videoJsonLd(c: SiteContent, v: Video) {
  const embed = videoEmbed(v);
  const thumb = videoThumbnail(v);
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "@id": absoluteUrl(c, `/videos/${v.slug}#video`),
    name: v.title,
    description: v.description || v.title,
    thumbnailUrl: thumb ? [absoluteUrl(c, thumb)] : undefined,
    uploadDate: v.publishedAt || v.createdAt,
    duration: v.durationSeconds ? `PT${Math.round(v.durationSeconds)}S` : undefined,
    contentUrl: embed.kind === "file" ? absoluteUrl(c, embed.src) : undefined,
    embedUrl: embed.kind === "iframe" ? embed.src : undefined,
    url: absoluteUrl(c, `/videos/${v.slug}`),
    publisher: { "@id": `${c.seo.siteUrl}/#business` },
  };
}

export function reviewsJsonLd(c: SiteContent) {
  const list = c.testimonials.filter((t) => t.published);
  if (!list.length) return null;
  const avg = list.reduce((a, t) => a + (t.rating || 5), 0) / list.length;
  return {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": `${c.seo.siteUrl}/#business`,
    name: c.business.name,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: Math.round(avg * 10) / 10,
      reviewCount: list.length,
      bestRating: 5,
    },
    review: list.map((t) => ({
      "@type": "Review",
      author: { "@type": "Person", name: t.author },
      reviewBody: t.quote,
      reviewRating: { "@type": "Rating", ratingValue: t.rating || 5, bestRating: 5 },
      about: t.project || undefined,
    })),
  };
}

// Plain-text summary for /llms.txt (the emerging convention for telling AI
// crawlers what a site is about).
export function buildLlmsTxt(c: SiteContent, full = false): string {
  const b = c.business;
  const lines: string[] = [];
  lines.push(`# ${b.name}`);
  lines.push("");
  lines.push(`> ${c.seo.llmsSummary || c.seo.description}`);
  lines.push("");
  lines.push("## Business");
  lines.push(`- Owner: ${b.founderName}, ${b.founderTitle}`);
  lines.push(`- Phone: ${b.phone}`);
  if (b.email) lines.push(`- Email: ${b.email}`);
  lines.push(`- Location: ${[b.addressLine, b.city, b.region, b.postalCode].filter(Boolean).join(", ")}`);
  lines.push(`- Service area: ${b.serviceAreas.join("; ")}`);
  if (b.hours) lines.push(`- Hours: ${b.hours}`);
  if (b.license) lines.push(`- License: ${b.license}${b.licenseIssuer ? ` (${b.licenseIssuer})` : ""}`);
  lines.push(`- Website: ${c.seo.siteUrl}`);
  for (const s of b.socials) lines.push(`- ${s.platform}: ${s.url}`);
  lines.push("");
  lines.push("## Services");
  for (const s of c.services.filter((x) => x.published)) {
    lines.push(`- [${s.title}](${absoluteUrl(c, `/services#${s.slug}`)}): ${s.description}`);
  }
  lines.push("");
  lines.push("## Pages");
  const pagePaths: Record<string, string> = {
    home: "/",
    about: "/about",
    services: "/services",
    portfolio: "/portfolio",
    videos: "/videos",
    testimonials: "/testimonials",
    careers: "/careers",
    contact: "/contact",
  };
  for (const [slug, page] of Object.entries(c.pages)) {
    if (!page.published) continue;
    const path = pagePaths[slug] ?? `/${slug}`;
    lines.push(`- [${page.title}](${absoluteUrl(c, path)}): ${page.seoDescription}`);
  }
  const projects = c.projects.filter((p) => p.published);
  if (projects.length) {
    lines.push("");
    lines.push("## Projects");
    for (const p of projects) {
      lines.push(
        `- [${p.title}](${absoluteUrl(c, `/portfolio/${p.slug}`)}) — ${p.category}, ${
          p.status
        }: ${p.summary || p.description}`
      );
    }
  }
  const videos = c.videos.filter((v) => v.published);
  if (videos.length) {
    lines.push("");
    lines.push("## Videos");
    for (const v of videos) {
      lines.push(`- [${v.title}](${absoluteUrl(c, `/videos/${v.slug}`)}): ${v.description}`);
    }
  }
  if (c.seo.faq.length) {
    lines.push("");
    lines.push("## FAQ");
    for (const f of c.seo.faq) {
      lines.push(`- Q: ${f.question}`);
      lines.push(`  A: ${f.answer}`);
    }
  }
  if (full) {
    const reviews = c.testimonials.filter((t) => t.published);
    if (reviews.length) {
      lines.push("");
      lines.push("## Client reviews");
      for (const t of reviews) lines.push(`- "${t.quote}" — ${t.author}${t.project ? `, ${t.project}` : ""}`);
    }
    for (const p of projects) {
      lines.push("");
      lines.push(`### ${p.title}`);
      lines.push(p.description);
      if (p.scope.length) lines.push(`Scope: ${p.scope.join("; ")}`);
    }
  }
  if (c.seo.llmsExtra) {
    lines.push("");
    lines.push(c.seo.llmsExtra);
  }
  return lines.join("\n") + "\n";
}
