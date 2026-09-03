import { getSiteContent } from "@/lib/content/server";
import { buildLlmsTxt } from "@/lib/seo";

// https://llmstxt.org — a plain-text summary of the site for AI assistants.
export async function GET() {
  const c = await getSiteContent();
  return new Response(buildLlmsTxt(c, false), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
