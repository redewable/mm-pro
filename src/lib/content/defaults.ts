import type {
  SiteContent,
  Page,
  Section,
  SectionType,
  Project,
  Video,
  Testimonial,
  Service,
  Position,
} from "./types";

// Seed content. This mirrors the site exactly as it was hand-coded before the
// dashboard existed, so the very first load (before the owner has saved
// anything) looks identical to the old site.

const s = (
  id: string,
  type: SectionType,
  data: Record<string, unknown>,
  visible = true
): Section => ({ id, type, visible, data });

const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61581997151917";
const NOW = "2026-01-01T00:00:00.000Z";

const projects: Project[] = [
  {
    id: "prj_fellowship",
    slug: "fellowship-free-will-baptist-church",
    title: "Fellowship Free Will Baptist Church",
    category: "Commercial",
    status: "in-progress",
    summary:
      "Full-scope commercial project: concrete, covered walkway, commercial doors, LED lighting and ADA upgrades.",
    description:
      "Full-scope commercial project: concrete sidewalk removal and replacement, new slab work, 7-foot-wide metal covered walkway, commercial door installation, LED lighting, and ADA compliance improvements.",
    scope: [
      "Concrete removal & new slab pour",
      "Metal covered walkway (7 ft wide)",
      "Commercial door installation",
      "LED lighting throughout",
      "ADA compliance upgrades",
    ],
    cover: {
      url: "/fellowship-free-will-baptist-church.png",
      alt: "Fellowship Free Will Baptist Church exterior",
    },
    gallery: [],
    videoIds: [],
    updates: [],
    beforeAfter: [],
    location: "Brazos Valley, TX",
    completedAt: "",
    featured: true,
    published: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "prj_cabana",
    slug: "outdoor-cabana-living-space",
    title: "Outdoor Cabana & Living Space",
    category: "Outdoor Living",
    status: "completed",
    summary:
      "Custom cedar cabana with metal roof, ceiling fan and concrete pad on a rural Texas property.",
    description:
      "Custom cedar cabana with metal roof, ceiling fan installation, and concrete pad on a rural Texas property. Built for shade, durability, and year-round outdoor entertaining.",
    scope: [
      "Custom cedar timber frame structure",
      "Metal roof installation",
      "Ceiling fan & electrical",
      "Concrete pad & seating area",
    ],
    cover: {
      url: "/outdoor-cabana.webp",
      alt: "Custom outdoor cabana with cedar framing and ceiling fan",
    },
    gallery: [],
    videoIds: [],
    updates: [],
    beforeAfter: [],
    location: "Brazos County, TX",
    completedAt: "",
    featured: false,
    published: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "prj_patio",
    slug: "covered-patio-extension",
    title: "Covered Patio Extension",
    category: "Outdoor Living",
    status: "completed",
    summary:
      "Covered patio addition with cedar post-and-beam construction and metal roofing.",
    description:
      "Covered patio addition with cedar post-and-beam construction, metal roofing, integrated ceiling fan and light fixture. Extends the home's living space into the backyard.",
    scope: [
      "Cedar post-and-beam framing",
      "Metal roof tied into existing structure",
      "Ceiling fan & light installation",
      "Concrete pad extension",
    ],
    cover: {
      url: "/patio-extension.webp",
      alt: "Covered patio extension with cedar beams and ceiling fan",
    },
    gallery: [],
    videoIds: [],
    updates: [],
    beforeAfter: [],
    location: "College Station, TX",
    completedAt: "",
    featured: false,
    published: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "prj_stables",
    slug: "horse-stables-lighting",
    title: "Horse Stables & Lighting",
    category: "New Construction",
    status: "completed",
    summary:
      "Custom horse stable structure with a full LED lighting package.",
    description:
      "Custom horse stable structure with full LED lighting package. Metal frame construction with wood rail fencing and integrated storage. Photographed here at dusk showing the complete lighting design.",
    scope: [
      "Metal frame stable construction",
      "Wood rail fencing",
      "Full LED lighting package",
      "Storage integration",
    ],
    cover: {
      url: "/horse-stables.webp",
      alt: "Horse stables at dusk with LED lighting",
    },
    gallery: [],
    videoIds: [],
    updates: [],
    beforeAfter: [],
    location: "Brazos Valley, TX",
    completedAt: "",
    featured: false,
    published: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "prj_bathroom",
    slug: "bathroom-remodel",
    title: "Bathroom Remodel",
    category: "Remodeling",
    status: "completed",
    summary:
      "Complete bathroom renovation with freestanding tub, tile accent wall and custom lighting.",
    description:
      "Complete bathroom renovation featuring a freestanding soaking tub, subway tile accent wall, custom vanity lighting, and stone-look floor tile. Clean, modern design with high-end finishes.",
    scope: [
      "Freestanding tub installation",
      "Subway tile accent wall",
      "Custom vanity lighting",
      "Stone-look floor tile",
    ],
    cover: {
      url: "/bathroom-remodel.jpg",
      alt: "Modern bathroom remodel with freestanding tub and tile accent wall",
    },
    gallery: [],
    videoIds: [],
    updates: [],
    beforeAfter: [],
    location: "College Station, TX",
    completedAt: "",
    featured: false,
    published: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
];

const videos: Video[] = [];

const testimonials: Testimonial[] = [
  {
    id: "tst_debi",
    quote:
      "I had Michael put electricity in the new shed I had built. Very professional, cleaned up afterwards and reasonably priced. I'd hire him again in a minute.",
    author: "Debi Briesacher",
    project: "Electrical Installation",
    rating: 5,
    source: "Facebook",
    featured: false,
    published: true,
  },
  {
    id: "tst_angela",
    quote:
      "Anyone who's looking to have any work done from a small job to a large job like putting in a Patio Cover, give Michael Ramirez a shot, he is excellent at what he does. I am very pleased with my end result on my Patio Cover, Michael did a large cover, added on a concrete pad and built a small deck for my shed, to say that I am pleased with this work says little.",
    author: "Angela Erickson",
    project: "Patio Cover, Concrete & Deck",
    rating: 5,
    source: "Facebook",
    featured: true,
    published: true,
  },
  {
    id: "tst_nancy",
    quote:
      "Michael was very kind and professional! We have had multiple projects completed by him and will continue to call him!",
    author: "Nancy Hartman",
    project: "Multiple Projects",
    rating: 5,
    source: "Facebook",
    featured: false,
    published: true,
  },
];

const services: Service[] = [
  {
    id: "svc_commercial",
    slug: "commercial-build-outs",
    title: "Commercial Build-Outs",
    description:
      "Full-scope commercial construction from strip centers to churches. Turnkey project management — one point of contact, complete accountability.",
    features: [
      "Full-scope general contracting",
      "Subcontractor management & scheduling",
      "ADA compliance & code adherence",
      "Commercial door installation",
      "Budget management & transparent reporting",
    ],
    icon: "building",
    image: {
      url: "/fellowship-free-will-baptist-church.png",
      alt: "Fellowship Free Will Baptist Church — commercial project by M&M Pro",
    },
    primary: true,
    showOnHome: true,
    published: true,
  },
  {
    id: "svc_new",
    slug: "new-construction",
    title: "New Construction",
    description:
      "Ground-up builds managed end to end. We coordinate every trade, every timeline, and every inspection so you don't have to.",
    features: [
      "Ground-up residential & commercial builds",
      "Site prep & foundation coordination",
      "Permit & inspection management",
      "Every trade scheduled and supervised",
    ],
    icon: "home",
    primary: false,
    showOnHome: true,
    published: true,
  },
  {
    id: "svc_outdoor",
    slug: "outdoor-living-spaces",
    title: "Outdoor Living Spaces",
    description:
      "Custom pergolas, covered patios, decks, and gazebos. Designed for the Texas climate and built to be the centerpiece of your property.",
    features: [
      "Custom pergola & gazebo design",
      "Covered patios & shade structures",
      "Composite & wood decking",
      "Integrated lighting design",
      "Landscape coordination",
    ],
    icon: "sparkle",
    image: {
      url: "/outdoor-cabana.webp",
      alt: "Custom outdoor cabana with cedar framing built by M&M Pro",
    },
    primary: true,
    showOnHome: true,
    published: true,
  },
  {
    id: "svc_lighting",
    slug: "custom-lighting",
    title: "Custom Lighting",
    description:
      "Chandeliers, pendants, landscape pathway lighting, and architectural fixtures. High-impact installations that transform any space.",
    features: [
      "Chandelier & pendant installation",
      "Ceiling fixture design & mounting",
      "Landscape pathway lighting",
      "LED commercial lighting",
      "Accent & architectural lighting",
    ],
    icon: "light",
    image: {
      url: "/horse-stables.webp",
      alt: "Horse stables at dusk with full LED lighting by M&M Pro",
    },
    primary: true,
    showOnHome: true,
    published: true,
  },
  {
    id: "svc_remodel",
    slug: "remodeling-renovation",
    title: "Remodeling & Renovation",
    description:
      "Kitchen and bath remodels, interior renovations, and space transformations with commercial-grade project management.",
    features: [
      "Kitchen & bath remodels",
      "Interior renovations",
      "Complete space transformations",
    ],
    icon: "layout",
    primary: false,
    showOnHome: true,
    published: true,
  },
  {
    id: "svc_concrete",
    slug: "concrete-flatwork",
    title: "Concrete & Flatwork",
    description:
      "Sidewalks, slabs, driveways, and foundation work. Clean pours, proper grading, and finishes built to last decades.",
    features: ["Sidewalks & driveways", "Slabs & foundations", "Proper grading & drainage"],
    icon: "cube",
    primary: false,
    showOnHome: true,
    published: true,
  },
  {
    id: "svc_drywall",
    slug: "drywall-framing",
    title: "Drywall & Framing",
    description:
      "Structural framing and drywall for commercial and residential projects.",
    features: [],
    icon: "layout",
    primary: false,
    showOnHome: false,
    published: true,
  },
  {
    id: "svc_fencing",
    slug: "fencing",
    title: "Fencing",
    description:
      "Privacy, security, and decorative fencing for residential and commercial properties.",
    features: [],
    icon: "shield",
    primary: false,
    showOnHome: false,
    published: true,
  },
  {
    id: "svc_painting",
    slug: "painting",
    title: "Painting",
    description:
      "Interior and exterior painting managed through our trusted subcontractor network.",
    features: [],
    icon: "wrench",
    primary: false,
    showOnHome: false,
    published: true,
  },
  {
    id: "svc_flooring",
    slug: "flooring-tile",
    title: "Flooring & Tile",
    description:
      "Hardwood, tile, luxury vinyl, and commercial-grade flooring through vetted partners.",
    features: [],
    icon: "layout",
    primary: false,
    showOnHome: false,
    published: true,
  },
];

const positions: Position[] = [
  {
    id: "pos_experienced",
    title: "Experienced Helper",
    type: "Full-time · Brazos Valley",
    summary:
      "We're looking for hands that already know the work — someone who can read a job site, anticipate what's next, and carry their weight without being told twice. This isn't an entry-level slot.",
    responsibilities: [
      "Support lead carpenters and the foreman across commercial build-outs, new construction, remodels, concrete, and outdoor living projects.",
      "Demo, framing, blocking, set-up and tear-down, material staging, and general site cleanliness.",
      "Run small tasks independently once you've shown you can — we trust people who earn it.",
      "Keep the job site safe, organized, and presentable to clients.",
    ],
    experience: [
      "1+ year of paid construction or trades experience (residential or commercial).",
      "Comfortable with common hand and power tools.",
      "Reliable transportation to job sites across Brazos, Burleson, Grimes, and Robertson County.",
      "Able to lift 50+ lbs and work outdoors in Texas heat.",
    ],
    bonus: [
      "OSHA 10 or OSHA 30 certification.",
      "CPR / First Aid certification.",
      "Forklift, scissor lift, skid steer, or other equipment operator certifications.",
      "CDL (Class A or B).",
      "Welding experience (stick, MIG, or TIG).",
      "Framing, drywall, finish carpentry, or concrete finishing experience.",
      "Electrical, plumbing, or HVAC training or apprentice-level experience.",
    ],
    nonNegotiables: [
      "Show up on time, every day. If you can't make it, you call — early.",
      "Treat every client's home or business like it's your own.",
      "No drugs, no drama, no excuses.",
      "Do it right the first time. We don't cut corners — ever.",
      "Respect the crew. We work as a team or we don't work here.",
    ],
    published: true,
  },
  {
    id: "pos_entry",
    title: "Entry-Level Helper",
    type: "Full-time · Brazos Valley",
    summary:
      "No construction experience? That's fine — but you'd better bring the right attitude. We'll teach you the trade if you bring the work ethic. This is a real opportunity to learn from people who care about doing it right.",
    responsibilities: [
      "Assist the crew with whatever the day calls for — material handling, demo, clean-up, set-up, and general site support.",
      "Learn the tools, the techniques, and the standards by watching, asking, and doing.",
      "Keep the job site clean, organized, and safe — that's everyone's job, but especially yours starting out.",
      "Earn more responsibility as you prove you can handle it.",
    ],
    experience: [
      "No prior construction experience required.",
      "A real desire to learn a trade and build a career — not just collect a paycheck.",
      "Reliable transportation to job sites across Brazos, Burleson, Grimes, and Robertson County.",
      "Able to lift 50+ lbs and work outdoors in Texas heat.",
      "Willing to ask questions, take direction, and put in the effort.",
    ],
    bonus: [],
    nonNegotiables: [
      "Show up on time, every day. If you can't make it, you call — early.",
      "Treat every client's home or business like it's your own.",
      "No drugs, no drama, no excuses.",
      "Listen, learn, and don't pretend to know what you don't.",
      "Respect the crew. We work as a team or we don't work here.",
    ],
    published: true,
  },
];

const home: Page = {
  slug: "home",
  title: "M&M Pro Construction | General Contractor College Station TX",
  seoDescription:
    "Professional general contractor in College Station, TX. Commercial build-outs, new construction, outdoor living spaces, and custom lighting. Serving Brazos, Burleson, Grimes & Robertson County.",
  published: true,
  sections: [
    s("home_hero", "hero", {
      eyebrow: "General Contractor • College Station, TX",
      heading: "We Build It Like",
      headingAccent: "It's Ours.",
      text: "Turnkey commercial and residential construction across the Brazos Valley. One point of contact. Complete accountability. The kind of professionalism you feel from the first handshake.",
      image: {
        url: "/outdoor-cabana.webp",
        alt: "Custom outdoor cabana built by M&M Pro Construction",
      },
      primaryCta: { label: "Request a Free Estimate", href: "/contact" },
      secondaryCta: { label: "Our Services", href: "/services" },
    }),
    s("home_stats", "stats", {
      items: [
        { value: "100%", label: "Referral-Based" },
        { value: "Same Day", label: "Response Time" },
        { value: "24–48 hr", label: "Estimate Turnaround" },
        { value: "4 Counties", label: "Service Area" },
      ],
    }),
    s("home_services", "services-grid", {
      eyebrow: "What We Do",
      heading: "Full-Service General Contracting",
      text: "From commercial build-outs to custom outdoor living, we manage every trade so you have one call to make and zero gaps to worry about.",
      cta: { label: "View All Services", href: "/services" },
    }),
    s("home_featured", "featured-project", {
      eyebrow: "Featured Project",
      projectId: "prj_fellowship",
      cta: { label: "See All Projects", href: "/portfolio" },
    }),
    s("home_why", "feature-cards", {
      eyebrow: "Why M&M Pro",
      heading: "The Difference You Notice on Day One",
      text: "",
      style: "plain",
      align: "center",
      items: [
        {
          icon: "clock",
          title: "Same-Day Response",
          text: "When you reach out, we show up — the same day. Not next week, not after three follow-ups. Speed is how we earn trust before the first nail is driven.",
        },
        {
          icon: "box",
          title: "Turnkey Management",
          text: "You hire M&M and walk away until it's done. We coordinate every subcontractor, manage every inspection, and handle every detail so you don't have to.",
        },
        {
          icon: "dollar",
          title: "Transparent Pricing",
          text: "You'll know where every dollar goes before we start. Detailed estimates, no hidden fees, and daily updates that keep you informed — not guessing.",
        },
        {
          icon: "sparkle",
          title: "Spotless Jobsites",
          text: "Dirty jobs done cleanly — it's a signature trait our clients mention in every review. A clean site means respect for your property and attention to detail.",
        },
      ],
    }),
    s("home_videos", "videos-grid", {
      eyebrow: "Project Walkthroughs",
      heading: "See the Work in Motion",
      text: "On bigger projects a video shows everything a photo can't.",
      limit: 3,
      featuredOnly: false,
      cta: { label: "Watch All Videos", href: "/videos" },
    }),
    s("home_testimonial", "testimonial-spotlight", {
      testimonialId: "tst_angela",
      cta: { label: "Read More Reviews", href: "/testimonials" },
    }),
    s("home_cta", "cta", {
      heading: "Ready to Build Something That Lasts?",
      text: "Whether it's a commercial build-out or a backyard transformation, every project gets the same standard.",
      primaryCta: { label: "Get Your Free Estimate", href: "/contact" },
      showPhone: true,
      style: "dark",
    }),
  ],
};

const about: Page = {
  slug: "about",
  title: "About",
  seoDescription:
    "M&M Pro Construction is built on legacy, craftsmanship, and faith. Learn about owner Michael Ramirez and the vision behind M&M Pro in College Station, TX.",
  published: true,
  sections: [
    s("about_header", "page-header", {
      eyebrow: "Our Story",
      heading: "Built on Legacy.",
      headingAccent: "Driven by Purpose.",
      text: "M&M Pro Construction isn't just a business name — it's a generational promise. Two Michaels. One vision. A commitment to building things the right way, every single time.",
    }),
    s("about_story", "image-text", {
      eyebrow: "",
      heading: "Two Michaels. One Name.",
      body: `The "M&M" in M&M Pro Construction stands for Michael Ramirez and his grandfather — also named Michael. Growing up, they built things together. Not projects — quality. Tools in hand, side by side, with a standard that didn't bend.

When Michael felt called to start his own company, the name was never a question. M&M Pro Construction carries forward the vision of a man who believed that if you're going to build something, you build it right — and you build it to last.

Before launching M&M, Michael spent years in the field alongside some of the largest contractors in the country, including Rosendin Electric. That experience — working on large-scale commercial projects with world-class systems — gave him a blueprint for the kind of company he wanted to build: one with real culture, elite standards, and a commitment to taking care of the people who show up every day.`,
      image: { url: "/ramirez-family.jpg", alt: "Michael Ramirez with his family" },
      imageSide: "right",
      aspect: "3/4",
      bullets: [],
      cta: { label: "", href: "" },
      background: "tint",
    }),
    s("about_timeline", "timeline", {
      eyebrow: "Our Journey",
      heading: "Where We've Been. Where We're Going.",
      items: [
        {
          label: "Roots",
          text: "Raised by his grandfather — also named Michael — learning framing, electrical, concrete, and finish work. The trades weren't just skills; they were a way of life passed down through generations.",
        },
        {
          label: "Career",
          text: "Spent years in the field working alongside top-tier commercial contractors, including Rosendin Electric — one of the nation's largest electrical contractors. That experience shaped how Michael thinks about systems, safety, culture, and execution at scale.",
        },
        {
          label: "April 2025",
          text: "M&M Pro Construction officially launched in College Station, TX. From day one, every client came through referral — a track record that hasn't changed.",
        },
        {
          label: "Today",
          text: "Growing toward full commercial general contractor operations — churches, strip centers, and institutional builds — while maintaining the select residential outdoor living work that built our reputation.",
        },
        {
          label: "The Vision",
          text: "Multiple crews running simultaneously. A team of experts — superintendents, project managers, estimators. A kingdom-minded culture that people are proud to be part of, and revenue that funds the mission.",
        },
      ],
    }),
    s("about_values", "feature-cards", {
      eyebrow: "What We Stand On",
      heading: "Our Core Values",
      text: "These aren't words on a wall. They're how we show up — on every jobsite, in every conversation, and in every decision we make.",
      style: "cards",
      align: "left",
      items: [
        {
          icon: "sun",
          title: "Legacy",
          text: "Every decision we make is shaped by the generation before us and built for the generation after. M&M carries forward the vision Michael shared with his grandfather — and it's a standard we refuse to lower.",
        },
        {
          icon: "star",
          title: "Kingdom Culture",
          text: "Our faith isn't separate from our work — it's woven into every partnership, every hire, and every handshake. We build with purpose that goes beyond the bottom line.",
        },
        {
          icon: "wrench",
          title: "Craftsmanship",
          text: "Michael was trained across multiple trades by his grandfather — framing, electrical, concrete, finish work. That rare cross-discipline expertise means we catch problems others miss and deliver solutions that last.",
        },
        {
          icon: "eye",
          title: "Transparency",
          text: "Daily client communication isn't a perk — it's how we operate. You'll know where your money is going, what's happening today, and what's coming next. No surprises. Ever.",
        },
        {
          icon: "check",
          title: "Integrity",
          text: "We show up dressed professionally, on time, and ready to work. We do what we say we'll do. No exceptions. Clients notice — and they remember.",
        },
        {
          icon: "users",
          title: "Shared Success",
          text: "We believe in paying people well, rewarding great work, and treating every subcontractor like a partner. When you win, we win — and that's exactly how it should be.",
        },
      ],
    }),
    s("about_cta", "cta", {
      heading: "Let's Build Something Together",
      text: "Whether it's your first project or your fiftieth, we bring the same care, the same standard, and the same accountability.",
      primaryCta: { label: "Start a Conversation", href: "/contact" },
      showPhone: false,
      style: "light",
    }),
  ],
};

const servicesPage: Page = {
  slug: "services",
  title: "Services",
  seoDescription:
    "Full-service general contractor in College Station, TX. Commercial build-outs, new construction, outdoor living spaces, custom lighting, remodeling, concrete, and more.",
  published: true,
  sections: [
    s("services_header", "page-header", {
      eyebrow: "Our Services",
      heading: "One Contractor. Every Trade.",
      headingAccent: "Zero Gaps.",
      text: "M&M Pro Construction manages every phase of your project — from planning through punch list — so you have one point of contact and complete accountability from start to finish.",
    }),
    s("services_detail", "services-detail", {
      additionalEyebrow: "Additional Capabilities",
      additionalHeading: "Full Service Menu",
    }),
    s("services_process", "process-steps", {
      eyebrow: "Our Process",
      heading: "How We Work",
      items: [
        {
          title: "Consultation",
          text: "Same-day response. We visit your site, listen to your vision, and assess the scope.",
        },
        {
          title: "Estimate",
          text: "Detailed, transparent estimate within 24–48 hours. No surprises. No hidden fees.",
        },
        {
          title: "Build",
          text: "We manage every trade, every day. Daily communication keeps you informed throughout.",
        },
        {
          title: "Deliver",
          text: "Final walkthrough, punch list, and handover. Clean site. Complete project. Happy client.",
        },
      ],
    }),
    s("services_cta", "cta", {
      heading: "Let's Scope Your Project",
      text: "Every project starts with a conversation. Tell us what you're building.",
      primaryCta: { label: "Request a Free Estimate", href: "/contact" },
      showPhone: false,
      style: "dark",
    }),
  ],
};

const portfolio: Page = {
  slug: "portfolio",
  title: "Portfolio",
  seoDescription:
    "View M&M Pro Construction's completed projects — commercial build-outs, outdoor living spaces, custom lighting, and more across the Brazos Valley.",
  published: true,
  sections: [
    s("portfolio_header", "page-header", {
      eyebrow: "Our Work",
      heading: "Projects That Speak",
      headingAccent: "for Themselves.",
      text: "Every project is a testament to our standards — transparent management, clean execution, and results that clients are proud to show off.",
    }),
    s("portfolio_list", "projects-list", { status: "all", limit: 0, layout: "rows" }),
    s("portfolio_cta", "cta", {
      heading: "Portfolio Growing Every Week",
      text: "We're actively documenting current and upcoming projects. Check back for new showcases and project walkthroughs.",
      primaryCta: { label: "Start Your Project", href: "/contact" },
      showPhone: false,
      style: "light",
    }),
  ],
};

const videosPage: Page = {
  slug: "videos",
  title: "Project Videos",
  seoDescription:
    "Watch M&M Pro Construction project walkthroughs — full video tours of commercial build-outs, outdoor living spaces, and lighting installs across the Brazos Valley.",
  published: true,
  sections: [
    s("videos_header", "page-header", {
      eyebrow: "Project Videos",
      heading: "See Every Angle.",
      headingAccent: "Not Just the Highlights.",
      text: "On the bigger projects we film the whole thing — the site, the structure, the finish — so you can see exactly what you're getting instead of scrolling through forty photos.",
    }),
    s("videos_grid", "videos-grid", {
      eyebrow: "",
      heading: "",
      text: "",
      limit: 0,
      featuredOnly: false,
      cta: { label: "", href: "" },
    }),
    s("videos_cta", "cta", {
      heading: "Want a Walkthrough of Your Own?",
      text: "Tell us about the project and we'll come see the site — same day.",
      primaryCta: { label: "Request a Free Estimate", href: "/contact" },
      showPhone: true,
      style: "dark",
    }),
  ],
};

const testimonialsPage: Page = {
  slug: "testimonials",
  title: "Testimonials",
  seoDescription:
    "See what clients say about M&M Pro Construction — professional, clean, on time, and built right. 100% referral-based business in College Station, TX.",
  published: true,
  sections: [
    s("testimonials_header", "page-header", {
      eyebrow: "Client Reviews",
      heading: "100% Referral-Based.",
      headingAccent: "That's the Truth.",
      text: "Every client we've ever served came through a personal referral. That says more about our work than any advertisement ever could. Here's what they have to say.",
    }),
    s("testimonials_grid", "testimonials-grid", { limit: 0 }),
    s("testimonials_quote", "rich-text", {
      eyebrow: "",
      heading: "",
      body: `"You don't even have to tell your neighbor. Your neighbor sees the extravaganza and says, 'Who did that?' — 'M&M. They're the only way.'"

— Michael Ramirez, Owner, M&M Pro Construction`,
      align: "center",
    }),
    s("testimonials_cta", "cta", {
      heading: "Google Reviews Coming Soon",
      text: "We're in the process of verifying our Google Business Profile. In the meantime, find us on Facebook or reach out directly.",
      primaryCta: { label: "Get in Touch", href: "/contact" },
      showPhone: false,
      style: "light",
    }),
  ],
};

const careers: Page = {
  slug: "careers",
  title: "Careers",
  seoDescription:
    "Join the M&M Pro Construction crew. We're hiring experienced helpers in the Brazos Valley — College Station, Bryan, and surrounding counties. Apply now.",
  published: true,
  sections: [
    s("careers_header", "page-header", {
      eyebrow: "Careers",
      heading: "Build With",
      headingAccent: "a Crew That Cares.",
      text: "We're growing, and we're picky about who we grow with. If you take pride in your work, show up every day, and want to be part of something built on legacy and craftsmanship — we want to hear from you.",
    }),
    s("careers_perks", "careers-perks", {
      items: [
        {
          title: "Fair Pay, On Time",
          text: "Competitive wages, paid weekly, no waiting around to get what you've earned.",
        },
        {
          title: "Real Work, Real Variety",
          text: "Commercial build-outs, custom homes, outdoor living, lighting — you'll learn more here in a year than most places in three.",
        },
        {
          title: "Respect & Standards",
          text: "We hire adults and treat people like adults. We also hold the line on quality — that's the deal.",
        },
      ],
    }),
    s("careers_positions", "careers-positions", {
      eyebrow: "Open Positions",
      heading: "What We're Hiring For",
      applyEyebrow: "Apply Now",
      applyHeading: "Tell Us About Yourself.",
      applyText:
        "Fill out the form, attach a resume if you have one, and Michael will personally review every application. If your background looks like a fit, we'll reach out to set up a conversation.",
      applyNote:
        "No resume? No problem — tell us about your experience in the form. We've hired plenty of great people who didn't come with a polished resume.",
    }),
  ],
};

const contact: Page = {
  slug: "contact",
  title: "Contact",
  seoDescription:
    "Request a free estimate from M&M Pro Construction. Same-day response for commercial and residential projects in College Station, Bryan and the Brazos Valley.",
  published: true,
  sections: [
    s("contact_header", "page-header", {
      eyebrow: "Contact",
      heading: "Let's Talk About",
      headingAccent: "Your Project.",
      text: "Same-day response. That's not a promise we make lightly — it's how we've built our reputation.",
    }),
    s("contact_form", "contact-form", {
      serviceOptions: [
        "Commercial Build-Out",
        "New Construction",
        "Outdoor Living Space",
        "Custom Lighting",
        "Remodeling & Renovation",
        "Concrete & Flatwork",
        "Fencing",
        "Other",
      ],
      expectations: [
        "Same-day response to your inquiry",
        "On-site consultation at your convenience",
        "Detailed estimate within 24–48 hours",
        "Transparent pricing — no hidden fees",
        "Daily communication throughout your project",
      ],
      successMessage:
        "Message received! Michael will get back to you within 24 hours.",
    }),
    s("contact_faq", "faq", {
      eyebrow: "FAQ",
      heading: "Common Questions",
      useGlobal: true,
      items: [],
    }),
  ],
};

export const DEFAULT_CONTENT: SiteContent = {
  version: 1,
  updatedAt: NOW,
  business: {
    name: "M&M Pro Construction",
    legalName: "M&M Pro Construction",
    tagline: "We Build It Like It's Ours.",
    phone: "(979) 587-3639",
    phoneE164: "+19795873639",
    email: "mram@mmproconstruction.com",
    founderName: "Michael Ramirez",
    founderTitle: "Owner",
    addressLine: "",
    city: "College Station",
    region: "TX",
    postalCode: "",
    country: "US",
    latitude: 30.6280,
    longitude: -96.3344,
    serviceAreas: [
      "Brazos County, TX",
      "Burleson County, TX",
      "Grimes County, TX",
      "Robertson County, TX",
    ],
    serviceAreaSummary: "Serving Brazos, Burleson, Grimes & Robertson County",
    hours: "Mon–Sat 7:00 AM – 6:00 PM",
    license: "Licensed General Contractor",
    licenseIssuer: "City of College Station",
    foundedYear: "2025",
    priceRange: "$$",
    footerQuote: "God said, let there be light — we showed up.",
    footerBlurb:
      "Professional general contractor serving College Station, Bryan, and the Brazos Valley. Commercial build-outs, outdoor living spaces, and custom lighting.",
    socials: [{ id: "soc_fb", platform: "Facebook", url: FACEBOOK_URL }],
    formRecipient: "mram@mmprocon.com",
  },
  seo: {
    siteUrl: "https://www.mmprocon.com",
    defaultTitle: "M&M Pro Construction | General Contractor College Station TX",
    titleTemplate: "%s | M&M Pro Construction",
    description:
      "Professional general contractor in College Station, TX. Commercial build-outs, new construction, outdoor living spaces, and custom lighting. Serving Brazos, Burleson, Grimes & Robertson County.",
    keywords: [
      "general contractor College Station TX",
      "commercial contractor Bryan TX",
      "outdoor living contractor Brazos County",
      "general contractor Robertson County TX",
      "custom pergola builder College Station",
      "remodeling contractor College Station",
      "commercial build-out Bryan College Station",
    ],
    twitterHandle: "",
    googleSiteVerification: "",
    bingSiteVerification: "",
    faq: [
      {
        id: "faq_area",
        question: "What areas does M&M Pro Construction serve?",
        answer:
          "We serve College Station, Bryan and the surrounding Brazos Valley, including Brazos, Burleson, Grimes and Robertson County — roughly a 30-mile radius from College Station.",
      },
      {
        id: "faq_estimate",
        question: "How fast can I get an estimate?",
        answer:
          "We respond the same day you reach out and typically deliver a detailed, transparent estimate within 24–48 hours of the site visit.",
      },
      {
        id: "faq_types",
        question: "Do you take on both commercial and residential work?",
        answer:
          "Yes. We handle commercial build-outs, churches and institutional projects as well as residential outdoor living spaces, remodels, lighting and concrete.",
      },
      {
        id: "faq_licensed",
        question: "Are you licensed?",
        answer:
          "M&M Pro Construction is a licensed general contractor with the City of College Station.",
      },
    ],
    allowAiCrawlers: true,
    llmsSummary:
      "M&M Pro Construction is a licensed general contractor based in College Station, Texas, owned by Michael Ramirez. The company delivers turnkey commercial build-outs, new construction, outdoor living spaces (pergolas, covered patios, cabanas), custom lighting, remodeling and concrete work across Brazos, Burleson, Grimes and Robertson County. Known for same-day response, transparent pricing and spotless jobsites. 100% referral-based.",
    llmsExtra: "",
  },
  tracking: {
    ga4MeasurementId: "",
    gtmContainerId: "",
    googleAdsId: "",
    googleAdsFormConversionLabel: "",
    googleAdsPhoneConversionLabel: "",
    metaPixelId: "",
    microsoftClarityId: "",
    enabledInDev: false,
  },
  nav: [
    { id: "nav_home", label: "Home", href: "/", visible: true, location: "header" },
    { id: "nav_about", label: "About", href: "/about", visible: true, location: "both" },
    { id: "nav_services", label: "Services", href: "/services", visible: true, location: "both" },
    { id: "nav_portfolio", label: "Portfolio", href: "/portfolio", visible: true, location: "both" },
    { id: "nav_videos", label: "Videos", href: "/videos", visible: true, location: "both" },
    { id: "nav_testimonials", label: "Testimonials", href: "/testimonials", visible: true, location: "both" },
    { id: "nav_careers", label: "Careers", href: "/careers", visible: true, location: "both" },
    { id: "nav_contact", label: "Contact", href: "/contact", visible: true, location: "both" },
  ],
  pages: {
    home,
    about,
    services: servicesPage,
    portfolio,
    videos: videosPage,
    testimonials: testimonialsPage,
    careers,
    contact,
  },
  projects,
  videos,
  testimonials,
  services,
  positions,
  media: [
    { id: "med_cabana", url: "/outdoor-cabana.webp", kind: "image", name: "outdoor-cabana.webp", mime: "image/webp", size: 0, alt: "Custom outdoor cabana", createdAt: NOW },
    { id: "med_church", url: "/fellowship-free-will-baptist-church.png", kind: "image", name: "fellowship-free-will-baptist-church.png", mime: "image/png", size: 0, alt: "Fellowship Free Will Baptist Church", createdAt: NOW },
    { id: "med_stables", url: "/horse-stables.webp", kind: "image", name: "horse-stables.webp", mime: "image/webp", size: 0, alt: "Horse stables at dusk", createdAt: NOW },
    { id: "med_patio", url: "/patio-extension.webp", kind: "image", name: "patio-extension.webp", mime: "image/webp", size: 0, alt: "Covered patio extension", createdAt: NOW },
    { id: "med_bath", url: "/bathroom-remodel.jpg", kind: "image", name: "bathroom-remodel.jpg", mime: "image/jpeg", size: 0, alt: "Bathroom remodel", createdAt: NOW },
    { id: "med_family", url: "/ramirez-family.jpg", kind: "image", name: "ramirez-family.jpg", mime: "image/jpeg", size: 0, alt: "Michael Ramirez with his family", createdAt: NOW },
    { id: "med_logo", url: "/mm-pro-logo.png", kind: "image", name: "mm-pro-logo.png", mime: "image/png", size: 0, alt: "M&M Pro Construction logo", createdAt: NOW },
  ],
  auth: { passwordHash: "", passwordSalt: "" },
};

export const PAGE_ORDER = [
  "home",
  "about",
  "services",
  "portfolio",
  "videos",
  "testimonials",
  "careers",
  "contact",
] as const;

export const PAGE_PATHS: Record<string, string> = {
  home: "/",
  about: "/about",
  services: "/services",
  portfolio: "/portfolio",
  videos: "/videos",
  testimonials: "/testimonials",
  careers: "/careers",
  contact: "/contact",
};
