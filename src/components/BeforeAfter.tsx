"use client";

import { useRef, useState } from "react";
import SmartImage from "./SmartImage";
import type { BeforeAfterPair } from "@/lib/content/types";

// Drag-to-compare slider. Works with mouse, touch and keyboard (arrow keys).
export default function BeforeAfter({ pair }: { pair: BeforeAfterPair }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  function setFromClientX(x: number) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos(Math.round(Math.min(100, Math.max(0, ((x - rect.left) / rect.width) * 100))));
  }

  return (
    <figure className="m-0">
      <div
        ref={ref}
        className="relative aspect-[4/3] rounded-lg overflow-hidden bg-warm-gray dark:bg-navy-light select-none touch-none cursor-ew-resize"
        onPointerDown={(e) => {
          dragging.current = true;
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          setFromClientX(e.clientX);
        }}
        onPointerMove={(e) => dragging.current && setFromClientX(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        <SmartImage src={pair.after.url} alt={pair.after.alt || "After"} fill sizes="(max-width: 1024px) 100vw, 800px" className="object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <SmartImage src={pair.before.url} alt={pair.before.alt || "Before"} fill sizes="(max-width: 1024px) 100vw, 800px" className="object-cover" />
        </div>
        <div className="absolute inset-y-0 w-0.5 bg-white shadow" style={{ left: `calc(${pos}% - 1px)` }} />
        <div
          role="slider"
          aria-label="Compare before and after"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pos}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5));
            if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5));
          }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white text-navy shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gold"
          style={{ left: `${pos}%` }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-3 3 3 3M16 9l3 3-3 3" />
          </svg>
        </div>
        <span className="absolute top-3 left-3 bg-black/60 text-white text-xs font-semibold px-2 py-1 rounded">Before</span>
        <span className="absolute top-3 right-3 bg-gold text-navy text-xs font-semibold px-2 py-1 rounded">After</span>
      </div>
      {pair.caption && <figcaption className="text-sm text-slate mt-2">{pair.caption}</figcaption>}
    </figure>
  );
}
