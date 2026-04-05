import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "View M&M Pro Construction's completed projects — commercial build-outs, outdoor living spaces, custom lighting, and more across the Brazos Valley.",
};

const projects = [
  {
    title: "Free Wheel Fellowship Baptist Church",
    category: "Commercial",
    description:
      "Full-scope commercial project: concrete sidewalk removal and replacement, new slab work, 7-foot-wide metal covered walkway, commercial door installation, LED lighting, and ADA compliance improvements.",
    scope: [
      "Concrete removal & new slab pour",
      "Metal covered walkway (7 ft wide)",
      "Commercial door installation",
      "LED lighting throughout",
      "ADA compliance upgrades",
    ],
    status: "In Progress",
  },
  {
    title: "Residential Outdoor Living",
    category: "Outdoor Living",
    description:
      "Custom pergola and covered patio with integrated landscape lighting. Designed to maximize shade and usability in the Texas heat while creating a resort-style backyard experience.",
    scope: [
      "Custom pergola design & build",
      "Covered patio structure",
      "Landscape pathway lighting",
      "Decorative pendant fixtures",
    ],
    status: "Completed",
  },
  {
    title: "Custom Lighting Installation",
    category: "Custom Lighting",
    description:
      "Full decorative lighting package including chandelier installation, pendant fixtures, and architectural accent lighting for a high-end residential client.",
    scope: [
      "Chandelier selection & installation",
      "Pendant fixture mounting",
      "Accent lighting design",
      "Dimmer & controls setup",
    ],
    status: "Completed",
  },
];

export default function PortfolioPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy text-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <p className="text-gold font-semibold text-sm tracking-widest uppercase mb-4">
              Our Work
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Projects That Speak for Themselves
            </h1>
            <p className="text-white/70 text-lg leading-relaxed">
              Every project is a testament to our standards — transparent
              management, clean execution, and results that clients are proud to
              show off. Here&apos;s a look at what we&apos;ve been building.
            </p>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-gold via-gold-light to-transparent mt-20" />
      </section>

      {/* Projects */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-16">
            {projects.map((project, index) => (
              <div
                key={project.title}
                className="grid lg:grid-cols-2 gap-12 items-start"
              >
                {/* Image placeholder */}
                <div
                  className={`bg-cream border border-black/5 rounded-lg aspect-[4/3] flex items-center justify-center ${
                    index % 2 === 1 ? "lg:order-2" : ""
                  }`}
                >
                  <div className="text-center text-slate/30">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">Before / After photos coming soon</p>
                  </div>
                </div>

                {/* Details */}
                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-gold/10 text-gold text-xs font-semibold px-3 py-1 rounded-full">
                      {project.category}
                    </span>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        project.status === "In Progress"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-green-50 text-green-600"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">
                    {project.title}
                  </h2>
                  <p className="text-slate leading-relaxed mb-6">
                    {project.description}
                  </p>
                  <h3 className="text-sm font-semibold text-navy uppercase tracking-wide mb-3">
                    Project Scope
                  </h3>
                  <ul className="space-y-2">
                    {project.scope.map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 bg-gold rounded-full flex-shrink-0" />
                        <span className="text-navy/70 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Growing */}
      <section className="bg-cream py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="bg-white border border-black/5 rounded-lg p-12">
            <p className="text-gold font-semibold text-sm tracking-widest uppercase mb-3">
              Growing Every Day
            </p>
            <h2 className="text-2xl font-bold text-navy mb-4">
              More Projects on the Way
            </h2>
            <p className="text-slate leading-relaxed mb-6">
              We&apos;re actively documenting current projects with
              professional photography and video. Check back regularly to see
              new before-and-after showcases, client stories, and project
              walkthroughs.
            </p>
            <Link
              href="/contact"
              className="bg-gold hover:bg-gold-light text-navy font-semibold px-6 py-3 rounded transition-colors inline-block"
            >
              Start Your Project
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
