"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-navy text-white sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-navy-dark border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center text-sm text-white/70">
          <span>Serving Brazos, Burleson &amp; Grimes County</span>
          <a
            href="tel:9795873639"
            className="text-gold hover:text-gold-light transition-colors font-medium"
          >
            (979) 587-3639
          </a>
        </div>
      </div>

      {/* Main nav */}
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gold rounded flex items-center justify-center">
            <span className="text-navy font-black text-xl">M</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight leading-tight">
              M&amp;M Pro
            </span>
            <span className="text-xs text-white/60 tracking-widest uppercase">
              Construction
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/80 hover:text-gold transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="bg-gold hover:bg-gold-light text-navy font-semibold text-sm px-6 py-2.5 rounded transition-colors"
          >
            Get a Quote
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-navy-light border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/80 hover:text-gold transition-colors py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="bg-gold hover:bg-gold-light text-navy font-semibold text-sm px-6 py-3 rounded text-center transition-colors"
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
