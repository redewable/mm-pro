import { readContentUncached } from "@/lib/content/server";
import SeoForm from "./SeoForm";

export const metadata = { title: "SEO & Tracking" };

export default async function SeoPage() {
  const c = await readContentUncached();
  return <SeoForm seo={c.seo} tracking={c.tracking} siteUrl={c.seo.siteUrl} />;
}
