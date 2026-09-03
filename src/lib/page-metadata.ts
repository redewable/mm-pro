import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content/server";
import { PAGE_PATHS } from "@/lib/content/defaults";
import { absoluteUrl } from "@/lib/seo";

// Builds <head> metadata for a builder page from the dashboard's SEO fields.
export async function pageMetadata(slug: string): Promise<Metadata> {
  const c = await getSiteContent();
  const page = c.pages[slug];
  if (!page) return {};
  const path = PAGE_PATHS[slug] ?? `/${slug}`;
  const isHome = slug === "home";
  const title = isHome ? { absolute: page.title || c.seo.defaultTitle } : page.title;
  const description = page.seoDescription || c.seo.description;
  const share = { url: absoluteUrl(c, page.ogImage?.url || c.seo.ogImage?.url || "/opengraph-image"), width: 1200, height: 630, alt: page.ogImage?.alt || `${c.business.name} — ${c.business.tagline}` };
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(c, path) },
    robots: page.published ? undefined : { index: false, follow: false },
    openGraph: {
      title: isHome ? page.title || c.seo.defaultTitle : `${page.title} | ${c.business.name}`,
      description,
      url: absoluteUrl(c, path),
      type: "website",
      images: [share],
    },
    twitter: { card: "summary_large_image", images: [share.url] },
  };
}
