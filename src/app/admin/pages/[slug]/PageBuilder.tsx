"use client";

import { useState } from "react";
import { savePageAction } from "@/app/admin/actions";
import { useEditor } from "@/components/admin/useSave";
import { SortableList } from "@/components/admin/SortableList";
import { SectionForm, type PickerSources } from "@/components/admin/SectionForm";
import { ImageField } from "@/components/admin/MediaPicker";
import { Badge, Button, Card, Field, Input, LinkButton, PageHeader, SaveBar, Textarea, Toggle } from "@/components/admin/ui";
import { SECTION_REGISTRY, SECTION_TYPES, sectionLabel } from "@/lib/content/sections";
import { PAGE_PATHS } from "@/lib/content/defaults";
import { newId } from "@/lib/ids";
import { SECTION_COLORS, SECTION_ICONS } from "@/components/admin/sectionIcons";
import Icon from "@/components/Icon";
import type { Page, Section, SectionType } from "@/lib/content/types";

const FIXED_ONCE: SectionType[] = ["contact-form", "careers-positions", "services-detail"];

export default function PageBuilder({ initial, sources }: { initial: Page; sources: PickerSources }) {
  const ed = useEditor(initial, (p) => savePageAction(p.slug, p));
  const page = ed.value;
  const set = (patch: Partial<Page>) => ed.setValue({ ...page, ...patch });
  const [openId, setOpenId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const path = PAGE_PATHS[page.slug] ?? `/${page.slug}`;

  function updateSection(id: string, patch: Partial<Section>) {
    set({ sections: page.sections.map((s) => (s.id === id ? { ...s, ...patch } : s)) });
  }
  function addSection(type: SectionType) {
    const sec: Section = { id: newId("sec"), type, visible: true, data: structuredClone(SECTION_REGISTRY[type].defaults) };
    set({ sections: [...page.sections, sec] });
    setOpenId(sec.id);
    setAdding(false);
  }
  function duplicate(s: Section) {
    const idx = page.sections.findIndex((x) => x.id === s.id);
    const copy: Section = { ...structuredClone(s), id: newId("sec") };
    const next = [...page.sections];
    next.splice(idx + 1, 0, copy);
    set({ sections: next });
  }

  const summaryOf = (s: Section) => {
    const d = s.data;
    const t = [d.heading, d.title, d.eyebrow].find((x) => typeof x === "string" && x) as string | undefined;
    return t ?? SECTION_REGISTRY[s.type].description;
  };

  return (
    <div>
      <PageHeader
        title={`${page.slug === "home" ? "Home" : page.title} page`}
        back={{ href: "/admin/pages", label: "Page layouts" }}
        actions={<LinkButton href={path} variant="secondary" size="sm">View page ↗</LinkButton>}
      />

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <SortableList
            items={page.sections}
            onChange={(sections) => set({ sections })}
            className="space-y-3"
            render={(s, _i, controls) => {
              const open = openId === s.id;
              const def = SECTION_REGISTRY[s.type];
              return (
                <div className={`bg-white border rounded-xl ${open ? "border-gold shadow-sm" : "border-gray-200"} ${!s.visible ? "opacity-70" : ""}`}>
                  <div className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-3">
                    {controls}
                    <span className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${SECTION_COLORS[s.type]}`}>
                      <Icon name={SECTION_ICONS[s.type]} className="w-5 h-5" />
                    </span>
                    <button type="button" className="flex-1 min-w-0 w-0 text-left" onClick={() => setOpenId(open ? null : s.id)} aria-expanded={open}>
                      <span className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-bold text-navy truncate">{sectionLabel(s.type)}</span>
                        {!s.visible && <Badge tone="gray">Hidden</Badge>}
                      </span>
                      <span className="block text-xs text-slate truncate">{summaryOf(s)}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSection(s.id, { visible: !s.visible })}
                      className={`p-2 rounded-lg ${s.visible ? "text-navy hover:bg-gray-100" : "text-slate hover:bg-gray-100"}`}
                      aria-label={s.visible ? "Hide section" : "Show section"}
                      title={s.visible ? "Hide" : "Show"}
                    >
                      {s.visible ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" /></svg>
                      )}
                    </button>
                    <button type="button" onClick={() => setOpenId(open ? null : s.id)} className="p-2 rounded-lg text-slate hover:bg-gray-100" aria-label={open ? "Collapse" : "Edit section"}>
                      <svg className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                  </div>
                  {open && (
                    <div className="border-t border-gray-100 p-4 sm:p-5">
                      {def.fields.length === 0 ? (
                        <p className="text-sm text-slate">{def.description}</p>
                      ) : (
                        <SectionForm fields={def.fields} data={s.data} onChange={(data) => updateSection(s.id, { data })} sources={sources} idPrefix={s.id} />
                      )}
                      <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-gray-100">
                        {!FIXED_ONCE.includes(s.type) && (
                          <Button variant="secondary" size="sm" onClick={() => duplicate(s)}>Duplicate</Button>
                        )}
                        <Button variant="danger" size="sm" onClick={() => set({ sections: page.sections.filter((x) => x.id !== s.id) })}>Remove section</Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            }}
          />

          <div className="mt-4">
            {adding ? (
              <Card title="Add a section" actions={<Button variant="ghost" size="sm" onClick={() => setAdding(false)}>Cancel</Button>}>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SECTION_TYPES.filter((t) => !(FIXED_ONCE.includes(t) && page.sections.some((s) => s.type === t))).map((t) => (
                    <button key={t} type="button" onClick={() => addSection(t)} className="flex items-center gap-2.5 text-left border border-gray-200 rounded-lg p-2.5 hover:border-gold hover:bg-gold/5 transition-colors">
                      <span className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${SECTION_COLORS[t]}`}>
                        <Icon name={SECTION_ICONS[t]} className="w-5 h-5" />
                      </span>
                      <span className="text-sm font-semibold text-navy leading-tight">{SECTION_REGISTRY[t].label}</span>
                    </button>
                  ))}
                </div>
              </Card>
            ) : (
              <Button variant="secondary" className="w-full border-dashed" onClick={() => setAdding(true)}>+ Add section</Button>
            )}
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <Card title="Page settings">
            <div className="space-y-4">
              <Toggle checked={page.published} onChange={(published) => set({ published })} label="Published" />
              <Field label="Page title" htmlFor="ptitle">
                <Input id="ptitle" value={page.title} onChange={(e) => set({ title: e.target.value })} />
              </Field>
              <Field label="Google description" htmlFor="pdesc">
                <Textarea id="pdesc" rows={4} value={page.seoDescription} onChange={(e) => set({ seoDescription: e.target.value })} maxLength={170} />
              </Field>
              <ImageField label="Share image" value={page.ogImage ?? { url: "", alt: "" }} onChange={(img) => set({ ogImage: img.url ? img : undefined })} aspect="aspect-[1200/630]" />
            </div>
          </Card>
        </div>
      </div>

      <SaveBar dirty={ed.dirty} saving={ed.saving} onSave={() => ed.save()} onDiscard={ed.discard} savedAt={ed.savedAt} />
    </div>
  );
}
