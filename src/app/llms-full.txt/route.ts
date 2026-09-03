import { getSiteContent } from "@/lib/content/server";
import { buildLlmsTxt } from "@/lib/seo";

export async function GET() {
  const c = await getSiteContent();
  return new Response(buildLlmsTxt(c, true), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
