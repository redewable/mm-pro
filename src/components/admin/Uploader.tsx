"use client";

import { useRef, useState } from "react";
import { registerMediaAction } from "@/app/admin/actions";
import { useToast } from "./Toast";
import { formatBytes, imageDimensions, optimizeImage, toMediaItem, uploadFile, videoPosterAndDuration } from "./upload";
import type { MediaItem } from "@/lib/content/types";

export interface UploadedResult {
  item: MediaItem;
  poster?: MediaItem;
  duration?: number | null;
}

// Drop zone + file picker. Uploads straight to storage (never through a
// serverless function body), registers the result in the media library and
// hands the new MediaItem(s) back.
export default function Uploader({
  accept = "image/*,video/*",
  multiple = true,
  onUploaded,
  compact = false,
  label,
}: {
  accept?: string;
  multiple?: boolean;
  onUploaded: (results: UploadedResult[]) => void;
  compact?: boolean;
  label?: string;
}) {
  const [busy, setBusy] = useState<{ name: string; pct: number }[]>([]);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { push } = useToast();

  async function handleFiles(list: FileList | File[]) {
    const files = Array.from(list);
    if (!files.length) return;
    const results: UploadedResult[] = [];
    const toRegister: MediaItem[] = [];
    for (const original of files) {
      setBusy((b) => [...b, { name: original.name, pct: 0 }]);
      const setPct = (pct: number) => setBusy((b) => b.map((x) => (x.name === original.name ? { ...x, pct } : x)));
      try {
        const file = await optimizeImage(original);
        const url = await uploadFile(file, setPct);
        const dims = await imageDimensions(file);
        const item = toMediaItem(file, url, dims ?? {});
        let poster: MediaItem | undefined;
        let duration: number | null | undefined;
        if (file.type.startsWith("video/")) {
          const meta = await videoPosterAndDuration(file);
          duration = meta.duration;
          if (meta.width) item.width = meta.width;
          if (meta.height) item.height = meta.height;
          if (meta.poster) {
            try {
              const posterUrl = await uploadFile(meta.poster);
              poster = toMediaItem(meta.poster, posterUrl, {
                width: meta.width,
                height: meta.height,
                alt: `${item.alt} (video thumbnail)`,
              });
              toRegister.push(poster);
            } catch {
              // poster is optional
            }
          }
        }
        toRegister.push(item);
        results.push({ item, poster, duration });
      } catch (err) {
        push("error", `${original.name}: ${err instanceof Error ? err.message : "upload failed"}`);
      } finally {
        setBusy((b) => b.filter((x) => x.name !== original.name));
      }
    }
    if (toRegister.length) {
      const res = await registerMediaAction(toRegister);
      if (!res.ok) push("error", res.error);
      else push("success", `${results.length} file${results.length > 1 ? "s" : ""} uploaded`);
    }
    if (results.length) onUploaded(results);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`relative border-2 border-dashed rounded-xl text-center transition-colors ${
          drag ? "border-gold bg-gold/5" : "border-gray-300 bg-gray-50 hover:border-gray-400"
        } ${compact ? "p-4" : "p-8"}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          aria-label="Choose files to upload"
        />
        <svg className={`mx-auto text-gold ${compact ? "w-6 h-6 mb-1" : "w-9 h-9 mb-3"}`} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0-12l-4 4m4-4l4 4" />
        </svg>
        <p className={`font-semibold text-navy ${compact ? "text-sm" : ""}`}>{label ?? "Tap to choose files, or drag them here"}</p>
        {!compact && <p className="text-xs text-slate mt-1">Photos and videos, up to 2 GB each</p>}
      </div>
      {busy.length > 0 && (
        <ul className="mt-3 space-y-2">
          {busy.map((b) => (
            <li key={b.name} className="text-xs">
              <div className="flex justify-between gap-3 mb-1">
                <span className="truncate text-navy font-medium">{b.name}</span>
                <span className="text-slate">{b.pct}%</span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gold transition-all" style={{ width: `${b.pct}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export { formatBytes };
