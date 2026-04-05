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
      <section className="bg-navy text-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <p className="text-gold font-semibold text-sm tracking-widest uppercase mb-4">
              Get in Touch
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Let&apos;s Talk About Your Project
            </h1>
            <p className="text-white/70 text-lg leading-relaxed">
              Same-day response. That&apos;s not a promise we make lightly —
              it&apos;s how we&apos;ve built our reputation. Fill out the form
              below or call us directly.
            </p>
          </div>
        </div>
        <div className="h-1 bg-gradient-to-r from-gold via-gold-light to-transparent mt-20" />
      </section>

      {/* Contact Content */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-16">
            {/* Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-12 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-navy mb-2">
                    Message Received
                  </h2>
                  <p className="text-slate">
                    Thank you for reaching out. Michael will get back to you
                    within 24 hours — often the same day.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-semibold text-navy mb-2"
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full border border-black/10 rounded-lg px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-semibold text-navy mb-2"
                      >
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full border border-black/10 rounded-lg px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                        placeholder="(979) 000-0000"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-navy mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full border border-black/10 rounded-lg px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="service"
                      className="block text-sm font-semibold text-navy mb-2"
                    >
                      Service Interested In
                    </label>
                    <select
                      id="service"
                      value={formData.service}
                      onChange={(e) =>
                        setFormData({ ...formData, service: e.target.value })
                      }
                      className="w-full border border-black/10 rounded-lg px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold bg-white"
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
                      className="block text-sm font-semibold text-navy mb-2"
                    >
                      Tell Us About Your Project *
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full border border-black/10 rounded-lg px-4 py-3 text-navy focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold resize-none"
                      placeholder="What are you looking to build? Include any details about scope, timeline, or budget range."
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-4 rounded transition-colors w-full md:w-auto"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info Sidebar */}
            <div className="lg:col-span-2">
              <div className="bg-navy text-white rounded-lg p-8 mb-8">
                <h2 className="text-xl font-bold mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wide mb-1">
                      Phone
                    </p>
                    <a
                      href="tel:9795873639"
                      className="text-gold text-lg font-semibold hover:text-gold-light transition-colors"
                    >
                      (979) 587-3639
                    </a>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wide mb-1">
                      Location
                    </p>
                    <p className="text-white/80">College Station, TX</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wide mb-1">
                      Service Area
                    </p>
                    <p className="text-white/80">
                      Brazos, Burleson &amp; Grimes County
                    </p>
                    <p className="text-white/50 text-sm mt-1">
                      ~30-mile radius from College Station
                    </p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-wide mb-1">
                      License
                    </p>
                    <p className="text-white/80">
                      General Contractor — City of College Station
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-cream border border-black/5 rounded-lg p-8">
                <h3 className="font-bold text-navy mb-3">
                  What to Expect
                </h3>
                <ul className="space-y-3">
                  {[
                    "Same-day response to your inquiry",
                    "On-site consultation at your convenience",
                    "Detailed estimate within 24-48 hours",
                    "Transparent pricing — no hidden fees",
                    "Daily communication throughout your project",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-gold flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-navy/70 text-sm">{item}</span>
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
