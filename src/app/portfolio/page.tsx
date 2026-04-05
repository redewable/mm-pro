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
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-12 bg-gold" />
              <span className="text-gold font-semibold text-sm tracking-widest uppercase">
                Our Work
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-navy dark:text-white tracking-tight mb-6">
              Projects That Speak{" "}
              <span className="text-gold">for Themselves.</span>
            </h1>
            <p className="text-slate text-lg leading-relaxed">
              Every project is a testament to our standards — transparent
              management, clean execution, and results that clients are proud to
              show off.
            </p>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className={`grid lg:grid-cols-2 gap-16 items-center py-24 ${
                index < projects.length - 1 ? "border-b border-border" : ""
              }`}
            >
              {/* Image placeholder */}
              <div
                className={`bg-warm-gray dark:bg-navy-light border border-border rounded-lg aspect-[4/3] flex items-center justify-center ${
                  index % 2 === 1 ? "lg:order-2" : ""
                }`}
              >
                <div className="text-center text-slate/30">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm">Before / After coming soon</p>
                </div>
              </div>

              {/* Details */}
              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-semibold text-gold bg-gold/10 px-3 py-1 rounded-full">
                    {project.category}
                  </span>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      project.status === "In Progress"
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-navy dark:text-white tracking-tight mb-4">
                  {project.title}
                </h2>
                <p className="text-slate leading-relaxed mb-8">
                  {project.description}
                </p>
                <div>
                  <p className="text-xs font-semibold text-navy/40 dark:text-white/30 uppercase tracking-widest mb-3">
                    Project Scope
                  </p>
                  <ul className="space-y-2">
                    {project.scope.map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 bg-gold rounded-full flex-shrink-0" />
                        <span className="text-navy/70 dark:text-white/60 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* More Coming */}
      <section className="bg-warm-gray dark:bg-navy-light border-t border-border py-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-navy dark:text-white tracking-tight mb-4">
            Portfolio Growing Every Week
          </h2>
          <p className="text-slate leading-relaxed mb-8">
            We&apos;re actively documenting current projects with professional
            photography. Check back for new before-and-after showcases, client
            stories, and project walkthroughs.
          </p>
          <Link
            href="/contact"
            className="bg-navy dark:bg-gold text-white dark:text-navy font-semibold px-8 py-4 rounded transition-colors hover:bg-navy-light dark:hover:bg-gold-light inline-block"
          >
            Start Your Project
          </Link>
        </div>
      </section>
    </>
  );
}
