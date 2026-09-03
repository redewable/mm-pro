"use client";

import Link from "next/link";
import { useState } from "react";
import SmartImage from "@/components/SmartImage";
import Icon from "@/components/Icon";
import Uploader, { type UploadedResult } from "@/components/admin/Uploader";
import { quickAddAction } from "@/app/admin/actions";
import { useToast } from "@/components/admin/Toast";
import { Button, Field, Input, Select, Textarea, Toggle } from "@/components/admin/ui";
import { STATUS_LABEL } from "@/lib/content/helpers";
import { todayIso } from "@/lib/ids";
import type { ImageRef, ProjectStatus } from "@/lib/content/types";

type Mini = { id: string; title: string; status: ProjectStatus; cover: string };

// One screen, built for a phone on a job site: pick photos/video, say which
// project, add a line about what happened, save. Creates the project, the
// video entries, the gallery photos and a dated progress update in one go.
export default function QuickAdd({ projects, categories }: { projects: Mini[]; categories: string[] }) {
  const { push } = useToast();
  const active = projects.filter((p) => p.status !== "completed");
  const [projectId, setProjectId] = useState<string>(active[0]?.id ?? "");
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState(categories[0] ?? "Outdoor Living");
  const [newStatus, setNewStatus] = useState<ProjectStatus>("in-progress");
  const [images, setImages] = useState<ImageRef[]>([]);
  const [videos, setVideos] = useState<{ url: string; poster?: ImageRef; durationSeconds?: number; name: string }[]>([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [date, setDate] = useState(todayIso());
  const [setCover, setSetCover] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ projectId: string; slug: string } | null>(null);

  const isNew = projectId === "__new";
  const canSave = (isNew ? newTitle.trim().length > 0 : Boolean(projectId)) && (images.length > 0 || videos.length > 0 || text.trim() || title.trim());

  function onUploaded(results: UploadedResult[]) {
    for (const r of results) {
      if (r.item.kind === "video") {
        setVideos((v) => [...v, { url: r.item.url, poster: r.poster ? { url: r.poster.url, alt: r.poster.alt ?? "" } : undefined, durationSeconds: r.duration ?? undefined, name: r.item.name }]);
      } else if (r.item.kind === "image") {
        setImages((i) => [...i, { url: r.item.url, alt: r.item.alt ?? "" }]);
      }
    }
  }

  async function save() {
    setBusy(true);
    const res = await quickAddAction({
      projectId: isNew ? "" : projectId,
      newProject: isNew ? { title: newTitle.trim(), category: newCategory, status: newStatus } : undefined,
      note: { title: title.trim(), text: text.trim(), date },
      images,
      videos,
      setCover,
    });
    setBusy(false);
    if (res.ok && res.data) {
      setDone(res.data);
      push("success", "Published to the site.");
    } else if (!res.ok) push("error", res.error);
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto text-center py-10">
        <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h1 className="text-2xl font-bold text-navy mb-1">It&apos;s live</h1>
        <p className="text-sm text-slate mb-6">
          {images.length ? `${images.length} photo${images.length > 1 ? "s" : ""}` : ""}
          {images.length && videos.length ? " and " : ""}
          {videos.length ? `${videos.length} video${videos.length > 1 ? "s" : ""}` : ""}
          {images.length || videos.length ? " added" : "Update posted"}.
        </p>
        <div className="flex flex-col gap-2">
          <Link href={`/portfolio/${done.slug}`} target="_blank" className="bg-gold hover:bg-gold-light text-navy font-semibold px-5 py-3 rounded-lg">View on the website</Link>
          <Link href={`/admin/projects/${done.projectId}`} className="bg-white border border-gray-300 hover:border-navy text-navy font-semibold px-5 py-3 rounded-lg">Edit the project</Link>
          <button
            type="button"
            onClick={() => {
              setDone(null);
              setImages([]);
              setVideos([]);
              setTitle("");
              setText("");
              setSetCover(false);
            }}
            className="text-sm font-semibold text-slate hover:text-navy py-2"
          >
            Add more
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-navy tracking-tight mb-1">Quick Add</h1>
      <p className="text-sm text-slate mb-5">Photos or a video → which job → one line about it. Done.</p>

      <div className="space-y-5">
        <section className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5">
          <Uploader onUploaded={onUploaded} label="Tap to add photos or a video" />
          {(images.length > 0 || videos.length > 0) && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-4">
              {images.map((img, i) => (
                <div key={img.url} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
                  <SmartImage src={img.url} alt="" fill sizes="120px" className="object-cover" />
                  {i === 0 && setCover && <span className="absolute bottom-1 left-1 bg-gold text-navy text-[10px] font-bold px-1.5 rounded">Cover</span>}
                  <button type="button" onClick={() => setImages((list) => list.filter((x) => x.url !== img.url))} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center" aria-label="Remove photo">×</button>
                </div>
              ))}
              {videos.map((v) => (
                <div key={v.url} className="relative aspect-square rounded-lg overflow-hidden bg-navy">
                  {v.poster?.url && <SmartImage src={v.poster.url} alt="" fill sizes="120px" className="object-cover opacity-80" />}
                  <span className="absolute inset-0 flex items-center justify-center text-gold"><Icon name="video" className="w-6 h-6" /></span>
                  <button type="button" onClick={() => setVideos((list) => list.filter((x) => x.url !== v.url))} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center" aria-label="Remove video">×</button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 space-y-4">
          <p className="text-sm font-bold text-navy">Which job?</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {active.slice(0, 7).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setProjectId(p.id)}
                className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 text-left ${projectId === p.id ? "border-gold ring-2 ring-gold/30" : "border-gray-200"}`}
              >
                {p.cover ? <SmartImage src={p.cover} alt="" fill sizes="160px" className="object-cover" /> : <span className="absolute inset-0 bg-gray-100" />}
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent text-white text-[11px] font-semibold px-1.5 pt-4 pb-1 leading-tight line-clamp-2">{p.title}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setProjectId("__new")}
              className={`aspect-[4/3] rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-xs font-semibold ${isNew ? "border-gold bg-gold/5 text-navy" : "border-gray-300 text-slate"}`}
            >
              <span className="text-xl leading-none">+</span>New job
            </button>
          </div>
          {projects.length > 7 && !isNew && (
            <Select value={projectId} onChange={(e) => setProjectId(e.target.value)} aria-label="All projects">
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.title} · {STATUS_LABEL[p.status]}</option>
              ))}
              <option value="__new">+ New job</option>
            </Select>
          )}
          {isNew && (
            <div className="grid sm:grid-cols-3 gap-3 pt-1">
              <Field label="Job name" htmlFor="q-title" className="sm:col-span-3">
                <Input id="q-title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Covered patio — Wellborn" autoFocus />
              </Field>
              <Field label="Type" htmlFor="q-cat" className="sm:col-span-2">
                <Select id="q-cat" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Status" htmlFor="q-status">
                <Select id="q-status" value={newStatus} onChange={(e) => setNewStatus(e.target.value as ProjectStatus)}>
                  <option value="planned">Upcoming</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </Select>
              </Field>
            </div>
          )}
        </section>

        <section className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 space-y-4">
          <div className="grid sm:grid-cols-[1fr_auto] gap-3">
            <Field label="What happened?" htmlFor="q-note">
              <Input id="q-note" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Slab poured, framing starts Monday" />
            </Field>
            <Field label="Date" htmlFor="q-date">
              <Input id="q-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
          </div>
          <Field label="Details (optional)" htmlFor="q-text">
            <Textarea id="q-text" rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="A sentence or two for the project page." />
          </Field>
          {images.length > 0 && !isNew && <Toggle checked={setCover} onChange={setSetCover} label="Make the first photo the project's cover" />}
        </section>

        <div className="sticky bottom-0 -mx-4 sm:mx-0 px-4 sm:px-0 py-3 bg-[#f4f5f7]/95 backdrop-blur">
          <Button variant="gold" size="lg" className="w-full" onClick={save} disabled={!canSave || busy}>
            {busy ? "Publishing…" : "Publish to website"}
          </Button>
        </div>
      </div>
    </div>
  );
}
