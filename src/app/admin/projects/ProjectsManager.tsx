"use client";

import Link from "next/link";
import { useState } from "react";
import SmartImage from "@/components/SmartImage";
import Icon from "@/components/Icon";
import { saveCollectionAction } from "@/app/admin/actions";
import { useEditor } from "@/components/admin/useSave";
import { SortableList } from "@/components/admin/SortableList";
import { Badge, EmptyState, LinkButton, PageHeader, SaveBar } from "@/components/admin/ui";
import { STATUS_LABEL } from "@/lib/content/helpers";
import type { Project, Video } from "@/lib/content/types";

export default function ProjectsManager({ initial, videos }: { initial: Project[]; videos: Video[] }) {
  const ed = useEditor(initial, (v) => saveCollectionAction("projects", v));
  const [filter, setFilter] = useState<"all" | Project["status"]>("all");
  const list = ed.value;
  const shown = filter === "all" ? list : list.filter((p) => p.status === filter);

  const card = (p: Project, handle?: React.ReactNode) => {
    const vidCount = videos.filter((v) => v.projectId === p.id || p.videoIds.includes(v.id)).length;
    return (
      <div className={`group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gold hover:shadow-sm transition-all ${!p.published ? "opacity-60" : ""}`}>
        <Link href={`/admin/projects/${p.id}`} className="block">
          <span className="relative block aspect-[4/3] bg-gray-200">
            {p.cover.url ? (
              <SmartImage src={p.cover.url} alt="" fill sizes="(max-width: 640px) 50vw, 300px" className="object-cover" />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center text-slate"><Icon name="camera" className="w-8 h-8" /></span>
            )}
            {p.featured && (
              <span className="absolute top-3 left-3 w-7 h-7 rounded-full bg-white/90 text-gold flex items-center justify-center shadow-sm" title="Featured on home page">
                <Icon name="star" className="w-4 h-4" />
              </span>
            )}
            <span className="absolute bottom-3 left-3 flex gap-1.5">
              {p.gallery.length > 0 && (
                <span className="bg-black/60 text-white text-[11px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1"><Icon name="camera" className="w-3 h-3" />{p.gallery.length + 1}</span>
              )}
              {vidCount > 0 && (
                <span className="bg-gold text-navy text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"><Icon name="video" className="w-3 h-3" />{vidCount}</span>
              )}
            </span>
          </span>
          <span className="block p-3.5">
            <span className="block text-sm font-bold text-navy truncate">{p.title || "Untitled"}</span>
            <span className="flex items-center gap-2 mt-1.5">
              <Badge tone={p.status === "completed" ? "green" : p.status === "in-progress" ? "blue" : "amber"}>{STATUS_LABEL[p.status]}</Badge>
              {!p.published && <Badge tone="gray">Hidden</Badge>}
              <span className="text-xs text-slate truncate">{p.category}</span>
            </span>
          </span>
        </Link>
        {handle && <span className="absolute top-3 right-3 opacity-70 group-hover:opacity-100">{handle}</span>}
      </div>
    );
  };

  return (
    <div>
      <PageHeader title="Projects" actions={<LinkButton href="/admin/projects/new" variant="gold">+ New project</LinkButton>} />

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {(["all", "in-progress", "planned", "completed"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
              filter === f ? "bg-navy text-white border-navy" : "bg-white text-slate border-gray-300 hover:border-navy"
            }`}
          >
            {f === "all" ? `All ${list.length}` : `${STATUS_LABEL[f]} ${list.filter((p) => p.status === f).length}`}
          </button>
        ))}
        {filter === "all" && list.length > 1 && <span className="text-xs text-slate ml-auto hidden sm:inline">Drag the ⠿ handle to reorder</span>}
      </div>

      {shown.length === 0 ? (
        <EmptyState title="No projects here yet" action={<LinkButton href="/admin/projects/new" variant="gold">+ New project</LinkButton>} />
      ) : filter !== "all" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">{shown.map((p) => <div key={p.id}>{card(p)}</div>)}</div>
      ) : (
        <SortableList items={list} onChange={ed.setValue} layout="grid" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4" render={(p, _i, handle) => card(p, handle)} />
      )}

      <SaveBar dirty={ed.dirty} saving={ed.saving} onSave={() => ed.save()} onDiscard={ed.discard} savedAt={ed.savedAt} />
    </div>
  );
}
