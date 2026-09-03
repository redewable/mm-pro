"use client";

import Link from "next/link";
import SmartImage from "@/components/SmartImage";
import { saveCollectionAction } from "@/app/admin/actions";
import { useEditor } from "@/components/admin/useSave";
import { SortableList } from "@/components/admin/SortableList";
import { Badge, EmptyState, LinkButton, PageHeader, SaveBar } from "@/components/admin/ui";
import { formatDuration, videoThumbnail } from "@/lib/content/helpers";
import type { Project, Video } from "@/lib/content/types";

export default function VideosManager({ initial, projects }: { initial: Video[]; projects: Project[] }) {
  const ed = useEditor(initial, (v) => saveCollectionAction("videos", v));
  const list = ed.value;
  return (
    <div>
      <PageHeader title="Videos" actions={<LinkButton href="/admin/videos/new" variant="gold">+ Add video</LinkButton>} />
      {list.length === 0 ? (
        <EmptyState title="No videos yet" text="Upload a walkthrough or paste a YouTube link." action={<LinkButton href="/admin/videos/new" variant="gold">+ Add video</LinkButton>} />
      ) : (
        <SortableList
          items={list}
          onChange={ed.setValue}
          layout="grid"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
          render={(v, _i, handle) => {
            const thumb = videoThumbnail(v);
            const project = projects.find((p) => p.id === v.projectId);
            return (
              <div className={`group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gold hover:shadow-sm transition-all ${!v.published ? "opacity-60" : ""}`}>
                <Link href={`/admin/videos/${v.id}`} className="block">
                  <span className="relative block aspect-video bg-navy">
                    {thumb && <SmartImage src={thumb} alt="" fill sizes="(max-width: 640px) 50vw, 300px" className="object-cover" />}
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="w-10 h-10 rounded-full bg-gold text-navy flex items-center justify-center shadow">
                        <svg className="w-5 h-5 ml-0.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
                      </span>
                    </span>
                    {v.durationSeconds ? <span className="absolute bottom-3 right-3 bg-black/70 text-white text-[11px] px-1.5 py-0.5 rounded">{formatDuration(v.durationSeconds)}</span> : null}
                  </span>
                  <span className="block p-3.5">
                    <span className="block text-sm font-bold text-navy truncate">{v.title || "Untitled"}</span>
                    <span className="flex items-center gap-2 mt-1.5">
                      <Badge tone="gray">{v.source === "upload" ? "File" : v.source}</Badge>
                      {v.featured && <Badge tone="gold">Featured</Badge>}
                      {!v.published && <Badge tone="gray">Hidden</Badge>}
                      <span className="text-xs text-slate truncate">{project ? project.title : v.category}</span>
                    </span>
                  </span>
                </Link>
                <span className="absolute top-3 right-3 opacity-70 group-hover:opacity-100">{handle}</span>
              </div>
            );
          }}
        />
      )}
      <SaveBar dirty={ed.dirty} saving={ed.saving} onSave={() => ed.save()} onDiscard={ed.discard} savedAt={ed.savedAt} />
    </div>
  );
}
