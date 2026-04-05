import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "See what clients say about M&M Pro Construction — professional, clean, on time, and built right. 100% referral-based business in College Station, TX.",
};

const testimonials = [
  {
    quote:
      "Michael showed up the same day I called. That's never happened with any contractor. The work was flawless and the site was cleaner when he left than when he started.",
    author: "Residential Client",
    location: "College Station, TX",
    project: "Outdoor Living Space",
  },
  {
    quote:
      "We needed someone we could trust with our church renovation. Michael brought professionalism, transparency, and a genuine care for getting it right. He communicates every single day.",
    author: "Church Board Member",
    location: "Brazos County, TX",
    project: "Commercial Renovation",
  },
  {
    quote:
      "The custom lighting completely transformed our home. The attention to detail was incredible — from the fixture selection to the final placement. Our neighbors keep asking who did it.",
    author: "Homeowner",
    location: "College Station, TX",
    project: "Custom Lighting",
  },
  {
    quote:
      "What stood out was the communication. We always knew where our money was going and what was happening next. No surprises. No runaround. That's rare in this industry.",
    author: "Property Owner",
    location: "Bryan, TX",
    project: "Remodeling",
  },
  {
    quote:
      "I've hired a lot of contractors over the years. Michael is the first one who showed up dressed professionally, on time, every single day. The work quality matched the presentation.",
    author: "Repeat Client",
    location: "College Station, TX",
    project: "Multiple Projects",
  },
  {
    quote:
      "Our covered patio is the centerpiece of our backyard now. The neighbors came over, saw it, and hired M&M the next week. That says everything.",
    author: "Homeowner",
    location: "Brazos County, TX",
    project: "Covered Patio & Pergola",
  },
];

export default function TestimonialsPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-12 bg-gold" />
              <span className="text-gold font-semibold text-sm tracking-widest uppercase">
                Client Reviews
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-navy dark:text-white tracking-tight mb-6">
              100% Referral-Based.{" "}
              <span className="text-gold">That&apos;s the Truth.</span>
            </h1>
            <p className="text-slate text-lg leading-relaxed">
              Every client we&apos;ve ever served came through a personal
              referral. That says more about our work than any advertisement ever
              could.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="border-t border-border pb-24">
        <div className="max-w-7xl mx-auto px-6 pt-24">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-navy-light border border-border rounded-lg p-8 hover-lift"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-gold"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-navy/80 dark:text-white/70 leading-relaxed mb-6 text-sm">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                <div className="border-t border-border pt-4">
                  <p className="font-semibold text-navy dark:text-white text-sm">
                    {testimonial.author}
                  </p>
                  <p className="text-slate text-xs mt-0.5">
                    {testimonial.location} &bull; {testimonial.project}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pull Quote */}
      <section className="bg-navy text-white py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <svg className="w-10 h-10 text-gold/20 mx-auto mb-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <p className="text-2xl md:text-3xl font-bold leading-relaxed mb-8">
            You don&apos;t even have to tell your neighbor. Your neighbor sees
            the extravaganza and says, &lsquo;Who did that?&rsquo; &mdash;
            &lsquo;M&amp;M. They&apos;re the only way.&rsquo;
          </p>
          <div>
            <p className="text-gold font-semibold">Michael Ramirez</p>
            <p className="text-white/40 text-sm">Owner, M&amp;M Pro Construction</p>
          </div>
        </div>
      </section>

      {/* Google Reviews CTA */}
      <section className="py-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-navy dark:text-white tracking-tight mb-4">
            Google Reviews Coming Soon
          </h2>
          <p className="text-slate leading-relaxed mb-8">
            We&apos;re in the process of verifying our Google Business Profile.
            In the meantime, we&apos;d love to hear from you directly.
          </p>
          <Link
            href="/contact"
            className="bg-navy dark:bg-gold text-white dark:text-navy font-semibold px-8 py-4 rounded transition-colors hover:bg-navy-light dark:hover:bg-gold-light inline-block"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  );
}
