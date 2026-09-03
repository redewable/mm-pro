"use client";

import { saveCollectionAction } from "@/app/admin/actions";
import { useEditor } from "@/components/admin/useSave";
import { SortableList } from "@/components/admin/SortableList";
import { Button, Input, PageHeader, SaveBar, Select, Toggle } from "@/components/admin/ui";
import { newId } from "@/lib/ids";
import type { NavLink } from "@/lib/content/types";

export default function NavManager({ initial }: { initial: NavLink[] }) {
  const ed = useEditor(initial, (v) => saveCollectionAction("nav", v));
  const list = ed.value;
  const update = (id: string, patch: Partial<NavLink>) => ed.setValue(list.map((n) => (n.id === id ? { ...n, ...patch } : n)));
  return (
    <div>
      <PageHeader
        title="Menu Links"
        actions={<Button variant="gold" onClick={() => ed.setValue([...list, { id: newId("nav"), label: "", href: "/", visible: true, location: "both" }])}>+ Add link</Button>}
      />
      <SortableList
        items={list}
        onChange={ed.setValue}
        className="space-y-2"
        render={(n, _i, controls) => (
          <div className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex items-center gap-2 sm:flex-1">
              {controls}
              <Input value={n.label} placeholder="Label" onChange={(e) => update(n.id, { label: e.target.value })} aria-label="Label" className="sm:max-w-[12rem]" />
              <Input value={n.href} placeholder="/page" onChange={(e) => update(n.id, { href: e.target.value })} aria-label="Link" />
            </div>
            <div className="flex items-center gap-3 sm:gap-4 pl-10 sm:pl-0">
              <Select value={n.location} onChange={(e) => update(n.id, { location: e.target.value as NavLink["location"] })} className="!w-auto !py-1.5 !text-xs" aria-label="Where it appears">
                <option value="both">Header + footer</option>
                <option value="header">Header only</option>
                <option value="footer">Footer only</option>
              </Select>
              <Toggle checked={n.visible} onChange={(visible) => update(n.id, { visible })} label="Visible" />
              <button type="button" onClick={() => ed.setValue(list.filter((x) => x.id !== n.id))} className="p-2 text-slate hover:text-red-600" aria-label="Remove link">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
        )}
      />
      <SaveBar dirty={ed.dirty} saving={ed.saving} onSave={() => ed.save()} onDiscard={ed.discard} savedAt={ed.savedAt} />
    </div>
  );
}
