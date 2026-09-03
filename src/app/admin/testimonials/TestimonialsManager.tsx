"use client";

import { useState } from "react";
import { saveCollectionAction } from "@/app/admin/actions";
import { useEditor } from "@/components/admin/useSave";
import { SortableList } from "@/components/admin/SortableList";
import { Badge, Button, ConfirmButton, EmptyState, Field, Grid, Input, PageHeader, SaveBar, Select, Textarea, Toggle } from "@/components/admin/ui";
import { newId } from "@/lib/ids";
import type { Testimonial } from "@/lib/content/types";

export default function TestimonialsManager({ initial }: { initial: Testimonial[] }) {
  const ed = useEditor(initial, (v) => saveCollectionAction("testimonials", v));
  const list = ed.value;
  const [openId, setOpenId] = useState<string | null>(null);
  const update = (id: string, patch: Partial<Testimonial>) => ed.setValue(list.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  function add() {
    const t: Testimonial = { id: newId("tst"), quote: "", author: "", project: "", rating: 5, source: "", featured: false, published: true };
    ed.setValue([t, ...list]);
    setOpenId(t.id);
  }

  return (
    <div>
      <PageHeader title="Testimonials" actions={<Button variant="gold" onClick={add}>+ Add testimonial</Button>} />
      {list.length === 0 ? (
        <EmptyState title="No testimonials yet" action={<Button variant="gold" onClick={add}>+ Add testimonial</Button>} />
      ) : (
        <SortableList
          items={list}
          onChange={ed.setValue}
          className="space-y-3"
          render={(t, _i, controls) => {
            const open = openId === t.id;
            return (
              <div className={`bg-white border rounded-xl ${open ? "border-gold" : "border-gray-200"}`}>
                <div className="flex items-center gap-2 p-3">
                  {controls}
                  <button type="button" className="flex-1 min-w-0 text-left" onClick={() => setOpenId(open ? null : t.id)}>
                    <span className="flex items-center gap-2">
                      <span className="text-sm font-bold text-navy truncate">{t.author || "New testimonial"}</span>
                      <span className="text-xs text-gold">{"★".repeat(Math.max(1, Math.min(5, t.rating || 5)))}</span>
                      {t.featured && <Badge tone="gold">Featured</Badge>}
                      {!t.published && <Badge tone="gray">Hidden</Badge>}
                    </span>
                    <span className="block text-xs text-slate truncate">{t.quote || "Tap to edit"}</span>
                  </button>
                  <Button variant="ghost" size="sm" onClick={() => setOpenId(open ? null : t.id)}>{open ? "Close" : "Edit"}</Button>
                </div>
                {open && (
                  <div className="border-t border-gray-100 p-4 sm:p-5 space-y-4">
                    <Field label="Quote" htmlFor={`q-${t.id}`}>
                      <Textarea id={`q-${t.id}`} value={t.quote} onChange={(e) => update(t.id, { quote: e.target.value })} rows={4} />
                    </Field>
                    <Grid cols={3}>
                      <Field label="Client name" htmlFor={`a-${t.id}`}>
                        <Input id={`a-${t.id}`} value={t.author} onChange={(e) => update(t.id, { author: e.target.value })} />
                      </Field>
                      <Field label="Project / job" htmlFor={`p-${t.id}`}>
                        <Input id={`p-${t.id}`} value={t.project} onChange={(e) => update(t.id, { project: e.target.value })} placeholder="Patio Cover" />
                      </Field>
                      <Field label="Rating" htmlFor={`r-${t.id}`}>
                        <Select id={`r-${t.id}`} value={t.rating} onChange={(e) => update(t.id, { rating: Number(e.target.value) })}>
                          {[5, 4, 3, 2, 1].map((n) => (
                            <option key={n} value={n}>{n} stars</option>
                          ))}
                        </Select>
                      </Field>
                      <Field label="Source" htmlFor={`s-${t.id}`} help="Facebook, Google, text message…">
                        <Input id={`s-${t.id}`} value={t.source ?? ""} onChange={(e) => update(t.id, { source: e.target.value })} />
                      </Field>
                    </Grid>
                    <div className="flex flex-wrap gap-6">
                      <Toggle checked={t.published} onChange={(published) => update(t.id, { published })} label="Show on website" />
                      <Toggle checked={t.featured} onChange={(featured) => update(t.id, { featured })} label="Featured on home page" />
                    </div>
                    <div className="pt-2">
                      <ConfirmButton onConfirm={() => ed.setValue(list.filter((x) => x.id !== t.id))} confirmText="Delete this testimonial?">Delete</ConfirmButton>
                    </div>
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
