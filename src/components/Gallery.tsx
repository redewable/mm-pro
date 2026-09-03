"use client";

import { useCallback, useEffect, useState } from "react";
import SmartImage from "./SmartImage";
import type { ImageRef } from "@/lib/content/types";

// Responsive photo grid with a keyboard-accessible lightbox.
export default function Gallery({
  images,
  columns = 3,
}: {
  images: ImageRef[];
  columns?: 2 | 3 | 4;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const list = images.filter((i) => i.url);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? null : (i + d + list.length) % list.length)),
    [list.length]
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, step]);

  if (!list.length) return null;

  const cols =
    columns === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : columns === 4
        ? "grid-cols-2 lg:grid-cols-4"
        : "grid-cols-2 lg:grid-cols-3";

  return (
    <>
      <div className={`grid ${cols} gap-3 md:gap-4`}>
        {list.map((img, i) => (
          <button
            key={`${img.url}-${i}`}
            type="button"
            onClick={() => setOpen(i)}
            className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-warm-gray dark:bg-navy-light focus:outline-none focus:ring-2 focus:ring-gold"
            aria-label={`Open photo: ${img.alt || img.caption || `Photo ${i + 1}`}`}
          >
            <SmartImage
              src={img.url}
              alt={img.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 400px"
              className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
            />
            {img.caption && (
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent text-white text-xs px-3 pt-6 pb-2 text-left">
                {img.caption}
              </span>
            )}
          </button>
        ))}
      </div>

      {open !== null && list[open] && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={close}
        >
          <div className="flex items-center justify-between px-4 py-3 text-white/70 text-sm">
            <span>
              {open + 1} / {list.length}
            </span>
            <button
              type="button"
              onClick={close}
              className="p-2 hover:text-white"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="relative flex-1 min-h-0" onClick={(e) => e.stopPropagation()}>
            <SmartImage
              src={list[open].url}
              alt={list[open].alt}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
            {list.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                  aria-label="Previous photo"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                  aria-label="Next photo"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
          {(list[open].caption || list[open].alt) && (
            <p className="text-center text-white/80 text-sm px-6 py-4">
              {list[open].caption || list[open].alt}
            </p>
          )}
        </div>
      )}
    </>
  );
}
