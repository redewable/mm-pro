"use client";

import { useState, type FormEvent } from "react";

const serviceOptions = [
  "Commercial Build-Out",
  "New Construction",
  "Outdoor Living Space",
  "Custom Lighting",
  "Remodeling & Renovation",
  "Concrete & Flatwork",
  "Fencing",
  "Other",
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: Connect to email service once DNS/MX is fixed
    setSubmitted(true);
  };

  return (
    <>
      {/* Hero */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-12 bg-gold" />
              <span className="text-gold font-semibold text-sm tracking-widest uppercase">
                Contact
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-navy dark:text-white tracking-tight mb-6">
              Let&apos;s Talk About{" "}
              <span className="text-gold">Your Project.</span>
            </h1>
            <p className="text-slate text-lg leading-relaxed">
              Same-day response. That&apos;s not a promise we make lightly —
              it&apos;s how we&apos;ve built our reputation.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="border-t border-border pb-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-6 pt-24">
          <div className="grid lg:grid-cols-5 gap-16">
            {/* Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-12 text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-navy dark:text-white mb-2">
                    Message Received
                  </h2>
                  <p className="text-slate">
                    Michael will get back to you within 24 hours — often the
                    same day.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-navy dark:text-white mb-2"
                      >
                        Full Name <span className="text-gold">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full border border-border bg-white dark:bg-navy-light rounded-lg px-4 py-3 text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-navy dark:text-white mb-2"
                      >
                        Phone <span className="text-gold">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full border border-border bg-white dark:bg-navy-light rounded-lg px-4 py-3 text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors"
                        placeholder="(979) 000-0000"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-navy dark:text-white mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full border border-border bg-white dark:bg-navy-light rounded-lg px-4 py-3 text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="service"
                      className="block text-sm font-medium text-navy dark:text-white mb-2"
                    >
                      Service Interested In
                    </label>
                    <select
                      id="service"
                      value={formData.service}
                      onChange={(e) =>
                        setFormData({ ...formData, service: e.target.value })
                      }
                      className="w-full border border-border bg-white dark:bg-navy-light rounded-lg px-4 py-3 text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors"
                    >
                      <option value="">Select a service</option>
                      {serviceOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-navy dark:text-white mb-2"
                    >
                      Project Details <span className="text-gold">*</span>
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full border border-border bg-white dark:bg-navy-light rounded-lg px-4 py-3 text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold resize-none transition-colors"
                      placeholder="Tell us about your project — scope, timeline, budget range."
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-navy dark:bg-gold text-white dark:text-navy font-semibold px-8 py-4 rounded transition-colors hover:bg-navy-light dark:hover:bg-gold-light w-full md:w-auto"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-warm-gray dark:bg-navy-light border border-border rounded-lg p-8">
                <h2 className="text-lg font-bold text-navy dark:text-white mb-6">
                  Contact Information
                </h2>
                <div className="space-y-6">
                  <div>
                    <p className="text-xs text-slate uppercase tracking-widest mb-1">
                      Phone
                    </p>
                    <a
                      href="tel:9795873639"
                      className="text-navy dark:text-gold text-lg font-semibold hover:text-gold transition-colors"
                    >
                      (979) 587-3639
                    </a>
                  </div>
                  <div>
                    <p className="text-xs text-slate uppercase tracking-widest mb-1">
                      Location
                    </p>
                    <p className="text-navy/80 dark:text-white/70">College Station, TX</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate uppercase tracking-widest mb-1">
                      Service Area
                    </p>
                    <p className="text-navy/80 dark:text-white/70">
                      Brazos, Burleson &amp; Grimes County
                    </p>
                    <p className="text-slate text-sm mt-1">
                      ~30-mile radius from College Station
                    </p>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-slate uppercase tracking-widest mb-1">
                      License
                    </p>
                    <p className="text-navy/80 dark:text-white/70 text-sm">
                      General Contractor &mdash; City of College Station
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-border rounded-lg p-8">
                <h3 className="font-bold text-navy dark:text-white mb-4 text-sm">
                  What to Expect
                </h3>
                <ul className="space-y-3">
                  {[
                    "Same-day response to your inquiry",
                    "On-site consultation at your convenience",
                    "Detailed estimate within 24\u201348 hours",
                    "Transparent pricing \u2014 no hidden fees",
                    "Daily communication throughout your project",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <svg
                        className="w-4 h-4 text-gold flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-navy/70 dark:text-white/60 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
