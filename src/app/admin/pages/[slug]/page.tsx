import { notFound } from "next/navigation";
import { readContentUncached } from "@/lib/content/server";
import PageBuilder from "./PageBuilder";

export const metadata = { title: "Edit page" };

export default async function PageBuilderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await readContentUncached();
  const page = c.pages[slug];
  if (!page) notFound();
  return <PageBuilder initial={page} sources={{ projects: c.projects, videos: c.videos, testimonials: c.testimonials }} />;
}
