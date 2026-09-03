"use client";

import { useEffect, useMemo, useState } from "react";
import SmartImage from "@/components/SmartImage";
import { getContentAction } from "@/app/admin/actions";
import Uploader from "./Uploader";
import { Button, Input, inputClass } from "./ui";
import type { ImageRef, MediaItem } from "@/lib/content/types";

// Modal that lets the owner pick from the media library or upload new files.
export function MediaPickerModal({
  open,
  onClose,
  onPick,
  kind = "image",
  multiple = false,
  initialItems,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (items: MediaItem[]) => void;
  kind?: "image" | "video" | "any";
  multiple?: boolean;
  initialItems?: MediaItem[];
}) {
  const [items, setItems] = useState<MediaItem[]>(initialItems ?? []);
  const [loaded, setLoaded] = useState(false);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    // Reset the selection each time the picker opens (derived during render).
    setWasOpen(open);
    if (open) setSelected([]);
  }

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    getContentAction().then((c) => {
      if (cancelled) return;
      setItems(c.media);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return items
      .filter((m) => (kind === "any" ? true : m.kind === kind))
      .filter((m) => !term || m.name.toLowerCase().includes(term) || (m.alt ?? "").toLowerCase().includes(term));
  }, [items, q, kind]);

  if (!open) return null;

  function toggle(id: string) {
    if (!multiple) {
      const item = items.find((m) => m.id === id);
      if (item) onPick([item]);
      onClose();
      return;
    }
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  return (
    <div className="fixed inset-0 z-[150] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true" aria-label="Choose media" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-4xl max-h-[92vh] sm:max-h-[85vh] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="font-bold text-navy">{kind === "video" ? "Choose a video" : kind === "image" ? "Choose a photo" : "Choose a file"}</h2>
          <button type="button" onClick={onClose} className="p-2 -mr-2 text-slate hover:text-navy" aria-label="Close">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="px-4 sm:px-6 pt-4 space-y-3">
          <Uploader
            compact
            accept={kind === "video" ? "video/*" : kind === "image" ? "image/*" : "image/*,video/*"}
            label="Upload new"
            onUploaded={(results) => {
              const fresh = results.flatMap((r) => (r.poster ? [r.item, r.poster] : [r.item]));
              setItems((prev) => [...fresh, ...prev]);
              if (!multiple) {
                const first = results[0]?.item;
                if (first && (kind === "any" || first.kind === kind)) {
                  onPick([first]);
                  onClose();
                }
              } else {
                setSelected((s) => [...s, ...results.map((r) => r.item.id)]);
              }
            }}
          />
          <Input placeholder="Search by file name…" value={q} onChange={(e) => setQ(e.target.value)} className={inputClass} />
        </div>
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          {!loaded && items.length === 0 ? (
            <p className="text-sm text-slate">Loading library…</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-slate">Nothing here yet — upload above.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 sm:gap-3">
              {filtered.map((m) => {
                const on = selected.includes(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggle(m.id)}
                    className={`relative aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 focus:outline-none focus:ring-2 focus:ring-gold ${on ? "border-gold" : "border-transparent hover:border-gray-300"}`}
                    title={m.name}
                  >
                    <MediaThumb item={m} />
                    {on && (
                      <span className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-gold text-navy flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        {multiple && (
          <div className="px-4 sm:px-6 py-3 border-t border-gray-200 flex items-center justify-between gap-3">
            <span className="text-sm text-slate">{selected.length} selected</span>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button
                variant="gold"
                disabled={!selected.length}
                onClick={() => {
                  onPick(selected.map((id) => items.find((m) => m.id === id)!).filter(Boolean));
                  onClose();
                }}
              >
                Add {selected.length || ""}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function MediaThumb({ item, className = "" }: { item: MediaItem; className?: string }) {
  if (item.kind === "image") {
    return <SmartImage src={item.url} alt={item.alt ?? ""} fill sizes="200px" className={`object-cover ${className}`} />;
  }
  if (item.kind === "video") {
    return (
      <div className={`absolute inset-0 flex flex-col items-center justify-center bg-navy text-white ${className}`}>
        <svg className="w-8 h-8 text-gold" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
        <span className="text-[10px] mt-1 px-2 truncate max-w-full">{item.name}</span>
      </div>
    );
  }
  return (
    <div className={`absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500 text-xs px-2 text-center ${className}`}>{item.name}</div>
  );
}

// Image field: preview + choose/upload + alt text.
export function ImageField({
  value,
  onChange,
  label = "Photo",
  help,
  aspect = "aspect-[4/3]",
}: {
  value: ImageRef;
  onChange: (v: ImageRef) => void;
  label?: string;
  help?: string;
  aspect?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <p className="block text-sm font-semibold text-navy mb-1.5">{label}</p>
      <div className="@container">
      <div className="flex flex-col @md:flex-row gap-3 @md:gap-4">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`relative ${aspect} w-full @md:w-48 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-300 hover:border-gold focus:outline-none focus:ring-2 focus:ring-gold`}
          aria-label={value.url ? "Change photo" : "Choose photo"}
        >
          {value.url ? (
            <SmartImage src={value.url} alt={value.alt} fill sizes="200px" className="object-cover" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-xs text-slate">Choose photo</span>
          )}
        </button>
        <div className="flex-1 space-y-2.5 min-w-0">
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
              {value.url ? "Change" : "Choose / upload"}
            </Button>
            {value.url && (
              <Button variant="ghost" size="sm" onClick={() => onChange({ url: "", alt: "" })}>
                Remove
              </Button>
            )}
          </div>
          <Input placeholder="Describe the photo (alt text, helps Google)" value={value.alt} onChange={(e) => onChange({ ...value, alt: e.target.value })} />
          {help && <p className="text-xs text-slate">{help}</p>}
        </div>
      </div>
      </div>
      <MediaPickerModal
        open={open}
        onClose={() => setOpen(false)}
        kind="image"
        onPick={(items) => {
          const m = items[0];
          if (m) onChange({ ...value, url: m.url, alt: value.alt || m.alt || "" });
        }}
      />
    </div>
  );
}
