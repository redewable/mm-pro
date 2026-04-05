import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Full-service general contractor in College Station, TX. Commercial build-outs, new construction, outdoor living spaces, custom lighting, remodeling, concrete, and more.",
};

const primaryServices = [
  {
    title: "Commercial Build-Outs & New Construction",
    description:
      "From ground-up new builds to interior build-outs, we manage commercial projects end to end. Churches, strip centers, institutional facilities — we handle every trade so you don't have to chase anyone.",
    features: [
      "Full-scope general contracting",
      "Subcontractor management & scheduling",
      "ADA compliance & code adherence",
      "Commercial door installation",
      "Budget management & transparent reporting",
    ],
  },
  {
    title: "Outdoor Living Spaces",
    description:
      "Custom-built pergolas, covered patios, gazebos, and decks designed for the Texas climate and built to be the centerpiece of your property. Combined with our lighting expertise, the results speak for themselves.",
    features: [
      "Custom pergola & gazebo design",
      "Covered patios & shade structures",
      "Composite & wood decking",
      "Integrated lighting design",
      "Landscape coordination",
    ],
  },
  {
    title: "Custom & Decorative Lighting",
    description:
      "Chandeliers, pendant fixtures, architectural lighting, and landscape pathway illumination. This is where craftsmanship meets artistry — high-impact installations that transform any space.",
    features: [
      "Chandelier & pendant installation",
      "Ceiling fixture design & mounting",
      "Landscape pathway lighting",
      "LED commercial lighting",
      "Accent & architectural lighting",
    ],
  },
];

const additionalServices = [
  {
    title: "Remodeling & Renovation",
    description:
      "Kitchen and bath remodels, interior renovations, and space transformations. We bring the same commercial-grade project management to every residential project.",
  },
  {
    title: "Concrete & Flatwork",
    description:
      "Sidewalks, slabs, driveways, and foundation work. Clean pours, proper grading, and finishes that hold up for decades.",
  },
  {
    title: "Drywall & Framing",
    description:
      "Structural framing and drywall installation for both commercial and residential projects. Precision work that sets the foundation for everything that follows.",
  },
  {
    title: "Fencing",
    description:
      "Privacy fencing, security fencing, and decorative options for residential and commercial properties across the Brazos Valley.",
  },
  {
    title: "Painting",
    description:
      "Interior and exterior painting managed through our trusted subcontractor network. Professional prep, clean lines, and finishes that last.",
  },
  {
    title: "Flooring & Tile",
    description:
      "Hardwood, tile, luxury vinyl, and commercial-grade flooring installed through our vetted subcontractor partners.",
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <p className="text-gold font-semibold text-sm tracking-widest uppercase mb-4">
              Our Services
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              One Contractor. Every Trade. Zero Gaps.
            </h1>
            <p className="text-white/70 text-lg leading-relaxed">
              M&amp;M Pro Construction is a full-service general contractor. We
              manage every phase of your project — from planning through
              punch list — so you have one point of contact and complete
              accountability from start to finish.
            </p>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-gold via-gold-light to-transparent mt-20" />
      </section>

      {/* Primary Services */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-20">
            {primaryServices.map((service, index) => (
              <div
                key={service.title}
                className={`grid lg:grid-cols-2 gap-12 items-start ${
                  index % 2 === 1 ? "lg:direction-rtl" : ""
                }`}
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-gold font-bold text-sm">
                      0{index + 1}
                    </span>
                    <span className="h-px flex-1 bg-gold/30" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">
                    {service.title}
                  </h2>
                  <p className="text-slate leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-3">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 bg-gold rounded-full flex-shrink-0" />
                        <span className="text-navy/80 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-cream border border-black/5 rounded-lg aspect-[4/3] flex items-center justify-center">
                  <div className="text-center text-slate/30">
                    <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs">Project photo coming soon</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 lg:py-28 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-gold font-semibold text-sm tracking-widest uppercase mb-3">
              Full Service Menu
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-navy">
              Additional Services
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalServices.map((service) => (
              <div
                key={service.title}
                className="bg-white border border-black/5 rounded-lg p-8"
              >
                <h3 className="text-lg font-bold text-navy mb-3">
                  {service.title}
                </h3>
                <p className="text-slate text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-gold font-semibold text-sm tracking-widest uppercase mb-3">
              Our Process
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-navy">
              How We Work
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Consultation",
                desc: "Same-day response. We visit your site, listen to your vision, and assess the scope.",
              },
              {
                step: "02",
                title: "Estimate",
                desc: "Detailed, transparent estimate within 24-48 hours. No surprises. No hidden fees.",
              },
              {
                step: "03",
                title: "Build",
                desc: "We manage every trade, every day. Daily communication so you always know where things stand.",
              },
              {
                step: "04",
                title: "Deliver",
                desc: "Final walkthrough, punch list, and handover. Clean site. Complete project. Happy client.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <span className="text-5xl font-bold text-gold/20">
                  {item.step}
                </span>
                <h3 className="text-lg font-bold text-navy mt-2 mb-2">
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

      {/* CTA */}
      <section className="bg-navy text-white py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Let&apos;s Scope Your Project
          </h2>
          <p className="text-white/60 text-lg mb-8">
            Every project starts with a conversation. Tell us what you&apos;re
            building, and we&apos;ll show you how we get it done.
          </p>
          <Link
            href="/contact"
            className="bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-4 rounded transition-colors inline-block"
          >
            Request a Free Estimate
          </Link>
        </div>
      </section>
    </>
  );
}
