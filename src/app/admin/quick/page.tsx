import { readContentUncached } from "@/lib/content/server";
import QuickAdd from "./QuickAdd";

export const metadata = { title: "Quick Add" };

export default async function QuickAddPage() {
  const c = await readContentUncached();
  const categories = Array.from(new Set([...c.projects.map((p) => p.category), ...c.services.filter((s) => s.published).map((s) => s.title)])).filter(Boolean);
  return <QuickAdd projects={c.projects.map((p) => ({ id: p.id, title: p.title, status: p.status, cover: p.cover.url }))} categories={categories} />;
}
