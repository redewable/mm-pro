"use client";

import { useState } from "react";
import { saveCollectionAction } from "@/app/admin/actions";
import { useEditor } from "@/components/admin/useSave";
import { SortableList } from "@/components/admin/SortableList";
import { StringListField } from "@/components/admin/StringListField";
import { Badge, Button, ConfirmButton, EmptyState, Field, Grid, Input, PageHeader, SaveBar, Textarea, Toggle } from "@/components/admin/ui";
import { newId } from "@/lib/ids";
import type { Position } from "@/lib/content/types";

export default function PositionsManager({ initial }: { initial: Position[] }) {
  const ed = useEditor(initial, (v) => saveCollectionAction("positions", v));
  const list = ed.value;
  const [openId, setOpenId] = useState<string | null>(null);
  const update = (id: string, patch: Partial<Position>) => ed.setValue(list.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  function add() {
    const p: Position = { id: newId("pos"), title: "", type: "Full-time · Brazos Valley", summary: "", responsibilities: [], experience: [], bonus: [], nonNegotiables: [], published: true };
    ed.setValue([...list, p]);
    setOpenId(p.id);
  }

  return (
    <div>
      <PageHeader title="Careers" actions={<Button variant="gold" onClick={add}>+ Add position</Button>} />
      {list.length === 0 ? (
        <EmptyState title="No positions" text="The Careers page will still show the general application form." action={<Button variant="gold" onClick={add}>+ Add position</Button>} />
      ) : (
        <SortableList
          items={list}
          onChange={ed.setValue}
          className="space-y-3"
          render={(p, _i, controls) => {
            const open = openId === p.id;
            return (
              <div className={`bg-white border rounded-xl ${open ? "border-gold" : "border-gray-200"}`}>
                <div className="flex items-center gap-2 p-3">
                  {controls}
                  <button type="button" className="flex-1 min-w-0 text-left" onClick={() => setOpenId(open ? null : p.id)}>
                    <span className="flex items-center gap-2">
                      <span className="text-sm font-bold text-navy truncate">{p.title || "New position"}</span>
                      {!p.published && <Badge tone="gray">Closed</Badge>}
                    </span>
                    <span className="block text-xs text-slate truncate">{p.type}</span>
                  </button>
                  <Button variant="ghost" size="sm" onClick={() => setOpenId(open ? null : p.id)}>{open ? "Close" : "Edit"}</Button>
                </div>
                {open && (
                  <div className="border-t border-gray-100 p-4 sm:p-5 space-y-5">
                    <Grid>
                      <Field label="Job title" htmlFor={`t-${p.id}`}>
                        <Input id={`t-${p.id}`} value={p.title} onChange={(e) => update(p.id, { title: e.target.value })} />
                      </Field>
                      <Field label="Type / location" htmlFor={`ty-${p.id}`}>
                        <Input id={`ty-${p.id}`} value={p.type} onChange={(e) => update(p.id, { type: e.target.value })} />
                      </Field>
                    </Grid>
                    <Field label="Summary" htmlFor={`s-${p.id}`}>
                      <Textarea id={`s-${p.id}`} value={p.summary} onChange={(e) => update(p.id, { summary: e.target.value })} />
                    </Field>
                    <StringListField label="What you'll do" value={p.responsibilities} onChange={(responsibilities) => update(p.id, { responsibilities })} />
                    <StringListField label="What you bring" value={p.experience} onChange={(experience) => update(p.id, { experience })} />
                    <StringListField label="Bonus skills / certifications" value={p.bonus} onChange={(bonus) => update(p.id, { bonus })} />
                    <StringListField label="Non-negotiables" value={p.nonNegotiables} onChange={(nonNegotiables) => update(p.id, { nonNegotiables })} />
                    <Toggle checked={p.published} onChange={(published) => update(p.id, { published })} label="Open (shown on website)" />
                    <ConfirmButton onConfirm={() => ed.setValue(list.filter((x) => x.id !== p.id))} confirmText="Delete this position?">Delete</ConfirmButton>
                  </div>
                )}
              </div>
            );
          }}
        />
      )}
      <SaveBar dirty={ed.dirty} saving={ed.saving} onSave={() => ed.save()} onDiscard={ed.discard} savedAt={ed.savedAt} />
    </div>
  );
}
