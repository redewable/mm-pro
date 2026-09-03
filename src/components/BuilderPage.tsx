import { notFound } from "next/navigation";
import { getSiteContent } from "@/lib/content/server";
import SectionRenderer from "@/components/sections";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, reviewsJsonLd } from "@/lib/seo";
import { PAGE_PATHS } from "@/lib/content/defaults";

// Renders any dashboard-managed page by slug.
export default async function BuilderPage({ slug }: { slug: string }) {
  const content = await getSiteContent();
  const page = content.pages[slug];
  if (!page) notFound();
  const path = PAGE_PATHS[slug] ?? `/${slug}`;
  const extra: (object | null)[] = [];
  if (slug !== "home") {
    extra.push(breadcrumbJsonLd(content, [{ name: "Home", path: "/" }, { name: page.title, path }]));
  }
  if (slug === "testimonials") extra.push(reviewsJsonLd(content));
  return (
    <>
      <JsonLd data={extra} />
      {!page.published && (
        <div className="bg-amber-50 text-amber-800 text-sm text-center py-2 px-4 border-b border-amber-200">
          This page is unpublished — only visible to people with the direct link.
        </div>
      )}
      <SectionRenderer page={page} content={content} />
    </>
  );
}
