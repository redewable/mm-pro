import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "M&M Pro Construction is built on legacy, craftsmanship, and faith. Learn about owner Michael Ramirez and the vision behind M&M Pro.",
};

const values = [
  {
    title: "Legacy",
    description:
      "Everything we do is for the next generation. M&M was founded on the vision Michael shared with his grandfather — also named Michael.",
  },
  {
    title: "Kingdom Culture",
    description:
      "Faith-driven business decisions, kingdom-aligned partnerships, and a commitment to building something that honors God.",
  },
  {
    title: "Craftsmanship",
    description:
      "Trained across multiple trades by his grandfather, Michael brings rare generalist expertise to every project.",
  },
  {
    title: "Transparency",
    description:
      "Daily communication. No surprises. You know where your money is going before we break ground.",
  },
  {
    title: "Integrity",
    description:
      "We show up professionally, arrive on time, and do what we say. Always. This isn't a policy — it's who we are.",
  },
  {
    title: "Shared Success",
    description:
      "We pay people well, invest in our subcontractors, and treat every relationship as a partnership.",
  },
];

const milestones = [
  { year: "Legacy", text: "Trained across multiple trades by grandfather Michael — the foundation of everything." },
  { year: "2025", text: "M&M Pro Construction officially launched in College Station, TX." },
  { year: "Today", text: "Growing toward full commercial GC operations — churches, strip centers, institutional builds." },
  { year: "Vision", text: "Multiple crews, expert team, kingdom-minded culture that people want to be part of." },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-12 bg-gold" />
              <span className="text-gold font-semibold text-sm tracking-widest uppercase">
                Our Story
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-navy dark:text-white tracking-tight mb-6">
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

      {/* Origin Story */}
      <section className="bg-warm-gray dark:bg-navy-light border-y border-border py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-navy dark:text-white tracking-tight mb-6">
                Two Michaels. One Name.
              </h2>
              <div className="space-y-5 text-slate leading-relaxed">
                <p>
                  M&amp;M stands for Michael and his grandfather — also named
                  Michael. Growing up, they built quality things together. Tools
                  in hand, side by side. That&apos;s where the standard was set.
                </p>
                <p>
                  When Michael felt called to start his own company, the name
                  was never in question. M&amp;M Pro Construction carries
                  forward the vision of a man who believed that if you&apos;re
                  going to build something, you build it right — and you build
                  it to last.
                </p>
                <p>
                  Today, that same standard applies to every project — from a
                  church walkway to a custom pergola. The tools have changed. The
                  craftsmanship hasn&apos;t.
                </p>
              </div>
            </div>
            <div className="bg-white dark:bg-navy border border-border rounded-lg aspect-[4/3] flex items-center justify-center">
              <div className="text-center text-slate/30">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">Owner photo coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 lg:py-32">
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
          <div className="space-y-8">
            {milestones.map((item, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-gold rounded-full flex-shrink-0 mt-1.5" />
                  {index < milestones.length - 1 && (
                    <div className="w-px flex-1 bg-border mt-2" />
                  )}
                </div>
                <div className="pb-8">
                  <p className="text-xs font-semibold text-gold uppercase tracking-widest mb-1">
                    {item.year}
                  </p>
                  <p className="text-navy/80 dark:text-white/70 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-warm-gray dark:bg-navy-light border-y border-border py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-12 bg-gold" />
              <span className="text-gold font-semibold text-sm tracking-widest uppercase">
                What We Stand On
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-navy dark:text-white tracking-tight">
              Our Core Values
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white dark:bg-navy border border-border rounded-lg p-8"
              >
                <div className="w-10 h-10 border border-gold/30 rounded-lg flex items-center justify-center mb-4">
                  <span className="w-2 h-2 bg-gold rounded-full" />
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
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-navy dark:text-white tracking-tight mb-4">
            Let&apos;s Build Something Together
          </h2>
          <p className="text-slate text-lg mb-8">
            Whether it&apos;s your first project or your fiftieth, we bring the
            same standard every time.
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
