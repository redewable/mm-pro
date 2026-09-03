"use client";

import { useState } from "react";
import { saveCollectionAction } from "@/app/admin/actions";
import { useEditor } from "@/components/admin/useSave";
import { SortableList } from "@/components/admin/SortableList";
import { StringListField } from "@/components/admin/StringListField";
import { ImageField } from "@/components/admin/MediaPicker";
import { IconPicker } from "@/components/admin/SectionForm";
import Icon from "@/components/Icon";
import { Badge, Button, ConfirmButton, Field, Input, PageHeader, SaveBar, Textarea, Toggle } from "@/components/admin/ui";
import { newId, slugify, uniqueSlug } from "@/lib/ids";
import type { IconName, Service } from "@/lib/content/types";

export default function ServicesManager({ initial }: { initial: Service[] }) {
  const ed = useEditor(initial, (v) =>
    saveCollectionAction(
      "services",
      v.map((s, i, all) => ({ ...s, slug: uniqueSlug(s.slug || s.title, all.map((x) => x.slug), s.id, all.map((x) => x.id)) }))
    )
  );
  const list = ed.value;
  const [openId, setOpenId] = useState<string | null>(null);
  const update = (id: string, patch: Partial<Service>) => ed.setValue(list.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  function add() {
    const s: Service = { id: newId("svc"), slug: "", title: "", description: "", features: [], icon: "sparkle", primary: false, showOnHome: true, published: true };
    ed.setValue([...list, s]);
    setOpenId(s.id);
  }

  return (
    <div>
      <PageHeader
        title="Services"
        actions={<Button variant="gold" onClick={add}>+ Add service</Button>}
      />
      <SortableList
        items={list}
        onChange={ed.setValue}
        className="space-y-3"
        render={(s, _i, controls) => {
          const open = openId === s.id;
          return (
            <div className={`bg-white border rounded-xl ${open ? "border-gold" : "border-gray-200"}`}>
              <div className="flex items-center gap-2 p-3">
                {controls}
                <span className="w-9 h-9 rounded-lg bg-gold/10 text-gold flex items-center justify-center flex-shrink-0">
                  <Icon name={s.icon} className="w-5 h-5" />
                </span>
                <button type="button" className="flex-1 min-w-0 text-left" onClick={() => setOpenId(open ? null : s.id)}>
                  <span className="flex flex-wrap items-center gap-1.5">
                    <span className="text-sm font-bold text-navy">{s.title || "New service"}</span>
                    {s.primary && <Badge tone="gold">Primary</Badge>}
                    {s.showOnHome && <Badge tone="blue">Home</Badge>}
                    {!s.published && <Badge tone="gray">Hidden</Badge>}
                  </span>
                  <span className="block text-xs text-slate truncate">{s.description}</span>
                </button>
                <Button variant="ghost" size="sm" onClick={() => setOpenId(open ? null : s.id)}>{open ? "Close" : "Edit"}</Button>
              </div>
              {open && (
                <div className="border-t border-gray-100 p-4 sm:p-5 space-y-5">
                  <Field label="Service name" htmlFor={`t-${s.id}`}>
                    <Input id={`t-${s.id}`} value={s.title} onChange={(e) => update(s.id, { title: e.target.value, slug: s.slug || slugify(e.target.value) })} />
                  </Field>
                  <Field label="Description" htmlFor={`d-${s.id}`}>
                    <Textarea id={`d-${s.id}`} value={s.description} onChange={(e) => update(s.id, { description: e.target.value })} />
                  </Field>
                  <StringListField label="What's included (bullets)" value={s.features} onChange={(features) => update(s.id, { features })} addLabel="Add bullet" />
                  <IconPicker label="Icon" value={s.icon} onChange={(icon) => update(s.id, { icon: icon as IconName })} />
                  <ImageField label="Photo (for primary services)" value={s.image ?? { url: "", alt: "" }} onChange={(image) => update(s.id, { image: image.url ? image : undefined })} />
                  <div className="grid sm:grid-cols-3 gap-3">
                    <Toggle checked={s.primary} onChange={(primary) => update(s.id, { primary })} label="Primary service" help="Big photo row on Services page" />
                    <Toggle checked={s.showOnHome} onChange={(showOnHome) => update(s.id, { showOnHome })} label="Show on home page" />
                    <Toggle checked={s.published} onChange={(published) => update(s.id, { published })} label="Published" />
                  </div>
                  <ConfirmButton onConfirm={() => ed.setValue(list.filter((x) => x.id !== s.id))} confirmText="Delete this service?">Delete</ConfirmButton>
                </div>
              )}
            </div>
          );
        }}
      />
      <SaveBar dirty={ed.dirty} saving={ed.saving} onSave={() => ed.save()} onDiscard={ed.discard} savedAt={ed.savedAt} />
    </div>
  );
}
