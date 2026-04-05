import Link from "next/link";

const services = [
  {
    title: "Commercial Build-Outs",
    description:
      "Full-scope commercial construction — from strip centers and churches to institutional renovations. Turnkey project management so you never chase a subcontractor.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    title: "Outdoor Living Spaces",
    description:
      "Pergolas, covered patios, decks, and gazebos designed for the Texas climate. Custom-built structures that transform your backyard into a showpiece.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    title: "Custom & Decorative Lighting",
    description:
      "Chandeliers, pendants, landscape pathway lighting, and architectural fixtures. High-margin, high-impact installations that clients love.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
];

const stats = [
  { value: "100%", label: "Referral-Based Business" },
  { value: "Same Day", label: "Response Time" },
  { value: "24-48hr", label: "Estimate Turnaround" },
  { value: "30+ mi", label: "Service Radius" },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-navy text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy opacity-90" />
        <div className="relative max-w-7xl mx-auto px-6 py-28 lg:py-40">
          <div className="max-w-3xl">
            <p className="text-gold font-semibold text-sm tracking-widest uppercase mb-4">
              General Contractor &bull; College Station, TX
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Your Project. Our Accountability.{" "}
              <span className="text-gold">Zero Excuses.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-10 max-w-2xl">
              M&amp;M Pro Construction delivers turnkey commercial and
              residential construction across the Brazos Valley. Hands-off
              project management, transparent pricing, and a standard of
              professionalism that clients notice from day one.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-4 rounded text-center transition-colors"
              >
                Request a Free Estimate
              </Link>
              <Link
                href="/portfolio"
                className="border border-white/20 hover:border-gold text-white hover:text-gold font-semibold px-8 py-4 rounded text-center transition-colors"
              >
                View Our Work
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative gold bar */}
        <div className="h-1 bg-gradient-to-r from-gold via-gold-light to-transparent" />
      </section>

      {/* Stats Bar */}
      <section className="bg-cream border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-navy">{stat.value}</p>
                <p className="text-sm text-slate mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-gold font-semibold text-sm tracking-widest uppercase mb-3">
              What We Do
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-navy">
              Built for Commercial. Refined for Residential.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-white border border-black/5 rounded-lg p-8 hover-lift"
              >
                <div className="w-14 h-14 bg-navy/5 rounded-lg flex items-center justify-center text-gold mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-navy mb-3">
                  {service.title}
                </h3>
                <p className="text-slate leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/services"
              className="text-gold hover:text-gold-dark font-semibold transition-colors"
            >
              View All Services &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Project */}
      <section className="bg-navy text-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-gold font-semibold text-sm tracking-widest uppercase mb-3">
                Featured Project
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Free Wheel Fellowship Baptist Church
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                A full-scope commercial project including concrete sidewalk
                removal and replacement, new slab work, a 7-foot-wide metal
                covered walkway, commercial door installation, LED lighting, and
                ADA compliance improvements. Kingdom-aligned from top to bottom.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Concrete removal & replacement",
                  "Metal covered walkway installation",
                  "Commercial doors & LED lighting",
                  "ADA compliance improvements",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-gold rounded-full flex-shrink-0" />
                    <span className="text-white/80">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/portfolio"
                className="bg-gold hover:bg-gold-light text-navy font-semibold px-6 py-3 rounded transition-colors inline-block"
              >
                See the Full Portfolio
              </Link>
            </div>
            <div className="bg-navy-light border border-white/10 rounded-lg aspect-[4/3] flex items-center justify-center">
              <div className="text-center text-white/30">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">Project photos coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why M&M */}
      <section className="py-20 lg:py-28 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-gold font-semibold text-sm tracking-widest uppercase mb-3">
              Why M&amp;M Pro
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-navy">
              The Difference You Feel on Day One
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Same-Day Response",
                desc: "We show up the day your lead comes in. Not next week. Not after three follow-ups. The same day.",
              },
              {
                title: "Turnkey Management",
                desc: "You hire us and walk away until it's done. We manage every trade, every timeline, every detail.",
              },
              {
                title: "Transparent Pricing",
                desc: "You know where every dollar is going. No surprises, no change-order games, no runaround.",
              },
              {
                title: "Spotless Jobsites",
                desc: "Dirty jobs done cleanly. Our jobsite cleanliness is a signature trait — clients notice and mention it.",
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="w-2 h-2 bg-gold rounded-full" />
                </div>
                <h3 className="text-lg font-bold text-navy mb-2">
                  {item.title}
                </h3>
                <p className="text-slate text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-navy text-white py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Build Something That Lasts?
          </h2>
          <p className="text-white/60 text-lg mb-8">
            Whether it&apos;s a commercial build-out or a backyard
            transformation, we bring the same standard to every project.
            Let&apos;s talk about yours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-4 rounded transition-colors"
            >
              Get Your Free Estimate
            </Link>
            <a
              href="tel:9795873639"
              className="border border-white/20 hover:border-gold text-white hover:text-gold font-semibold px-8 py-4 rounded transition-colors"
            >
              Call (979) 587-3639
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
