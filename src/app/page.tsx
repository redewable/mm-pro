import Link from "next/link";
import Image from "next/image";

const services = [
  {
    title: "Commercial Build-Outs",
    description:
      "Full-scope commercial construction from strip centers to churches. Turnkey project management — one point of contact, complete accountability.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    title: "New Construction",
    description:
      "Ground-up builds managed end to end. We coordinate every trade, every timeline, and every inspection so you don't have to.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    title: "Outdoor Living Spaces",
    description:
      "Custom pergolas, covered patios, decks, and gazebos. Designed for the Texas climate and built to be the centerpiece of your property.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  {
    title: "Custom Lighting",
    description:
      "Chandeliers, pendants, landscape pathway lighting, and architectural fixtures. High-impact installations that transform any space.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: "Remodeling & Renovation",
    description:
      "Kitchen and bath remodels, interior renovations, and space transformations with commercial-grade project management.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm10 0a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z" />
      </svg>
    ),
  },
  {
    title: "Concrete & Flatwork",
    description:
      "Sidewalks, slabs, driveways, and foundation work. Clean pours, proper grading, and finishes built to last decades.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
];

const stats = [
  { value: "100%", label: "Referral-Based" },
  { value: "Same Day", label: "Response Time" },
  { value: "24–48 hr", label: "Estimate Turnaround" },
  { value: "4 Counties", label: "Service Area" },
];

export default function Home() {
  return (
    <>
      {/* Hero — full-width with outdoor cabana background */}
      <section className="relative bg-navy overflow-hidden min-h-[600px] lg:min-h-[700px] flex items-center">
        <Image
          src="/outdoor-cabana.webp"
          alt="Custom outdoor cabana built by M&M Pro Construction"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-navy/30" />
        <div className="relative max-w-7xl mx-auto px-6 py-28 lg:py-44 w-full">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-12 bg-gold" />
              <span className="text-gold font-semibold text-sm tracking-widest uppercase">
                General Contractor &bull; College Station, TX
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-white mb-6">
              We Build It Like{" "}
              <span className="text-gold">It&apos;s Ours.</span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed mb-10 max-w-xl">
              Turnkey commercial and residential construction across the
              Brazos Valley. One point of contact. Complete accountability.
              The kind of professionalism you feel from the first handshake.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-4 rounded text-center transition-colors"
              >
                Request a Free Estimate
              </Link>
              <Link
                href="/services"
                className="border border-white/30 hover:border-white/50 text-white font-semibold px-8 py-4 rounded text-center transition-colors"
              >
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-navy dark:text-white tracking-tight">
                  {stat.value}
                </p>
                <p className="text-sm text-slate mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-12 bg-gold" />
              <span className="text-gold font-semibold text-sm tracking-widest uppercase">
                What We Do
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-navy dark:text-white tracking-tight">
              Full-Service General Contracting
            </h2>
            <p className="text-slate mt-4 leading-relaxed">
              From commercial build-outs to custom outdoor living, we manage
              every trade so you have one call to make and zero gaps to worry
              about.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className="group bg-white dark:bg-navy-light border border-border rounded-lg p-8 hover-lift"
              >
                <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center text-gold mb-5 group-hover:bg-gold/20 transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold text-navy dark:text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-slate text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-navy dark:text-gold font-semibold text-sm hover:gap-3 transition-all"
            >
              View All Services
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Project — Church */}
      <section className="bg-warm-gray dark:bg-navy-light border-y border-border">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-12 bg-gold" />
                <span className="text-gold font-semibold text-sm tracking-widest uppercase">
                  Featured Project
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-navy dark:text-white tracking-tight mb-6">
                Fellowship Free Will Baptist Church
              </h2>
              <p className="text-slate leading-relaxed mb-8">
                A full-scope commercial project — concrete sidewalk removal and
                replacement, new slab work, a 7-foot-wide metal covered walkway,
                commercial door installation, LED lighting, and ADA compliance
                improvements.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  "Concrete & Slab Work",
                  "Metal Covered Walkway",
                  "Commercial Doors",
                  "LED Lighting",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gold rounded-full flex-shrink-0" />
                    <span className="text-navy/70 dark:text-white/60 text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 text-navy dark:text-gold font-semibold text-sm hover:gap-3 transition-all"
              >
                See All Projects
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="relative rounded-lg overflow-hidden aspect-[4/3]">
              <Image
                src="/fellowship-free-will-baptist-church.png"
                alt="Fellowship Free Will Baptist Church — M&M Pro Construction project"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why M&M */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-12 bg-gold" />
              <span className="text-gold font-semibold text-sm tracking-widest uppercase">
                Why M&amp;M Pro
              </span>
              <span className="h-px w-12 bg-gold" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-navy dark:text-white tracking-tight">
              The Difference You Notice on Day One
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              {
                title: "Same-Day Response",
                desc: "When you reach out, we show up — the same day. Not next week, not after three follow-ups. Speed is how we earn trust before the first nail is driven.",
                icon: (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                ),
              },
              {
                title: "Turnkey Management",
                desc: "You hire M&M and walk away until it's done. We coordinate every subcontractor, manage every inspection, and handle every detail so you don't have to.",
                icon: (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                    <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
                  </svg>
                ),
              },
              {
                title: "Transparent Pricing",
                desc: "You'll know where every dollar goes before we start. Detailed estimates, no hidden fees, and daily updates that keep you informed — not guessing.",
                icon: (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                  </svg>
                ),
              },
              {
                title: "Spotless Jobsites",
                desc: "Dirty jobs done cleanly — it's a signature trait our clients mention in every review. A clean site means respect for your property and attention to detail.",
                icon: (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12l2 2 4-4" />
                    <path d="M12 3l1.912 5.813a2 2 0 001.272 1.278L21 12l-5.816 1.91a2 2 0 00-1.272 1.278L12 21l-1.912-5.813a2 2 0 00-1.272-1.278L3 12l5.816-1.91a2 2 0 001.272-1.278L12 3z" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.title}>
                <div className="w-11 h-11 bg-gold/10 rounded-lg flex items-center justify-center text-gold mb-4">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-navy dark:text-white mb-2">
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

      {/* Testimonial Preview */}
      <section className="bg-warm-gray dark:bg-navy-light border-y border-border py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-xl md:text-2xl text-navy dark:text-white leading-relaxed mb-6">
            &ldquo;Anyone who&apos;s looking to have any work done from a small job
            to a large job like putting in a Patio Cover, give Michael Ramirez a
            shot, he is excellent at what he does. I am very pleased with my end
            result.&rdquo;
          </p>
          <p className="text-navy dark:text-white font-semibold">Angela Erickson</p>
          <p className="text-slate text-sm">Patio Cover &amp; Concrete</p>
          <Link
            href="/testimonials"
            className="inline-flex items-center gap-2 text-gold font-semibold text-sm mt-8 hover:gap-3 transition-all"
          >
            Read More Reviews
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy text-white py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Ready to Build Something That Lasts?
          </h2>
          <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
            Whether it&apos;s a commercial build-out or a backyard
            transformation, every project gets the same standard.
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
              className="border border-white/20 hover:border-white/40 text-white font-semibold px-8 py-4 rounded transition-colors"
            >
              Call (979) 587-3639
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
