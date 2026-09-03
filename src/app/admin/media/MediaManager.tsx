"use client";

import { useMemo, useState } from "react";
import { deleteMediaAction, updateMediaAction } from "@/app/admin/actions";
import Uploader, { formatBytes } from "@/components/admin/Uploader";
import { MediaThumb } from "@/components/admin/MediaPicker";
import { useToast } from "@/components/admin/Toast";
import { Button, ConfirmButton, Field, Input, PageHeader } from "@/components/admin/ui";
import type { MediaItem } from "@/lib/content/types";

export default function MediaManager({ initial }: { initial: MediaItem[] }) {
  const [items, setItems] = useState(initial);
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<"all" | "image" | "video">("all");
  const [active, setActive] = useState<MediaItem | null>(null);
  const { push } = useToast();

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return items.filter((m) => (kind === "all" || m.kind === kind) && (!term || m.name.toLowerCase().includes(term) || (m.alt ?? "").toLowerCase().includes(term)));
  }, [items, q, kind]);

  async function saveAlt(m: MediaItem) {
    const res = await updateMediaAction(m);
    if (res.ok) {
      setItems((list) => list.map((x) => (x.id === m.id ? m : x)));
      push("success", "Saved");
    } else push("error", res.error);
  }

  async function remove(m: MediaItem) {
    const res = await deleteMediaAction(m.id);
    if (res.ok) {
      setItems((list) => list.filter((x) => x.id !== m.id));
      setActive(null);
      push("success", "Deleted");
    } else push("error", res.error);
  }

  return (
    <div>
      <PageHeader title="Photos & Files" />
      <Uploader onUploaded={(results) => setItems((list) => [...results.flatMap((r) => (r.poster ? [r.item, r.poster] : [r.item])), ...list])} />

      <div className="flex flex-col sm:flex-row gap-2 sm:items-center mt-6 mb-4">
        <Input placeholder="Search files…" value={q} onChange={(e) => setQ(e.target.value)} className="sm:max-w-xs" />
        <div className="flex gap-2">
          {(["all", "image", "video"] as const).map((k) => (
            <button key={k} type="button" onClick={() => setKind(k)} className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${kind === k ? "bg-navy text-white border-navy" : "bg-white text-slate border-gray-300"}`}>
              {k === "all" ? `All (${items.length})` : k === "image" ? `Photos (${items.filter((m) => m.kind === "image").length})` : `Videos (${items.filter((m) => m.kind === "video").length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {filtered.map((m) => (
          <button key={m.id} type="button" onClick={() => setActive(m)} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 hover:border-gold focus:outline-none focus:ring-2 focus:ring-gold" title={m.name}>
            <MediaThumb item={m} />
          </button>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-sm text-slate mt-4">No files match.</p>}

      {active && (
        <div className="fixed inset-0 z-[150] bg-black/60 flex items-end sm:items-center justify-center sm:p-6" role="dialog" aria-modal="true" onClick={() => setActive(null)}>
          <div className="bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-video bg-gray-100">
              {active.kind === "video" ? (
                <video src={active.url} controls className="absolute inset-0 w-full h-full" playsInline />
              ) : (
                <MediaThumb item={active} className="!object-contain" />
              )}
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="font-semibold text-navy break-all">{active.name}</p>
                <p className="text-xs text-slate mt-0.5">
                  {active.kind} {formatBytes(active.size) && `· ${formatBytes(active.size)}`} {active.width && active.height ? `· ${active.width}×${active.height}` : ""} · {new Date(active.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Field label="Description (alt text)" help="Describes the photo for Google and screen readers.">
                <Input value={active.alt ?? ""} onChange={(e) => setActive({ ...active, alt: e.target.value })} />
              </Field>
              <Field label="Link">
                <Input readOnly value={active.url} onFocus={(e) => e.target.select()} />
              </Field>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <ConfirmButton onConfirm={() => remove(active)} confirmText="Delete permanently?">Delete file</ConfirmButton>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => setActive(null)}>Close</Button>
                  <Button variant="gold" onClick={() => saveAlt(active)}>Save</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
