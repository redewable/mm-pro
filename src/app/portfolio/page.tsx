import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "View M&M Pro Construction's completed projects — commercial build-outs, outdoor living spaces, custom lighting, and more across the Brazos Valley.",
};

const projects = [
  {
    title: "Fellowship Free Will Baptist Church",
    category: "Commercial",
    image: "/fellowship-free-will-baptist-church.png",
    imageAlt: "Fellowship Free Will Baptist Church exterior",
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
    title: "Outdoor Cabana & Living Space",
    category: "Outdoor Living",
    image: "/outdoor-cabana.webp",
    imageAlt: "Custom outdoor cabana with cedar framing and ceiling fan",
    description:
      "Custom cedar cabana with metal roof, ceiling fan installation, and concrete pad on a rural Texas property. Built for shade, durability, and year-round outdoor entertaining.",
    scope: [
      "Custom cedar timber frame structure",
      "Metal roof installation",
      "Ceiling fan & electrical",
      "Concrete pad & seating area",
    ],
    status: "Completed",
  },
  {
    title: "Covered Patio Extension",
    category: "Outdoor Living",
    image: "/patio-extension.webp",
    imageAlt: "Covered patio extension with cedar beams and ceiling fan",
    description:
      "Covered patio addition with cedar post-and-beam construction, metal roofing, integrated ceiling fan and light fixture. Extends the home's living space into the backyard.",
    scope: [
      "Cedar post-and-beam framing",
      "Metal roof tied into existing structure",
      "Ceiling fan & light installation",
      "Concrete pad extension",
    ],
    status: "Completed",
  },
  {
    title: "Horse Stables & Lighting",
    category: "New Construction",
    image: "/horse-stables.webp",
    imageAlt: "Horse stables at dusk with LED lighting",
    description:
      "Custom horse stable structure with full LED lighting package. Metal frame construction with wood rail fencing and integrated storage. Photographed here at dusk showing the complete lighting design.",
    scope: [
      "Metal frame stable construction",
      "Wood rail fencing",
      "Full LED lighting package",
      "Storage integration",
    ],
    status: "Completed",
  },
  {
    title: "Bathroom Remodel",
    category: "Remodeling",
    image: "/bathroom-remodel.jpg",
    imageAlt: "Modern bathroom remodel with freestanding tub and tile accent wall",
    description:
      "Complete bathroom renovation featuring a freestanding soaking tub, subway tile accent wall, custom vanity lighting, and stone-look floor tile. Clean, modern design with high-end finishes.",
    scope: [
      "Freestanding tub installation",
      "Subway tile accent wall",
      "Custom vanity lighting",
      "Stone-look floor tile",
    ],
    status: "Completed",
  },
];

export default function PortfolioPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 lg:py-28">
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
              className={`grid lg:grid-cols-2 gap-16 items-center py-20 ${
                index < projects.length - 1 ? "border-b border-border" : ""
              }`}
            >
              {/* Image */}
              <div
                className={`relative rounded-lg overflow-hidden aspect-[4/3] ${
                  index % 2 === 1 ? "lg:order-2" : ""
                }`}
              >
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  fill
                  className="object-cover object-center"
                />
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
      <section className="bg-warm-gray dark:bg-navy-light border-t border-border py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-navy dark:text-white tracking-tight mb-4">
            Portfolio Growing Every Week
          </h2>
          <p className="text-slate leading-relaxed mb-8">
            We&apos;re actively documenting current and upcoming projects.
            Check back for new showcases and project walkthroughs.
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
