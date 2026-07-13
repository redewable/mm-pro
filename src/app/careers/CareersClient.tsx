"use client";

import { useState, type FormEvent } from "react";
import { sendToFormSubmit } from "@/lib/formsubmit";

interface Position {
  id: string;
  title: string;
  type: string;
  summary: string;
  responsibilities: string[];
  experience: string[];
  bonus?: string[];
  nonNegotiables: string[];
}

const positions: Position[] = [
  {
    id: "experienced-helper",
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
  },
  {
    id: "entry-level-helper",
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
    nonNegotiables: [
      "Show up on time, every day. If you can't make it, you call — early.",
      "Treat every client's home or business like it's your own.",
      "No drugs, no drama, no excuses.",
      "Listen, learn, and don't pretend to know what you don't.",
      "Respect the crew. We work as a team or we don't work here.",
    ],
  },
];

const initialState = { success: false, message: "" };

const RESUME_MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const RESUME_ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const RESUME_ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];

export default function CareersClient() {
  const [state, setState] = useState(initialState);
  const [pending, setPending] = useState(false);
  const [openId, setOpenId] = useState<string | null>(positions[0]?.id ?? null);
  const [selectedPosition, setSelectedPosition] = useState<string>(
    positions[0]?.title ?? ""
  );
  const [resumeName, setResumeName] = useState<string>("");

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
        message:
          "Please fill in your name, phone, position, and a quick note about your experience.",
      });
      return;
    }

    // Resume validation (optional — applicants can apply without one, but if
    // included it must meet the constraints).
    let resumeFile: File | null = null;
    if (resume instanceof File && resume.size > 0) {
      if (resume.size > RESUME_MAX_BYTES) {
        setState({
          success: false,
          message: "Resume must be 5 MB or smaller.",
        });
        return;
      }
      const lowerName = resume.name.toLowerCase();
      const extensionOk = RESUME_ALLOWED_EXTENSIONS.some((ext) =>
        lowerName.endsWith(ext)
      );
      const typeOk = resume.type
        ? RESUME_ALLOWED_TYPES.has(resume.type)
        : false;
      if (!extensionOk && !typeOk) {
        setState({
          success: false,
          message: "Resume must be a PDF, DOC, or DOCX file.",
        });
        return;
      }
      resumeFile = resume;
    }

    // Field names with spaces become the row labels in the email.
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
      "Something went wrong sending your application. Please call us at (979) 587-3639."
    );
    setPending(false);

    setState(
      result.success
        ? {
            success: true,
            message:
              "Application received! Michael will review it and reach out if it's a fit.",
          }
        : result
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-12 bg-gold" aria-hidden="true" />
              <span className="text-gold font-semibold text-sm tracking-widest uppercase">
                Careers
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-navy dark:text-white tracking-tight mb-6">
              Build With{" "}
              <span className="text-gold">a Crew That Cares.</span>
            </h1>
            <p className="text-slate text-lg leading-relaxed">
              We&apos;re growing, and we&apos;re picky about who we grow with.
              If you take pride in your work, show up every day, and want to
              be part of something built on legacy and craftsmanship — we
              want to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Why M&M */}
      <section className="border-t border-border bg-warm-gray dark:bg-navy-light py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "Fair Pay, On Time",
                body: "Competitive wages, paid weekly, no waiting around to get what you've earned.",
              },
              {
                title: "Real Work, Real Variety",
                body: "Commercial build-outs, custom homes, outdoor living, lighting — you'll learn more here in a year than most places in three.",
              },
              {
                title: "Respect & Standards",
                body: "We hire adults and treat people like adults. We also hold the line on quality — that's the deal.",
              },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="text-lg font-bold text-navy dark:text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-navy/70 dark:text-white/60 leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="border-t border-border py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-12 bg-gold" aria-hidden="true" />
              <span className="text-gold font-semibold text-sm tracking-widest uppercase">
                Open Positions
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-navy dark:text-white tracking-tight">
              What We&apos;re Hiring For
            </h2>
          </div>

          <div className="space-y-4 max-w-4xl">
            {positions.map((position) => {
              const isOpen = openId === position.id;
              return (
                <div
                  key={position.id}
                  className="border border-border rounded-lg overflow-hidden bg-white dark:bg-navy-light"
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : position.id)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-warm-gray dark:hover:bg-navy transition-colors"
                    aria-expanded={isOpen}
                    aria-controls={`pos-${position.id}`}
                  >
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-navy dark:text-white">
                        {position.title}
                      </h3>
                      <p className="text-slate text-sm mt-1">
                        {position.type}
                      </p>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gold flex-shrink-0 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isOpen && (
                    <div
                      id={`pos-${position.id}`}
                      className="px-6 pb-8 pt-2 border-t border-border"
                    >
                      <p className="text-navy/80 dark:text-white/70 leading-relaxed mb-6">
                        {position.summary}
                      </p>

                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-slate mb-3">
                            What You&apos;ll Do
                          </h4>
                          <ul className="space-y-2">
                            {position.responsibilities.map((item) => (
                              <li
                                key={item}
                                className="flex items-start gap-3 text-sm text-navy/70 dark:text-white/60"
                              >
                                <span
                                  className="text-gold mt-1.5 leading-none"
                                  aria-hidden="true"
                                >
                                  •
                                </span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-slate mb-3">
                            What You Bring
                          </h4>
                          <ul className="space-y-2">
                            {position.experience.map((item) => (
                              <li
                                key={item}
                                className="flex items-start gap-3 text-sm text-navy/70 dark:text-white/60"
                              >
                                <span
                                  className="text-gold mt-1.5 leading-none"
                                  aria-hidden="true"
                                >
                                  •
                                </span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {position.bonus && position.bonus.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-border">
                          <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-slate mb-2">
                            Bonus — These Get a Closer Look
                          </h4>
                          <p className="text-slate text-sm mb-3">
                            Bring any of these to the table and they likely
                            shape your starting pay.
                          </p>
                          <ul className="space-y-2">
                            {position.bonus.map((item) => (
                              <li
                                key={item}
                                className="flex items-start gap-3 text-sm text-navy/70 dark:text-white/60"
                              >
                                <span
                                  className="text-gold mt-1.5 leading-none"
                                  aria-hidden="true"
                                >
                                  •
                                </span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="mt-8 pt-6 border-t border-border">
                        <h4 className="text-xs font-semibold tracking-[0.15em] uppercase text-gold mb-3">
                          Non-Negotiables
                        </h4>
                        <ul className="space-y-2">
                          {position.nonNegotiables.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-3 text-sm text-navy/80 dark:text-white/70"
                            >
                              <svg
                                className="w-4 h-4 text-gold flex-shrink-0 mt-0.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPosition(position.title);
                          document
                            .getElementById("apply")
                            ?.scrollIntoView({ behavior: "smooth" });
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
        </div>
      </section>

      {/* Application Form */}
      <section
        id="apply"
        className="border-t border-border bg-warm-gray dark:bg-navy-light py-20 lg:py-28 scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-16">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-12 bg-gold" aria-hidden="true" />
                <span className="text-gold font-semibold text-sm tracking-widest uppercase">
                  Apply Now
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-navy dark:text-white tracking-tight mb-6">
                Tell Us About Yourself.
              </h2>
              <p className="text-slate leading-relaxed mb-6">
                Fill out the form, attach a resume if you have one, and
                Michael will personally review every application. If your
                background looks like a fit, we&apos;ll reach out to set up a
                conversation.
              </p>
              <p className="text-slate text-sm">
                No resume? No problem — tell us about your experience in the
                form. We&apos;ve hired plenty of great people who didn&apos;t
                come with a polished resume.
              </p>
            </div>

            <div className="lg:col-span-3">
              {state.success ? (
                <div
                  className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-12 text-center"
                  role="status"
                  aria-live="polite"
                >
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-navy dark:text-white mb-2">
                    Application Received
                  </h3>
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
                        name="name"
                        required
                        className="w-full border border-border bg-white dark:bg-navy rounded-lg px-4 py-3 text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors"
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
                        name="phone"
                        required
                        className="w-full border border-border bg-white dark:bg-navy rounded-lg px-4 py-3 text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors"
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
                      name="email"
                      className="w-full border border-border bg-white dark:bg-navy rounded-lg px-4 py-3 text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors"
                      placeholder="your@email.com"
                    />
                    <p className="text-slate text-xs mt-1.5">
                      Optional, but recommended so we can send you a
                      confirmation.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="position"
                      className="block text-sm font-medium text-navy dark:text-white mb-2"
                    >
                      Position <span className="text-gold">*</span>
                    </label>
                    <select
                      id="position"
                      name="position"
                      required
                      value={selectedPosition}
                      onChange={(e) => setSelectedPosition(e.target.value)}
                      className="w-full border border-border bg-white dark:bg-navy rounded-lg px-4 py-3 text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-colors"
                    >
                      <option value="">Select a position</option>
                      {positions.map((p) => (
                        <option key={p.id} value={p.title}>
                          {p.title}
                        </option>
                      ))}
                      <option value="General Application">
                        General Application
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="experience"
                      className="block text-sm font-medium text-navy dark:text-white mb-2"
                    >
                      Tell us about your experience{" "}
                      <span className="text-gold">*</span>
                    </label>
                    <textarea
                      id="experience"
                      name="experience"
                      required
                      rows={4}
                      className="w-full border border-border bg-white dark:bg-navy rounded-lg px-4 py-3 text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold resize-none transition-colors"
                      placeholder="Where have you worked? What kind of work? How long?"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="resume"
                      className="block text-sm font-medium text-navy dark:text-white mb-2"
                    >
                      Resume
                    </label>
                    <div className="flex items-center gap-4">
                      <label
                        htmlFor="resume"
                        className="cursor-pointer inline-flex items-center gap-2 border border-border bg-white dark:bg-navy rounded-lg px-4 py-3 text-navy dark:text-white hover:border-gold transition-colors text-sm font-medium"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                          />
                        </svg>
                        Choose file
                      </label>
                      <input
                        type="file"
                        id="resume"
                        name="resume"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={(e) =>
                          setResumeName(e.target.files?.[0]?.name ?? "")
                        }
                        className="sr-only"
                      />
                      <span className="text-slate text-sm truncate">
                        {resumeName || "No file selected"}
                      </span>
                    </div>
                    <p className="text-slate text-xs mt-1.5">
                      Optional. PDF, DOC, or DOCX. 5 MB max.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-navy dark:text-white mb-2"
                    >
                      Anything else we should know?
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      className="w-full border border-border bg-white dark:bg-navy rounded-lg px-4 py-3 text-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold resize-none transition-colors"
                      placeholder="Optional — anything you want Michael to know."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={pending}
                    className="bg-navy dark:bg-gold text-white dark:text-navy font-semibold px-8 py-4 rounded transition-colors hover:bg-navy-light dark:hover:bg-gold-light w-full md:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
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
