"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import VideoPlayer from "@/components/VideoPlayer";
import Uploader from "@/components/admin/Uploader";
import { saveCollectionAction } from "@/app/admin/actions";
import { useEditor } from "@/components/admin/useSave";
import { ImageField, MediaPickerModal } from "@/components/admin/MediaPicker";
import { Button, Card, Field, Grid, Input, LinkButton, PageHeader, SaveBar, Select, Textarea, Toggle } from "@/components/admin/ui";
import { detectVideoSource } from "@/lib/content/helpers";
import { slugify, uniqueSlug } from "@/lib/ids";
import type { Project, Video } from "@/lib/content/types";

export default function VideoEditor({ initial, isNew, allVideos, projects }: { initial: Video; isNew: boolean; allVideos: Video[]; projects: Project[] }) {
  const router = useRouter();
  const ed = useEditor(initial, async (v) => {
    const others = allVideos.filter((x) => x.id !== v.id);
    const slug = uniqueSlug(v.slug || v.title, others.map((o) => o.slug));
    const next: Video = { ...v, slug, updatedAt: new Date().toISOString() };
    const list = isNew || !allVideos.some((x) => x.id === v.id) ? [next, ...others] : allVideos.map((x) => (x.id === v.id ? next : x));
    const res = await saveCollectionAction("videos", list);
    if (res.ok && isNew) router.replace(`/admin/videos/${v.id}`);
    return res;
  });
  const v = ed.value;
  const set = (patch: Partial<Video>) => ed.setValue({ ...v, ...patch });
  const [mode, setMode] = useState<"upload" | "link">(v.source === "upload" || !v.url ? "upload" : "link");
  const [pickOpen, setPickOpen] = useState(false);
  const canSave = Boolean(v.url && v.title);

  return (
    <div>
      <PageHeader
        title={isNew ? "Add video" : v.title || "Untitled video"}
        back={{ href: "/admin/videos", label: "Videos" }}
        actions={!isNew && v.slug ? <LinkButton href={`/videos/${v.slug}`} variant="secondary" size="sm">View on site ↗</LinkButton> : undefined}
      />

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <Card title="The video">
            <div className="flex gap-2 mb-4">
              <Button variant={mode === "upload" ? "primary" : "secondary"} size="sm" onClick={() => setMode("upload")}>Upload a file</Button>
              <Button variant={mode === "link" ? "primary" : "secondary"} size="sm" onClick={() => setMode("link")}>Paste a link</Button>
            </div>

            {mode === "upload" ? (
              <div className="space-y-3">
                <Uploader
                  accept="video/*"
                  multiple={false}
                  label={v.url && v.source === "upload" ? "Replace video file" : "Tap to choose a video, or drag it here"}
                  onUploaded={(results) => {
                    const r = results[0];
                    if (!r) return;
                    set({
                      url: r.item.url,
                      source: "upload",
                      title: v.title || r.item.alt || r.item.name,
                      poster: r.poster ? { url: r.poster.url, alt: r.poster.alt ?? "" } : v.poster,
                      durationSeconds: r.duration ?? v.durationSeconds,
                    });
                  }}
                />
                <p className="text-xs text-slate">
                  Or <button type="button" className="underline hover:text-navy" onClick={() => setPickOpen(true)}>pick a video already in the library</button>.
                </p>
                <MediaPickerModal
                  open={pickOpen}
                  onClose={() => setPickOpen(false)}
                  kind="video"
                  onPick={(items) => {
                    const m = items[0];
                    if (m) set({ url: m.url, source: "upload", title: v.title || m.alt || m.name });
                  }}
                />
              </div>
            ) : (
              <Field label="YouTube / Vimeo / Facebook link" htmlFor="url">
                <Input
                  id="url"
                  value={v.source === "upload" ? "" : v.url}
                  placeholder="https://www.youtube.com/watch?v=…"
                  onChange={(e) => {
                    const url = e.target.value.trim();
                    set({ url, source: url ? detectVideoSource(url) : "url" });
                  }}
                />
              </Field>
            )}

            {v.url && (
              <div className="mt-5">
                <p className="text-xs font-semibold text-slate uppercase tracking-wider mb-2">Preview</p>
                <VideoPlayer video={v} />
              </div>
            )}
          </Card>

          <Card title="Details">
            <div className="space-y-5">
              <Field label="Title" htmlFor="title">
                <Input id="title" value={v.title} onChange={(e) => set({ title: e.target.value, slug: v.slug || slugify(e.target.value) })} placeholder="e.g. Full walkthrough — Church covered walkway" />
              </Field>
              <Field label="Description" htmlFor="description">
                <Textarea id="description" value={v.description} onChange={(e) => set({ description: e.target.value })} />
              </Field>
              <Grid>
                <Field label="Project" htmlFor="project">
                  <Select id="project" value={v.projectId ?? ""} onChange={(e) => set({ projectId: e.target.value || undefined })}>
                    <option value="">— None —</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Category label" htmlFor="category">
                  <Input id="category" value={v.category} onChange={(e) => set({ category: e.target.value })} placeholder="Outdoor Living" />
                </Field>
                <Field label="Date" htmlFor="publishedAt">
                  <Input id="publishedAt" type="date" value={v.publishedAt} onChange={(e) => set({ publishedAt: e.target.value })} />
                </Field>
                <Field label="Length (seconds)" htmlFor="duration">
                  <Input id="duration" type="number" inputMode="numeric" value={v.durationSeconds ?? ""} onChange={(e) => set({ durationSeconds: Number(e.target.value) || undefined })} />
                </Field>
              </Grid>
            </div>
          </Card>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <Card title="Visibility">
            <div className="space-y-3">
              <Toggle checked={v.published} onChange={(published) => set({ published })} label="Show on website" />
              <Toggle checked={v.featured} onChange={(featured) => set({ featured })} label="Featured" />
            </div>
          </Card>
          <Card title="Thumbnail">
            <ImageField label="Thumbnail" value={v.poster ?? { url: "", alt: "" }} onChange={(poster) => set({ poster: poster.url ? poster : undefined })} aspect="aspect-video" />
          </Card>
          <Card title="Web address">
            <Field label="Slug" htmlFor="slug" help={`/videos/${v.slug || slugify(v.title) || "…"}`}>
              <Input id="slug" value={v.slug} onChange={(e) => set({ slug: slugify(e.target.value) })} placeholder={slugify(v.title)} />
            </Field>
          </Card>
        </div>
      </div>

      <SaveBar
        dirty={(ed.dirty || isNew) && canSave}
        saving={ed.saving}
        onSave={() => ed.save()}
        onDiscard={isNew ? undefined : ed.discard}
        savedAt={ed.savedAt}
        extra={!canSave ? <span className="text-xs text-slate hidden sm:inline">Add a video and a title to save</span> : undefined}
      />
    </div>
  );
}
