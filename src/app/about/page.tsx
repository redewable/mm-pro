import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About",
  description:
    "M&M Pro Construction is built on legacy, craftsmanship, and faith. Learn about owner Michael Ramirez and the vision behind M&M Pro in College Station, TX.",
};

const values = [
  {
    title: "Legacy",
    description:
      "Every decision we make is shaped by the generation before us and built for the generation after. M&M carries forward the vision Michael shared with his grandfather — and it's a standard we refuse to lower.",
    icon: (
      <svg className="w-6 h-6" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v1m0 16v1m-8-9H3m18 0h-1m-2.636-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707" />
        <circle cx="12" cy="12" r="4" />
        <path d="M12 8v4l2 2" />
      </svg>
    ),
  },
  {
    title: "Kingdom Culture",
    description:
      "Our faith isn't separate from our work — it's woven into every partnership, every hire, and every handshake. We build with purpose that goes beyond the bottom line.",
    icon: (
      <svg className="w-6 h-6" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L9 9H2l6 4.5L5.5 21 12 16.5 18.5 21 16 13.5 22 9h-7L12 2z" />
      </svg>
    ),
  },
  {
    title: "Craftsmanship",
    description:
      "Michael was trained across multiple trades by his grandfather — framing, electrical, concrete, finish work. That rare cross-discipline expertise means we catch problems others miss and deliver solutions that last.",
    icon: (
      <svg className="w-6 h-6" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    title: "Transparency",
    description:
      "Daily client communication isn't a perk — it's how we operate. You'll know where your money is going, what's happening today, and what's coming next. No surprises. Ever.",
    icon: (
      <svg className="w-6 h-6" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: "Integrity",
    description:
      "We show up dressed professionally, on time, and ready to work. We do what we say we'll do. No exceptions. Clients notice — and they remember.",
    icon: (
      <svg className="w-6 h-6" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12l2 2 4-4" />
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      </svg>
    ),
  },
  {
    title: "Shared Success",
    description:
      "We believe in paying people well, rewarding great work, and treating every subcontractor like a partner. When you win, we win — and that's exactly how it should be.",
    icon: (
      <svg className="w-6 h-6" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
];

const milestones = [
  {
    year: "Roots",
    text: "Raised by his grandfather — also named Michael — learning framing, electrical, concrete, and finish work. The trades weren't just skills; they were a way of life passed down through generations.",
  },
  {
    year: "Career",
    text: "Spent years in the field working alongside top-tier commercial contractors, including Rosendin Electric — one of the nation's largest electrical contractors. That experience shaped how Michael thinks about systems, safety, culture, and execution at scale.",
  },
  {
    year: "April 2025",
    text: "M&M Pro Construction officially launched in College Station, TX. From day one, every client came through referral — a track record that hasn't changed.",
  },
  {
    year: "Today",
    text: "Growing toward full commercial general contractor operations — churches, strip centers, and institutional builds — while maintaining the select residential outdoor living work that built our reputation.",
  },
  {
    year: "The Vision",
    text: "Multiple crews running simultaneously. A team of experts — superintendents, project managers, estimators. A kingdom-minded culture that people are proud to be part of, and revenue that funds the mission.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-12 bg-gold" />
              <span className="text-gold font-semibold text-sm tracking-widest uppercase">
                Our Story
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-navy dark:text-white tracking-tight leading-[1.15] mb-6">
              Built on Legacy.{" "}
              <span className="text-gold">Driven by Purpose.</span>
            </h1>
            <p className="text-slate text-lg leading-relaxed max-w-2xl">
              M&amp;M Pro Construction isn&apos;t just a business name — it&apos;s a
              generational promise. Two Michaels. One vision. A commitment to
              building things the right way, every single time.
            </p>
          </div>
        </div>
      </section>

      {/* Origin Story + Family Photo */}
      <section className="bg-warm-gray dark:bg-navy-light border-y border-border py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-navy dark:text-white tracking-tight leading-tight mb-6">
                Two Michaels. One Name.
              </h2>
              <div className="space-y-5 text-slate leading-relaxed">
                <p>
                  The &ldquo;M&amp;M&rdquo; in M&amp;M Pro Construction stands for Michael
                  Ramirez and his grandfather — also named Michael. Growing up,
                  they built things together. Not projects — quality. Tools in
                  hand, side by side, with a standard that didn&apos;t bend.
                </p>
                <p>
                  When Michael felt called to start his own company, the name
                  was never a question. M&amp;M Pro Construction carries forward
                  the vision of a man who believed that if you&apos;re going to
                  build something, you build it right — and you build it to last.
                </p>
                <p>
                  Before launching M&amp;M, Michael spent years in the field
                  alongside some of the largest contractors in the country,
                  including Rosendin Electric. That experience — working on
                  large-scale commercial projects with world-class systems —
                  gave him a blueprint for the kind of company he wanted to build:
                  one with real culture, elite standards, and a commitment to
                  taking care of the people who show up every day.
                </p>
              </div>
            </div>
            <div className="relative rounded-lg overflow-hidden aspect-[4/5] lg:aspect-[3/4]">
              <Image
                src="/ramirez-family.jpg"
                alt="Michael Ramirez with his family"
                fill
                className="object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 lg:py-28">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-12 bg-gold" />
            <span className="text-gold font-semibold text-sm tracking-widest uppercase">
              Our Journey
            </span>
          </div>
          <h2 className="text-3xl font-bold text-navy dark:text-white tracking-tight mb-12">
            Where We&apos;ve Been. Where We&apos;re Going.
          </h2>
          <div className="space-y-0">
            {milestones.map((item, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-gold rounded-full flex-shrink-0 mt-2" />
                  {index < milestones.length - 1 && (
                    <div className="w-px flex-1 bg-border" />
                  )}
                </div>
                <div className="pb-10">
                  <p className="text-xs font-bold text-gold uppercase tracking-widest mb-2">
                    {item.year}
                  </p>
                  <p className="text-navy/80 dark:text-white/70 leading-relaxed text-[15px]">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-warm-gray dark:bg-navy-light border-y border-border py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-14">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-12 bg-gold" />
              <span className="text-gold font-semibold text-sm tracking-widest uppercase">
                What We Stand On
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-navy dark:text-white tracking-tight">
              Our Core Values
            </h2>
            <p className="text-slate mt-4 leading-relaxed">
              These aren&apos;t words on a wall. They&apos;re how we show up —
              on every jobsite, in every conversation, and in every decision we make.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white dark:bg-navy border border-border rounded-lg p-8 hover-lift"
              >
                <div className="w-11 h-11 bg-gold/10 rounded-lg flex items-center justify-center text-gold mb-5">
                  {value.icon}
                </div>
                <h3 className="text-base font-bold text-navy dark:text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-slate text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-navy dark:text-white tracking-tight mb-4">
            Let&apos;s Build Something Together
          </h2>
          <p className="text-slate text-lg mb-8 leading-relaxed">
            Whether it&apos;s your first project or your fiftieth, we bring the
            same care, the same standard, and the same accountability.
          </p>
          <Link
            href="/contact"
            className="bg-navy dark:bg-gold text-white dark:text-navy font-semibold px-8 py-4 rounded transition-colors hover:bg-navy-light dark:hover:bg-gold-light inline-block"
          >
            Start a Conversation
          </Link>
        </div>
      </section>
    </>
  );
}
