"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import SmartImage from "@/components/SmartImage";
import { saveCollectionAction } from "@/app/admin/actions";
import { useEditor } from "@/components/admin/useSave";
import { ImageField, MediaPickerModal } from "@/components/admin/MediaPicker";
import { SortableList } from "@/components/admin/SortableList";
import { StringListField } from "@/components/admin/StringListField";
import { Button, Card, Field, Grid, Input, LinkButton, PageHeader, SaveBar, Select, Textarea, Toggle } from "@/components/admin/ui";
import { slugify, uniqueSlug } from "@/lib/ids";
import type { ImageRef, MediaItem, Project, ProjectUpdate, Video } from "@/lib/content/types";
import { newId, todayIso } from "@/lib/ids";

export default function ProjectEditor({
  initial,
  isNew,
  allProjects,
  videos,
  categories,
}: {
  initial: Project;
  isNew: boolean;
  allProjects: Project[];
  videos: Video[];
  categories: string[];
}) {
  const router = useRouter();
  const ed = useEditor(initial, async (p) => {
    const others = allProjects.filter((x) => x.id !== p.id);
    const slug = uniqueSlug(p.slug || p.title, others.map((o) => o.slug));
    const next: Project = { ...p, slug, updatedAt: new Date().toISOString() };
    const list = isNew || !allProjects.some((x) => x.id === p.id) ? [next, ...others] : allProjects.map((x) => (x.id === p.id ? next : x));
    const res = await saveCollectionAction("projects", list);
    if (res.ok && isNew) router.replace(`/admin/projects/${p.id}`);
    return res;
  });
  const p = ed.value;
  const set = (patch: Partial<Project>) => ed.setValue({ ...p, ...patch });
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [customCategory, setCustomCategory] = useState(!categories.includes(p.category) && p.category !== "");

  const galleryRows = p.gallery.map((g, i) => ({ id: `${g.url}-${i}`, img: g }));
  const [openUpdate, setOpenUpdate] = useState<string | null>(null);
  const [updateGalleryFor, setUpdateGalleryFor] = useState<string | null>(null);
  const setUpdate = (id: string, patch: Partial<ProjectUpdate>) => set({ updates: p.updates.map((u) => (u.id === id ? { ...u, ...patch } : u)) });
  const linkedVideos = videos.filter((v) => v.projectId === p.id || p.videoIds.includes(v.id));

  return (
    <div>
      <PageHeader
        title={isNew ? "New project" : p.title || "Untitled project"}
        back={{ href: "/admin/projects", label: "Projects" }}
        actions={
          !isNew && p.slug ? (
            <LinkButton href={`/portfolio/${p.slug}`} variant="secondary" size="sm">View on site ↗</LinkButton>
          ) : undefined
        }
      />

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <Card title="Details">
            <div className="space-y-5">
              <Field label="Project name" htmlFor="title">
                <Input id="title" value={p.title} onChange={(e) => set({ title: e.target.value, slug: p.slug || slugify(e.target.value) })} placeholder="e.g. Covered Patio — Wellborn" />
              </Field>
              <Grid>
                <Field label="Category" htmlFor="category">
                  {customCategory ? (
                    <div className="flex gap-2">
                      <Input id="category" value={p.category} onChange={(e) => set({ category: e.target.value })} placeholder="Type a category" />
                      <Button variant="ghost" size="sm" onClick={() => setCustomCategory(false)}>List</Button>
                    </div>
                  ) : (
                    <Select
                      id="category"
                      value={p.category}
                      onChange={(e) => {
                        if (e.target.value === "__custom") setCustomCategory(true);
                        else set({ category: e.target.value });
                      }}
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                      <option value="__custom">Other…</option>
                    </Select>
                  )}
                </Field>
                <Field label="Status" htmlFor="status">
                  <Select id="status" value={p.status} onChange={(e) => set({ status: e.target.value as Project["status"] })}>
                    <option value="planned">Upcoming</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </Select>
                </Field>
                <Field label="Location (city / county)" htmlFor="location">
                  <Input id="location" value={p.location ?? ""} onChange={(e) => set({ location: e.target.value })} placeholder="College Station, TX" />
                </Field>
                <Field label="Completed on" htmlFor="completedAt">
                  <Input id="completedAt" type="date" value={p.completedAt ?? ""} onChange={(e) => set({ completedAt: e.target.value })} />
                </Field>
              </Grid>
              <Field label="One-line summary" htmlFor="summary">
                <Input id="summary" value={p.summary} onChange={(e) => set({ summary: e.target.value })} maxLength={200} />
              </Field>
              <Field label="Full description" htmlFor="description">
                <Textarea id="description" rows={6} value={p.description} onChange={(e) => set({ description: e.target.value })} />
              </Field>
              <StringListField label="Scope of work (bullets)" value={p.scope} onChange={(scope) => set({ scope })} placeholder="e.g. Metal roof installation" addLabel="Add scope item" />
            </div>
          </Card>

          <Card title="Photos">
            <div className="space-y-6">
              <ImageField label="Cover photo" value={p.cover} onChange={(cover) => set({ cover })} />
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-navy">Gallery ({p.gallery.length})</p>
                  <Button variant="secondary" size="sm" onClick={() => setGalleryOpen(true)}>+ Add photos</Button>
                </div>
                {p.gallery.length > 0 && (
                  <SortableList
                    items={galleryRows}
                    onChange={(rows) => set({ gallery: rows.map((r) => r.img) })}
                    className="space-y-2"
                    render={(row, index, controls) => (
                      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-2">
                        {controls}
                        <span className="relative w-16 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                          <SmartImage src={row.img.url} alt="" fill sizes="64px" className="object-cover" />
                        </span>
                        <div className="flex-1 grid sm:grid-cols-2 gap-2 min-w-0">
                          <Input
                            placeholder="Describe the photo"
                            value={row.img.alt}
                            onChange={(e) => {
                              const g = [...p.gallery];
                              g[index] = { ...g[index], alt: e.target.value };
                              set({ gallery: g });
                            }}
                            aria-label="Photo description"
                          />
                          <Input
                            placeholder="Caption (optional)"
                            value={row.img.caption ?? ""}
                            onChange={(e) => {
                              const g = [...p.gallery];
                              g[index] = { ...g[index], caption: e.target.value };
                              set({ gallery: g });
                            }}
                            aria-label="Caption"
                          />
                        </div>
                        <button type="button" onClick={() => set({ gallery: p.gallery.filter((_, i) => i !== index) })} className="p-2 text-slate hover:text-red-600" aria-label="Remove photo">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    )}
                  />
                )}
                <MediaPickerModal
                  open={galleryOpen}
                  onClose={() => setGalleryOpen(false)}
                  kind="image"
                  multiple
                  onPick={(items: MediaItem[]) => {
                    const add: ImageRef[] = items.filter((m) => !p.gallery.some((g) => g.url === m.url)).map((m) => ({ url: m.url, alt: m.alt ?? "" }));
                    const cover = p.cover.url ? p.cover : add[0] ?? p.cover;
                    set({ gallery: [...p.gallery, ...add.filter((a) => a.url !== cover.url || p.cover.url)], cover });
                  }}
                />
              </div>
            </div>
          </Card>

          <Card
            title="Before & After"
            actions={<Button variant="secondary" size="sm" onClick={() => set({ beforeAfter: [...p.beforeAfter, { id: newId("ba"), before: { url: "", alt: "Before" }, after: { url: "", alt: "After" }, caption: "" }] })}>+ Add pair</Button>}
          >
            {p.beforeAfter.length === 0 ? (
              <p className="text-sm text-slate">Two photos of the same spot. Visitors drag a slider between them.</p>
            ) : (
              <div className="space-y-5">
                {p.beforeAfter.map((pair) => (
                  <div key={pair.id} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <ImageField label="Before" value={pair.before} onChange={(before) => set({ beforeAfter: p.beforeAfter.map((x) => (x.id === pair.id ? { ...x, before } : x)) })} />
                      <ImageField label="After" value={pair.after} onChange={(after) => set({ beforeAfter: p.beforeAfter.map((x) => (x.id === pair.id ? { ...x, after } : x)) })} />
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Input placeholder="Caption (optional)" value={pair.caption ?? ""} onChange={(e) => set({ beforeAfter: p.beforeAfter.map((x) => (x.id === pair.id ? { ...x, caption: e.target.value } : x)) })} aria-label="Caption" />
                      <Button variant="danger" size="sm" onClick={() => set({ beforeAfter: p.beforeAfter.filter((x) => x.id !== pair.id) })}>Remove</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card
            title="Progress updates"
            actions={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const u: ProjectUpdate = { id: newId("upd"), date: todayIso(), title: "", text: "", images: [] };
                  set({ updates: [...p.updates, u] });
                  setOpenUpdate(u.id);
                }}
              >
                + Add update
              </Button>
            }
          >
            {p.updates.length === 0 ? (
              <p className="text-sm text-slate">Dated notes with photos, shown as a timeline on the project page. Quick Add posts here too.</p>
            ) : (
              <div className="space-y-2">
                {[...p.updates].reverse().map((u) => {
                  const open = openUpdate === u.id;
                  return (
                    <div key={u.id} className={`border rounded-lg ${open ? "border-gold" : "border-gray-200"}`}>
                      <button type="button" className="w-full flex items-center gap-3 p-3 text-left" onClick={() => setOpenUpdate(open ? null : u.id)}>
                        <span className="flex -space-x-2 flex-shrink-0">
                          {u.images.slice(0, 3).map((img, i) => (
                            <span key={i} className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-white bg-gray-100">
                              <SmartImage src={img.url} alt="" fill sizes="36px" className="object-cover" />
                            </span>
                          ))}
                          {u.images.length === 0 && <span className="w-9 h-9 rounded-full bg-gold/15 text-gold-dark flex items-center justify-center text-xs font-bold">✎</span>}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-sm font-semibold text-navy truncate">{u.title || "Untitled update"}</span>
                          <span className="block text-xs text-slate">{u.date}{u.images.length ? ` · ${u.images.length} photo${u.images.length > 1 ? "s" : ""}` : ""}{u.videoId ? " · video" : ""}</span>
                        </span>
                        <svg className={`w-4 h-4 text-slate transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                      </button>
                      {open && (
                        <div className="border-t border-gray-100 p-3 sm:p-4 space-y-3">
                          <div className="grid sm:grid-cols-[1fr_auto] gap-3">
                            <Input value={u.title} placeholder="What happened" onChange={(e) => setUpdate(u.id, { title: e.target.value })} aria-label="Title" />
                            <Input type="date" value={u.date} onChange={(e) => setUpdate(u.id, { date: e.target.value })} aria-label="Date" />
                          </div>
                          <Textarea rows={3} value={u.text} placeholder="Details (optional)" onChange={(e) => setUpdate(u.id, { text: e.target.value })} aria-label="Details" />
                          <Select value={u.videoId ?? ""} onChange={(e) => setUpdate(u.id, { videoId: e.target.value || undefined })} aria-label="Video">
                            <option value="">No video</option>
                            {videos.map((v) => (
                              <option key={v.id} value={v.id}>{v.title}</option>
                            ))}
                          </Select>
                          <div className="flex flex-wrap gap-2">
                            {u.images.map((img, i) => (
                              <span key={i} className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 group">
                                <SmartImage src={img.url} alt="" fill sizes="64px" className="object-cover" />
                                <button type="button" onClick={() => setUpdate(u.id, { images: u.images.filter((_, j) => j !== i) })} className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white text-xs" aria-label="Remove photo">×</button>
                              </span>
                            ))}
                            <button type="button" onClick={() => setUpdateGalleryFor(u.id)} className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 hover:border-gold text-slate text-xl">+</button>
                          </div>
                          <div className="flex justify-end">
                            <Button variant="danger" size="sm" onClick={() => set({ updates: p.updates.filter((x) => x.id !== u.id) })}>Delete update</Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            <MediaPickerModal
              open={updateGalleryFor !== null}
              onClose={() => setUpdateGalleryFor(null)}
              kind="image"
              multiple
              onPick={(items: MediaItem[]) => {
                if (!updateGalleryFor) return;
                const u = p.updates.find((x) => x.id === updateGalleryFor);
                if (!u) return;
                setUpdate(u.id, { images: [...u.images, ...items.filter((m) => !u.images.some((g) => g.url === m.url)).map((m) => ({ url: m.url, alt: m.alt ?? "" }))] });
              }}
            />
          </Card>

          <Card title="Videos">
            {videos.length === 0 ? (
              <p className="text-sm text-slate">
                No videos yet. <LinkButton href="/admin/videos/new" variant="secondary" size="sm">Add a video</LinkButton>
              </p>
            ) : (
              <div className="space-y-2">
                {videos.map((v) => {
                  const on = p.videoIds.includes(v.id) || v.projectId === p.id;
                  return (
                    <label key={v.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={(e) => set({ videoIds: e.target.checked ? [...new Set([...p.videoIds, v.id])] : p.videoIds.filter((id) => id !== v.id) })}
                        className="w-4 h-4 accent-gold"
                        disabled={v.projectId === p.id && !p.videoIds.includes(v.id)}
                      />
                      <span className="text-sm text-navy">{v.title}</span>
                      {v.projectId === p.id && <span className="text-xs text-slate">(linked from the video)</span>}
                    </label>
                  );
                })}
                {linkedVideos.length > 0 && <p className="text-xs text-slate pt-1">{linkedVideos.length} attached.</p>}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <Card title="Visibility">
            <div className="space-y-3">
              <Toggle checked={p.published} onChange={(published) => set({ published })} label="Show on website" />
              <Toggle checked={p.featured} onChange={(featured) => set({ featured })} label="Featured on home page" />
            </div>
          </Card>
          <Card title="Google (optional)">
            <div className="space-y-4">
              <Field label="Web address" htmlFor="slug" help={`/portfolio/${p.slug || slugify(p.title) || "…"}`}>
                <Input id="slug" value={p.slug} onChange={(e) => set({ slug: slugify(e.target.value) })} placeholder={slugify(p.title)} />
              </Field>
              <Field label="Search title" htmlFor="seoTitle">
                <Input id="seoTitle" value={p.seoTitle ?? ""} onChange={(e) => set({ seoTitle: e.target.value })} maxLength={70} />
              </Field>
              <Field label="Search description" htmlFor="seoDescription">
                <Textarea id="seoDescription" rows={3} value={p.seoDescription ?? ""} onChange={(e) => set({ seoDescription: e.target.value })} maxLength={170} />
              </Field>
            </div>
          </Card>
        </div>
      </div>

      <SaveBar dirty={ed.dirty || isNew} saving={ed.saving} onSave={() => ed.save()} onDiscard={isNew ? undefined : ed.discard} savedAt={ed.savedAt} />
    </div>
  );
}
