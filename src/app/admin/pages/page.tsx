import Link from "next/link";
import { readContentUncached } from "@/lib/content/server";
import { PAGE_ORDER, PAGE_PATHS } from "@/lib/content/defaults";
import { Badge, PageHeader } from "@/components/admin/ui";
import { sectionLabel } from "@/lib/content/sections";
import { SECTION_ICONS } from "@/components/admin/sectionIcons";
import Icon from "@/components/Icon";

export const metadata = { title: "Page Layouts" };

export default async function PagesIndex() {
  const c = await readContentUncached();
  const slugs = [...PAGE_ORDER.filter((s) => c.pages[s]), ...Object.keys(c.pages).filter((s) => !(PAGE_ORDER as readonly string[]).includes(s))];
  return (
    <div>
      <PageHeader title="Page Layouts" />
      <ul className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {slugs.map((slug) => {
          const p = c.pages[slug];
          return (
            <li key={slug}>
              <Link href={`/admin/pages/${slug}`} className="flex flex-col bg-white border border-gray-200 rounded-xl p-3 sm:p-4 hover:border-gold hover:shadow-sm transition-all h-full">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <p className="font-bold text-navy truncate">{slug === "home" ? "Home" : p.title}</p>
                    <p className="text-xs text-slate truncate">{PAGE_PATHS[slug] ?? `/${slug}`}</p>
                  </div>
                  {!p.published && <Badge tone="gray">Hidden</Badge>}
                </div>
                <ul className="flex-1 space-y-1">
                  {p.sections.slice(0, 6).map((s) => (
                    <li key={s.id} className={`flex items-center gap-2 text-xs text-navy/80 ${s.visible ? "" : "line-through text-slate/60"}`}>
                      <Icon name={SECTION_ICONS[s.type]} className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                      <span className="truncate">{sectionLabel(s.type)}</span>
                    </li>
                  ))}
                  {p.sections.length > 6 && <li className="text-xs text-slate pl-[22px]">+{p.sections.length - 6} more</li>}
                </ul>
                <p className="text-[11px] text-slate mt-3 pt-3 border-t border-gray-100">{p.sections.length} section{p.sections.length === 1 ? "" : "s"}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
