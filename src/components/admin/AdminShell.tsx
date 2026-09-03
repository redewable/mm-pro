"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { ProviderName } from "@/lib/storage/types";

const NAV: { href: string; label: string; icon: string; group: string }[] = [
  { href: "/admin", label: "Overview", icon: "M3 12l9-9 9 9M5 10v10h14V10", group: "Content" },
  { href: "/admin/quick", label: "Quick Add", icon: "M12 5v14M5 12h14", group: "Content" },
  { href: "/admin/projects", label: "Projects", icon: "M3 7h18M3 12h18M3 17h12", group: "Content" },
  { href: "/admin/videos", label: "Videos", icon: "M15 10l4.55-2.28A1 1 0 0121 8.62v6.76a1 1 0 01-1.45.9L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z", group: "Content" },
  { href: "/admin/media", label: "Photos & Files", icon: "M4 16l4-4 4 4 4-6 4 6M4 4h16v16H4z", group: "Content" },
  { href: "/admin/testimonials", label: "Testimonials", icon: "M8 10h8M8 14h5M21 12a8 8 0 01-11.5 7.2L4 20l1.3-4A8 8 0 1121 12z", group: "Content" },
  { href: "/admin/services", label: "Services", icon: "M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z", group: "Content" },
  { href: "/admin/careers", label: "Careers", icon: "M20 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2", group: "Content" },
  { href: "/admin/pages", label: "Page Layouts", icon: "M4 5h16v4H4zM4 11h7v8H4zM13 11h7v8h-7z", group: "Site" },
  { href: "/admin/navigation", label: "Menu Links", icon: "M4 6h16M4 12h16M4 18h16", group: "Site" },
  { href: "/admin/business", label: "Business Info", icon: "M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6", group: "Site" },
  { href: "/admin/seo", label: "SEO & Tracking", icon: "M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z", group: "Site" },
  { href: "/admin/history", label: "Version History", icon: "M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8M3 3v5h5M12 7v5l4 2", group: "System" },
  { href: "/admin/account", label: "Password", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", group: "System" },
];

export function AdminShell({
  children,
  provider,
}: {
  children: React.ReactNode;
  provider: { name: ProviderName; productionReady: boolean; note: string };
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const groups = Array.from(new Set(NAV.map((n) => n.group)));

  const nav = (
    <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Dashboard">
      {groups.map((g) => (
        <div key={g} className="mb-5">
          <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-[0.15em] uppercase text-white/30">{g}</p>
          {NAV.filter((n) => n.group === g).map((n) => {
            const active = n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href);
            const quick = n.href === "/admin/quick";
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active ? "bg-gold text-navy" : quick ? "bg-white/10 text-white hover:bg-white/20 mb-1" : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                  <path d={n.icon} />
                </svg>
                {n.label}
              </Link>
            );
          })}
        </div>
      ))}
      <div className="px-3 pt-3 border-t border-white/10">
        <a href="/" target="_blank" rel="noopener" className="flex items-center gap-2 text-xs text-white/50 hover:text-white py-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          View live site
        </a>
        <p className={`text-[11px] leading-snug mt-2 ${provider.productionReady ? "text-white/40" : "text-amber-300/90"}`}>
          {provider.productionReady ? `Storage: ${provider.name}` : `Storage: ${provider.name} (dev only)`}
        </p>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-navy flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-navy text-white fixed inset-y-0 left-0">
        <div className="flex items-center gap-3 px-5 h-16 border-b border-white/10">
          <Image src="/mm-pro-logo.png" alt="" width={32} height={32} className="w-8 h-8" />
          <div>
            <p className="text-sm font-bold leading-tight">M&amp;M Pro</p>
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/50">Dashboard</p>
          </div>
        </div>
        {nav}
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-navy text-white h-14 flex items-center justify-between px-4 shadow">
        <Link href="/admin" className="flex items-center gap-2">
          <Image src="/mm-pro-logo.png" alt="" width={28} height={28} className="w-7 h-7" />
          <span className="text-sm font-bold">Dashboard</span>
        </Link>
        <div className="flex items-center gap-1">
        <Link href="/admin/quick" className="p-2 text-gold" aria-label="Quick add photos or video">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" /></svg>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="p-2 -mr-2"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            {open ? <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden fixed inset-0 z-30 flex">
          <div className="w-72 max-w-[85%] bg-navy text-white flex flex-col pt-14 shadow-2xl">{nav}</div>
          <button type="button" className="flex-1 bg-black/50" aria-label="Close menu" onClick={() => setOpen(false)} />
        </div>
      )}

      <div className="flex-1 lg:pl-64 min-w-0">
        <main className="pt-14 lg:pt-0 min-h-screen">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
