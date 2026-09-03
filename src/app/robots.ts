import type { MetadataRoute } from "next";
import { getSiteContent } from "@/lib/content/server";

// AI search crawlers. Allowed by default so the business shows up in
// ChatGPT / Perplexity / Claude / Gemini answers; toggle in SEO settings.
const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bytespider",
  "CCBot",
  "cohere-ai",
  "Amazonbot",
  "meta-externalagent",
  "DuckAssistBot",
  "YouBot",
];

export default async function robots(): Promise<MetadataRoute.Robots> {
  const c = await getSiteContent();
  const disallow = ["/admin", "/admin/", "/api/"];
  const rules: MetadataRoute.Robots["rules"] = [{ userAgent: "*", allow: "/", disallow }];
  if (c.seo.allowAiCrawlers) {
    rules.push({ userAgent: AI_BOTS, allow: "/", disallow });
  } else {
    rules.push({ userAgent: AI_BOTS, disallow: "/" });
  }
  return {
    rules,
    sitemap: `${c.seo.siteUrl.replace(/\/$/, "")}/sitemap.xml`,
    host: c.seo.siteUrl,
  };
}
