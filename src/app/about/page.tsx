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
      "Everything we do is for the next generation. M&M was founded on the vision Michael shared with his grandfather — also named Michael. That generational commitment drives every decision.",
  },
  {
    title: "Kingdom Culture",
    description:
      "Faith-driven business decisions, kingdom-aligned partnerships, and a commitment to building something that honors God in every detail.",
  },
  {
    title: "Craftsmanship",
    description:
      "Trained across multiple trades by his grandfather, Michael brings a rare generalist expertise to every project. Standards are non-negotiable.",
  },
  {
    title: "Transparency",
    description:
      "Daily communication with clients. No surprises. You know where your money is going, and you know the timeline before we break ground.",
  },
  {
    title: "Integrity",
    description:
      "We show up dressed professionally. We arrive on time. We do what we say we'll do. Always. This isn't a policy — it's who we are.",
  },
  {
    title: "Shared Success",
    description:
      "We pay our people well, we invest in our subcontractors, and we treat every relationship as a partnership. When you win, we win.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <p className="text-gold font-semibold text-sm tracking-widest uppercase mb-4">
              Our Story
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Built on Legacy. Driven by Purpose.
            </h1>
            <p className="text-white/70 text-lg leading-relaxed">
              M&amp;M Pro Construction isn&apos;t just a business name — it&apos;s a
              generational promise. Two Michaels. One vision. A commitment to
              building things the right way, every single time.
            </p>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-gold via-gold-light to-transparent mt-20" />
      </section>

      {/* Origin Story */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-gold font-semibold text-sm tracking-widest uppercase mb-3">
                The Beginning
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
                Two Michaels. One Name.
              </h2>
              <div className="space-y-4 text-slate leading-relaxed">
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
            <div className="bg-cream border border-black/5 rounded-lg aspect-square flex items-center justify-center">
              <div className="text-center text-slate/40">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">Owner photo coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="bg-navy text-white py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-gold font-semibold text-sm tracking-widest uppercase mb-3">
            The Vision
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Where We&apos;re Going
          </h2>
          <p className="text-white/70 text-lg leading-relaxed mb-6">
            M&amp;M Pro Construction is building toward becoming a full-service
            commercial general contractor — handling churches, strip centers,
            and institutional projects across the Brazos Valley and beyond.
          </p>
          <p className="text-white/70 text-lg leading-relaxed">
            The goal is a company where the best people want to work, clients
            get a truly turnkey experience, and every dollar is managed with the
            same integrity whether it&apos;s a $25,000 renovation or a $100,000
            build-out. Kingdom-minded from the foundation up.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-28 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-gold font-semibold text-sm tracking-widest uppercase mb-3">
              What We Stand On
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-navy">
              Our Core Values
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white border border-black/5 rounded-lg p-8"
              >
                <div className="w-10 h-10 bg-gold/10 rounded flex items-center justify-center mb-4">
                  <span className="w-2 h-2 bg-gold rounded-full" />
                </div>
                <h3 className="text-lg font-bold text-navy mb-2">
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
      <section className="bg-navy text-white py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Let&apos;s Build Something Together
          </h2>
          <p className="text-white/60 text-lg mb-8">
            Whether it&apos;s your first project or your fiftieth, we bring the
            same care, the same standard, and the same accountability.
          </p>
          <Link
            href="/contact"
            className="bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-4 rounded transition-colors inline-block"
          >
            Start a Conversation
          </Link>
        </div>
      </section>
    </>
  );
}
