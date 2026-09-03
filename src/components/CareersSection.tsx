"use client";

import { useState, type FormEvent } from "react";
import { sendToFormSubmit } from "@/lib/formsubmit";
import { trackConversion } from "@/lib/tracking";
import type { Position } from "@/lib/content/types";

interface Props {
  positions: Position[];
  eyebrow: string;
  heading: string;
  applyEyebrow: string;
  applyHeading: string;
  applyText: string;
  applyNote: string;
  recipient: string;
  phone: string;
}

const RESUME_MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const RESUME_ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const RESUME_ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];

const inputClass =
  "w-full border border-border bg-white dark:bg-navy rounded-lg px-4 py-3 text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors";

function Bullets({ items, muted = true }: { items: string[]; muted?: boolean }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item}
          className={`flex items-start gap-3 text-sm ${
            muted ? "text-navy/70 dark:text-white/60" : "text-navy/80 dark:text-white/70"
          }`}
        >
          <span className="text-gold mt-1.5 leading-none" aria-hidden="true">
            •
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function CareersSection(props: Props) {
  const positions = props.positions.filter((p) => p.published);
  const [state, setState] = useState({ success: false, message: "" });
  const [pending, setPending] = useState(false);
  const [openId, setOpenId] = useState<string | null>(positions[0]?.id ?? null);
  const [selectedPosition, setSelectedPosition] = useState<string>(positions[0]?.title ?? "");
  const [resumeName, setResumeName] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = ((data.get("name") as string) || "").trim();
    const email = ((data.get("email") as string) || "").trim();
    const phone = ((data.get("phone") as string) || "").trim();
    const position = ((data.get("position") as string) || "").trim();
    const experience = ((data.get("experience") as string) || "").trim();
    const message = ((data.get("message") as string) || "").trim();
    const resume = data.get("resume");

    if (!name || !phone || !position || !experience) {
      setState({
        success: false,
        message: "Please fill in your name, phone, position, and a quick note about your experience.",
      });
      return;
    }

    let resumeFile: File | null = null;
    if (resume instanceof File && resume.size > 0) {
      if (resume.size > RESUME_MAX_BYTES) {
        setState({ success: false, message: "Resume must be 5 MB or smaller." });
        return;
      }
      const lowerName = resume.name.toLowerCase();
      const extensionOk = RESUME_ALLOWED_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
      const typeOk = resume.type ? RESUME_ALLOWED_TYPES.has(resume.type) : false;
      if (!extensionOk && !typeOk) {
        setState({ success: false, message: "Resume must be a PDF, DOC, or DOCX file." });
        return;
      }
      resumeFile = resume;
    }

    const payload = new FormData();
    payload.append("Position", position);
    payload.append("Name", name);
    payload.append("Phone", phone);
    payload.append("Email", email || "Not provided");
    payload.append("Experience", experience);
    payload.append("Notes", message || "(none)");
    payload.append("_subject", `New Application: ${name} — ${position}`);
    payload.append("_template", "table");
    payload.append("_captcha", "false");
    if (email) payload.append("_replyto", email);
    if (resumeFile) payload.append("attachment", resumeFile, resumeFile.name);

    setPending(true);
    const result = await sendToFormSubmit(
      payload,
      `Something went wrong sending your application. Please call us at ${props.phone}.`,
      props.recipient
    );
    setPending(false);

    if (result.success) {
      trackConversion("application", { position });
      setState({
        success: true,
        message: "Application received! Michael will review it and reach out if it's a fit.",
      });
    } else {
      setState(result);
    }
  }

  return (
    <>
      <section className="border-t border-border py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-6">
          <div className="max-w-3xl mb-10 lg:mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-12 bg-gold" aria-hidden="true" />
              <span className="text-gold font-semibold text-sm tracking-widest uppercase">{props.eyebrow}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-navy dark:text-white tracking-tight">{props.heading}</h2>
          </div>

          {positions.length === 0 ? (
            <p className="text-slate">No open positions right now. Send a general application below and we&apos;ll keep it on file.</p>
          ) : (
            <div className="space-y-4 max-w-4xl">
              {positions.map((position) => {
                const isOpen = openId === position.id;
                return (
                  <div key={position.id} className="border border-border rounded-lg overflow-hidden bg-white dark:bg-navy-light">
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : position.id)}
                      className="w-full px-5 sm:px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-warm-gray dark:hover:bg-navy transition-colors"
                      aria-expanded={isOpen}
                      aria-controls={`pos-${position.id}`}
                    >
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-navy dark:text-white">{position.title}</h3>
                        <p className="text-slate text-sm mt-1">{position.type}</p>
                      </div>
                      <svg
                        className={`w-5 h-5 text-gold flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isOpen && (
                      <div id={`pos-${position.id}`} className="px-5 sm:px-6 pb-8 pt-4 border-t border-border">
                        <p className="text-navy/80 dark:text-white/70 leading-relaxed mb-6">{position.summary}</p>
                        <div className="grid md:grid-cols-2 gap-8">
                          {position.responsibilities.length > 0 && (
                            <div>
                              <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-slate mb-3">What You&apos;ll Do</h4>
                              <Bullets items={position.responsibilities} />
                            </div>
                          )}
                          {position.experience.length > 0 && (
                            <div>
                              <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-slate mb-3">What You Bring</h4>
                              <Bullets items={position.experience} />
                            </div>
                          )}
                        </div>

                        {position.bonus.length > 0 && (
                          <div className="mt-8 pt-6 border-t border-border">
                            <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-slate mb-2">Bonus — These Get a Closer Look</h4>
                            <p className="text-slate text-sm mb-3">Bring any of these to the table and they likely shape your starting pay.</p>
                            <Bullets items={position.bonus} />
                          </div>
                        )}

                        {position.nonNegotiables.length > 0 && (
                          <div className="mt-8 pt-6 border-t border-border">
                            <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-gold mb-3">Non-Negotiables</h4>
                            <ul className="space-y-2">
                              {position.nonNegotiables.map((item) => (
                                <li key={item} className="flex items-start gap-3 text-sm text-navy/80 dark:text-white/70">
                                  <svg className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPosition(position.title);
                            document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="mt-8 bg-navy dark:bg-gold text-white dark:text-navy font-semibold text-sm px-6 py-3 rounded transition-colors hover:bg-navy-light dark:hover:bg-gold-light"
                        >
                          Apply for {position.title}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section id="apply" className="border-t border-border bg-warm-gray dark:bg-navy-light py-16 lg:py-28 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-6">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-16">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-12 bg-gold" aria-hidden="true" />
                <span className="text-gold font-semibold text-sm tracking-widest uppercase">{props.applyEyebrow}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-navy dark:text-white tracking-tight mb-6">{props.applyHeading}</h2>
              {props.applyText && <p className="text-slate leading-relaxed mb-6">{props.applyText}</p>}
              {props.applyNote && <p className="text-slate text-sm">{props.applyNote}</p>}
            </div>

            <div className="lg:col-span-3">
              {state.success ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-8 sm:p-12 text-center" role="status" aria-live="polite">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-navy dark:text-white mb-2">Application Received</h3>
                  <p className="text-slate">{state.message}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {state.message && !state.success && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400 text-sm" role="alert">
                      {state.message}
                    </div>
                  )}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="c-name" className="block text-sm font-medium text-navy dark:text-white mb-2">
                        Full Name <span className="text-gold">*</span>
                      </label>
                      <input type="text" id="c-name" name="name" required autoComplete="name" className={inputClass} placeholder="Your name" />
                    </div>
                    <div>
                      <label htmlFor="c-phone" className="block text-sm font-medium text-navy dark:text-white mb-2">
                        Phone <span className="text-gold">*</span>
                      </label>
                      <input type="tel" id="c-phone" name="phone" required autoComplete="tel" className={inputClass} placeholder="(979) 000-0000" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="c-email" className="block text-sm font-medium text-navy dark:text-white mb-2">
                      Email
                    </label>
                    <input type="email" id="c-email" name="email" autoComplete="email" className={inputClass} placeholder="your@email.com" />
                    <p className="text-slate text-xs mt-1.5">Optional, but recommended so we can send you a confirmation.</p>
                  </div>
                  <div>
                    <label htmlFor="c-position" className="block text-sm font-medium text-navy dark:text-white mb-2">
                      Position <span className="text-gold">*</span>
                    </label>
                    <select
                      id="c-position"
                      name="position"
                      required
                      value={selectedPosition}
                      onChange={(e) => setSelectedPosition(e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Select a position</option>
                      {positions.map((p) => (
                        <option key={p.id} value={p.title}>
                          {p.title}
                        </option>
                      ))}
                      <option value="General Application">General Application</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="c-experience" className="block text-sm font-medium text-navy dark:text-white mb-2">
                      Tell us about your experience <span className="text-gold">*</span>
                    </label>
                    <textarea id="c-experience" name="experience" required rows={4} className={`${inputClass} resize-none`} placeholder="Where have you worked? What kind of work? How long?" />
                  </div>
                  <div>
                    <label htmlFor="c-resume" className="block text-sm font-medium text-navy dark:text-white mb-2">
                      Resume (PDF or Word, up to 5 MB)
                    </label>
                    <input
                      type="file"
                      id="c-resume"
                      name="resume"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={(e) => setResumeName(e.target.files?.[0]?.name ?? "")}
                      className="block w-full text-sm text-slate file:mr-4 file:py-2.5 file:px-4 file:rounded file:border-0 file:bg-navy file:text-white dark:file:bg-gold dark:file:text-navy file:font-semibold file:text-sm hover:file:bg-navy-light dark:hover:file:bg-gold-light file:cursor-pointer"
                    />
                    {resumeName && <p className="text-slate text-xs mt-1.5">Attached: {resumeName}</p>}
                  </div>
                  <div>
                    <label htmlFor="c-message" className="block text-sm font-medium text-navy dark:text-white mb-2">
                      Anything else?
                    </label>
                    <textarea id="c-message" name="message" rows={3} className={`${inputClass} resize-none`} placeholder="Availability, certifications, questions..." />
                  </div>
                  <button
                    type="submit"
                    disabled={pending}
                    className="bg-navy dark:bg-gold text-white dark:text-navy font-semibold px-8 py-4 rounded transition-colors hover:bg-navy-light dark:hover:bg-gold-light w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {pending ? "Sending..." : "Submit Application"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
