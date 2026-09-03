"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import PhoneLink from "./PhoneLink";

export interface HeaderProps {
  links: { label: string; href: string }[];
  phone: string;
  telHref: string;
  serviceAreaSummary: string;
  name: string;
}

export default function Header({ links, phone, telHref, serviceAreaSummary, name }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [brand, ...brandRest] = name.split(" ");
  const brandTop = brandRest.length ? `${brand} ${brandRest[0]}` : brand;
  const brandBottom = brandRest.slice(1).join(" ") || "Construction";

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 dark:bg-navy/95 backdrop-blur-md shadow-sm" : "bg-white dark:bg-navy"
      }`}
    >
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 py-2 flex justify-between items-center gap-4 text-xs text-slate">
          <span className="truncate">{serviceAreaSummary}</span>
          <PhoneLink href={telHref} className="text-navy dark:text-gold font-semibold hover:text-gold transition-colors whitespace-nowrap">
            {phone}
          </PhoneLink>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-5 sm:px-6 py-3 sm:py-4 flex justify-between items-center" aria-label="Main">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/mm-pro-logo.png" alt={name} width={40} height={40} className="w-10 h-10" priority />
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight leading-tight text-navy dark:text-white">{brandTop}</span>
            <span className="text-[10px] text-slate tracking-[0.2em] uppercase">{brandBottom}</span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {links.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`text-sm font-medium transition-colors ${
                  active ? "text-navy dark:text-white" : "text-slate hover:text-navy dark:hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            className="bg-navy dark:bg-gold text-white dark:text-navy font-semibold text-sm px-6 py-2.5 rounded transition-colors hover:bg-navy-light dark:hover:bg-gold-light"
          >
            Get a Quote
          </Link>
        </div>

        <button
          className="lg:hidden p-2 -mr-2 text-navy dark:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" aria-hidden="true" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {mobileOpen && (
        <div id="mobile-menu" className="lg:hidden border-t border-border bg-white dark:bg-navy max-h-[calc(100vh-7rem)] overflow-y-auto">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 py-3 flex flex-col">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-navy dark:text-white/90 hover:text-gold transition-colors py-3 border-b border-border/60 last:border-0 text-base"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="bg-navy dark:bg-gold text-white dark:text-navy font-semibold text-sm px-6 py-3.5 rounded text-center transition-colors mt-4 mb-2"
              onClick={() => setMobileOpen(false)}
            >
              Get a Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
