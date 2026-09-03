import type { MetadataRoute } from "next";
import { getSiteContent } from "@/lib/content/server";
import { PAGE_PATHS } from "@/lib/content/defaults";
import { absoluteUrl } from "@/lib/seo";
import { publishedProjects, publishedVideos, videoThumbnail } from "@/lib/content/helpers";

const PRIORITY: Record<string, number> = {
  home: 1,
  services: 0.9,
  contact: 0.9,
  portfolio: 0.8,
  videos: 0.8,
  about: 0.8,
  testimonials: 0.7,
  careers: 0.6,
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const c = await getSiteContent();
  const updated = new Date(c.updatedAt);
  const entries: MetadataRoute.Sitemap = [];

  for (const [slug, page] of Object.entries(c.pages)) {
    if (!page.published) continue;
    entries.push({
      url: absoluteUrl(c, PAGE_PATHS[slug] ?? `/${slug}`),
      lastModified: updated,
      changeFrequency: slug === "portfolio" || slug === "videos" ? "weekly" : "monthly",
      priority: PRIORITY[slug] ?? 0.5,
    });
  }

  for (const p of publishedProjects(c)) {
    entries.push({
      url: absoluteUrl(c, `/portfolio/${p.slug}`),
      lastModified: new Date(p.updatedAt || c.updatedAt),
      changeFrequency: p.status === "completed" ? "monthly" : "weekly",
      priority: 0.7,
      images: [p.cover, ...p.gallery].filter((i) => i.url).map((i) => absoluteUrl(c, i.url)),
    });
  }

  for (const v of publishedVideos(c)) {
    const thumb = videoThumbnail(v);
    entries.push({
      url: absoluteUrl(c, `/videos/${v.slug}`),
      lastModified: new Date(v.updatedAt || c.updatedAt),
      changeFrequency: "monthly",
      priority: 0.6,
      ...(thumb
        ? {
            videos: [
              {
                title: v.title,
                thumbnail_loc: absoluteUrl(c, thumb),
                description: v.description || v.title,
              },
            ],
          }
        : {}),
    });
  }

  return entries;
}
