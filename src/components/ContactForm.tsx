"use client";

import { useState, type FormEvent } from "react";
import { sendToFormSubmit } from "@/lib/formsubmit";
import { trackConversion } from "@/lib/tracking";
import PhoneLink from "./PhoneLink";

export interface ContactFormProps {
  serviceOptions: string[];
  expectations: string[];
  successMessage: string;
  recipient: string;
  phone: string;
  telHref: string;
  city: string;
  region: string;
  serviceAreaSummary: string;
  license: string;
  licenseIssuer: string;
}

const inputClass =
  "w-full border border-border bg-white dark:bg-navy-light rounded-lg px-4 py-3 text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors";

export default function ContactForm(props: ContactFormProps) {
  const [state, setState] = useState({ success: false, message: "" });
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = ((data.get("name") as string) || "").trim();
    const phone = ((data.get("phone") as string) || "").trim();
    const email = ((data.get("email") as string) || "").trim();
    const service = ((data.get("service") as string) || "").trim();
    const message = ((data.get("message") as string) || "").trim();
    // Honeypot
    if ((data.get("company") as string)?.length) return;

    if (!name || !phone || !message) {
      setState({ success: false, message: "Please fill in all required fields." });
      return;
    }

    const payload = new FormData();
    payload.append("Name", name);
    payload.append("Phone", phone);
    payload.append("Email", email || "Not provided");
    payload.append("Service", service || "Not specified");
    payload.append("Message", message);
    payload.append("_subject", `New Lead: ${name} — ${service || "General Inquiry"}`);
    payload.append("_template", "table");
    payload.append("_captcha", "false");
    if (email) payload.append("_replyto", email);

    setPending(true);
    const result = await sendToFormSubmit(
      payload,
      `Something went wrong. Please call us at ${props.phone}.`,
      props.recipient
    );
    setPending(false);

    if (result.success) {
      trackConversion("form", { service: service || "unspecified" });
      setState({ success: true, message: props.successMessage });
    } else {
      setState(result);
    }
  }

  return (
    <section className="border-t border-border pb-20 lg:pb-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 pt-14 lg:pt-20">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16">
          <div className="lg:col-span-3">
            {state.success ? (
              <div
                className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-8 sm:p-12 text-center"
                role="status"
                aria-live="polite"
              >
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-navy dark:text-white mb-2">Message Received</h2>
                <p className="text-slate">{state.message}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {state.message && !state.success && (
                  <div
                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400 text-sm"
                    role="alert"
                  >
                    {state.message}
                  </div>
                )}
                <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-navy dark:text-white mb-2">
                      Full Name <span className="text-gold">*</span>
                    </label>
                    <input type="text" id="name" name="name" required autoComplete="name" className={inputClass} placeholder="Your name" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-navy dark:text-white mb-2">
                      Phone <span className="text-gold">*</span>
                    </label>
                    <input type="tel" id="phone" name="phone" required autoComplete="tel" className={inputClass} placeholder="(979) 000-0000" />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-navy dark:text-white mb-2">
                    Email
                  </label>
                  <input type="email" id="email" name="email" autoComplete="email" className={inputClass} placeholder="your@email.com" />
                </div>
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-navy dark:text-white mb-2">
                    Service Interested In
                  </label>
                  <select id="service" name="service" className={inputClass}>
                    <option value="">Select a service</option>
                    {props.serviceOptions.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-navy dark:text-white mb-2">
                    Project Details <span className="text-gold">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className={`${inputClass} resize-none`}
                    placeholder="Tell us about your project — scope, timeline, budget range."
                  />
                </div>
                <button
                  type="submit"
                  disabled={pending}
                  className="bg-navy dark:bg-gold text-white dark:text-navy font-semibold px-8 py-4 rounded transition-colors hover:bg-navy-light dark:hover:bg-gold-light w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {pending ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-warm-gray dark:bg-navy-light border border-border rounded-lg p-6 sm:p-8">
              <h2 className="text-lg font-bold text-navy dark:text-white mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-slate uppercase tracking-widest mb-1">Phone</p>
                  <PhoneLink href={props.telHref} className="text-navy dark:text-gold text-lg font-semibold hover:text-gold transition-colors">
                    {props.phone}
                  </PhoneLink>
                </div>
                <div>
                  <p className="text-xs text-slate uppercase tracking-widest mb-1">Location</p>
                  <p className="text-navy/80 dark:text-white/70">
                    {props.city}, {props.region}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate uppercase tracking-widest mb-1">Service Area</p>
                  <p className="text-navy/80 dark:text-white/70">{props.serviceAreaSummary.replace(/^Serving\s+/i, "")}</p>
                </div>
                {props.license && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-slate uppercase tracking-widest mb-1">License</p>
                    <p className="text-navy/80 dark:text-white/70 text-sm">
                      {props.license}
                      {props.licenseIssuer ? ` — ${props.licenseIssuer}` : ""}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {props.expectations.length > 0 && (
              <div className="border border-border rounded-lg p-6 sm:p-8">
                <h3 className="font-bold text-navy dark:text-white mb-4 text-sm">What to Expect</h3>
                <ul className="space-y-3">
                  {props.expectations.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <svg className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-navy/70 dark:text-white/60 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
