import Link from "next/link";
import SmartImage from "@/components/SmartImage";
import Icon from "@/components/Icon";
import Gallery from "@/components/Gallery";
import VideoPlayer from "@/components/VideoPlayer";
import PhoneLink from "@/components/PhoneLink";
import ContactForm from "@/components/ContactForm";
import CareersSection from "@/components/CareersSection";
import JsonLd from "@/components/JsonLd";
import { faqJsonLd } from "@/lib/seo";
import { str, num, bool, strList, imageRef } from "@/lib/content/normalize";
import {
  STATUS_LABEL,
  findProject,
  findVideo,
  paragraphs,
  projectVideos,
  publishedProjects,
  publishedServices,
  publishedTestimonials,
  publishedVideos,
  telHref,
  videoThumbnail,
  formatDuration,
} from "@/lib/content/helpers";
import type {
  SiteContent,
  Section,
  Page,
  Project,
  Video,
  Testimonial,
  ImageRef,
  LinkRef,
} from "@/lib/content/types";

type D = Record<string, unknown>;
interface Ctx {
  content: SiteContent;
  page: Page;
  index: number;
}

const isObj = (v: unknown): v is D => typeof v === "object" && v !== null && !Array.isArray(v);
const link = (v: unknown): LinkRef => ({
  label: isObj(v) ? str(v.label) : "",
  href: isObj(v) ? str(v.href) : "",
});
const items = (v: unknown): D[] => (Array.isArray(v) ? v.filter(isObj) : []);

// ---------- shared bits ----------

export function Eyebrow({ text, center = false }: { text: string; center?: boolean }) {
  if (!text) return null;
  return (
    <div className={`flex items-center gap-3 mb-4 ${center ? "justify-center" : ""}`}>
      <span className="h-px w-12 bg-gold" aria-hidden="true" />
      <span className="text-gold font-semibold text-sm tracking-widest uppercase">{text}</span>
      {center && <span className="h-px w-12 bg-gold" aria-hidden="true" />}
    </div>
  );
}

function Arrow() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" aria-hidden="true" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

function TextLink({ l, className = "" }: { l: LinkRef; className?: string }) {
  if (!l.label || !l.href) return null;
  return (
    <Link
      href={l.href}
      className={`inline-flex items-center gap-2 text-navy dark:text-gold font-semibold text-sm hover:gap-3 transition-all ${className}`}
    >
      {l.label}
      <Arrow />
    </Link>
  );
}

function Stars({ n = 5, className = "w-5 h-5" }: { n?: number; className?: string }) {
  return (
    <div className="flex gap-1" aria-label={`${n} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`${className} ${i < n ? "text-gold" : "text-border"}`}
          fill="currentColor"
          aria-hidden="true"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="w-1.5 h-1.5 bg-gold rounded-full flex-shrink-0 mt-2" />
      <span className="text-navy/70 dark:text-white/60 text-sm leading-relaxed">{text}</span>
    </li>
  );
}

export function StatusBadge({ status }: { status: Project["status"] }) {
  const cls =
    status === "in-progress"
      ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
      : status === "planned"
        ? "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
        : "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400";
  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${cls}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

const CONTAINER = "max-w-7xl mx-auto px-5 sm:px-6";

// ---------- sections ----------

function Hero({ d }: { d: D }) {
  const image = imageRef(d.image);
  const primary = link(d.primaryCta);
  const secondary = link(d.secondaryCta);
  return (
    <section className="relative bg-navy overflow-hidden min-h-[520px] md:min-h-[600px] lg:min-h-[700px] flex items-center">
      {image.url && (
        <SmartImage
          src={image.url}
          alt={image.alt}
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-navy/30" />
      <div className={`relative ${CONTAINER} py-20 md:py-28 lg:py-44 w-full`}>
        <div className="max-w-2xl">
          {str(d.eyebrow) && (
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-12 bg-gold" />
              <span className="text-gold font-semibold text-sm tracking-widest uppercase">{str(d.eyebrow)}</span>
            </div>
          )}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-white mb-6">
            {str(d.heading)}{" "}
            {str(d.headingAccent) && <span className="text-gold">{str(d.headingAccent)}</span>}
          </h1>
          {str(d.text) && (
            <p className="text-base sm:text-lg text-white/70 leading-relaxed mb-10 max-w-xl">{str(d.text)}</p>
          )}
          <div className="flex flex-col sm:flex-row gap-4">
            {primary.label && primary.href && (
              <Link href={primary.href} className="bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-4 rounded text-center transition-colors">
                {primary.label}
              </Link>
            )}
            {secondary.label && secondary.href && (
              <Link href={secondary.href} className="border border-white/30 hover:border-white/50 text-white font-semibold px-8 py-4 rounded text-center transition-colors">
                {secondary.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function PageHeader({ d, index }: { d: D; index: number }) {
  const Tag = index === 0 ? "h1" : "h2";
  return (
    <section className="py-16 md:py-20 lg:py-28">
      <div className={CONTAINER}>
        <div className="max-w-3xl">
          <Eyebrow text={str(d.eyebrow)} />
          <Tag className="text-4xl md:text-5xl font-bold text-navy dark:text-white tracking-tight leading-[1.15] mb-6">
            {str(d.heading)}{" "}
            {str(d.headingAccent) && <span className="text-gold">{str(d.headingAccent)}</span>}
          </Tag>
          {str(d.text) && <p className="text-slate text-lg leading-relaxed">{str(d.text)}</p>}
        </div>
      </div>
    </section>
  );
}

function Stats({ d }: { d: D }) {
  const list = items(d.items);
  if (!list.length) return null;
  return (
    <section className="border-b border-border">
      <div className={`${CONTAINER} py-12 lg:py-14`}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16">
          {list.map((it, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-navy dark:text-white tracking-tight">{str(it.value)}</p>
              <p className="text-sm text-slate mt-1">{str(it.label)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesGrid({ d, content }: { d: D; content: SiteContent }) {
  const services = publishedServices(content).filter((s) => s.showOnHome);
  return (
    <section className="py-16 md:py-20 lg:py-28">
      <div className={CONTAINER}>
        <div className="max-w-2xl mb-12 lg:mb-16">
          <Eyebrow text={str(d.eyebrow)} />
          <h2 className="text-3xl md:text-4xl font-bold text-navy dark:text-white tracking-tight">{str(d.heading)}</h2>
          {str(d.text) && <p className="text-slate mt-4 leading-relaxed">{str(d.text)}</p>}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/services#${service.slug}`}
              className="group bg-white dark:bg-navy-light border border-border rounded-lg p-6 md:p-8 hover-lift block"
            >
              <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center text-gold mb-5 group-hover:bg-gold/20 transition-colors">
                <Icon name={service.icon} className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-navy dark:text-white mb-2">{service.title}</h3>
              <p className="text-slate text-sm leading-relaxed">{service.description}</p>
            </Link>
          ))}
        </div>
        <div className="mt-10 lg:mt-12">
          <TextLink l={link(d.cta)} />
        </div>
      </div>
    </section>
  );
}

function ServicesDetail({ d, content }: { d: D; content: SiteContent }) {
  const all = publishedServices(content);
  const primary = all.filter((s) => s.primary);
  const rest = all.filter((s) => !s.primary);
  return (
    <>
      {primary.length > 0 && (
        <section className="border-t border-border">
          <div className={CONTAINER}>
            {primary.map((service, index) => (
              <div
                key={service.id}
                id={service.slug}
                className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center py-14 md:py-20 scroll-mt-28 ${
                  index < primary.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-gold/40 font-bold text-sm tabular-nums">0{index + 1}</span>
                    <span className="h-px flex-1 bg-border" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-navy dark:text-white tracking-tight mb-4">{service.title}</h2>
                  <p className="text-slate leading-relaxed mb-8">{service.description}</p>
                  {service.features.length > 0 && (
                    <ul className="space-y-3">
                      {service.features.map((f) => (
                        <Bullet key={f} text={f} />
                      ))}
                    </ul>
                  )}
                </div>
                {service.image?.url && (
                  <div className={`relative rounded-lg overflow-hidden aspect-[4/3] ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                    <SmartImage src={service.image.url} alt={service.image.alt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-center" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      {rest.length > 0 && (
        <section className="bg-warm-gray dark:bg-navy-light border-y border-border py-16 md:py-20 lg:py-28">
          <div className={CONTAINER}>
            <div className="max-w-2xl mb-12 lg:mb-16">
              <Eyebrow text={str(d.additionalEyebrow)} />
              <h2 className="text-3xl font-bold text-navy dark:text-white tracking-tight">{str(d.additionalHeading)}</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {rest.map((service) => (
                <div key={service.id} id={service.slug} className="bg-white dark:bg-navy border border-border rounded-lg p-6 md:p-8 scroll-mt-28">
                  <h3 className="text-base font-bold text-navy dark:text-white mb-2">{service.title}</h3>
                  <p className="text-slate text-sm leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function FeaturedProject({ d, content }: { d: D; content: SiteContent }) {
  const list = publishedProjects(content);
  const project =
    (str(d.projectId) && findProject(content, str(d.projectId))) ||
    list.find((p) => p.featured) ||
    list[0];
  if (!project) return null;
  return (
    <section className="bg-warm-gray dark:bg-navy-light border-y border-border">
      <div className={`${CONTAINER} py-16 md:py-20 lg:py-28`}>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <Eyebrow text={str(d.eyebrow)} />
            <h2 className="text-3xl md:text-4xl font-bold text-navy dark:text-white tracking-tight mb-6">{project.title}</h2>
            <p className="text-slate leading-relaxed mb-8">{project.description || project.summary}</p>
            {project.scope.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-8">
                {project.scope.slice(0, 6).map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gold rounded-full flex-shrink-0" />
                    <span className="text-navy/70 dark:text-white/60 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              <TextLink l={{ label: "View This Project", href: `/portfolio/${project.slug}` }} />
              <TextLink l={link(d.cta)} />
            </div>
          </div>
          {project.cover.url && (
            <Link href={`/portfolio/${project.slug}`} className="relative rounded-lg overflow-hidden aspect-[4/3] block">
              <SmartImage src={project.cover.url} alt={project.cover.alt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-center" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

function FeatureCards({ d }: { d: D }) {
  const list = items(d.items);
  const cards = str(d.style) === "cards";
  const center = str(d.align) === "center";
  return (
    <section className={`${cards ? "bg-warm-gray dark:bg-navy-light border-y border-border" : ""} py-16 md:py-20 lg:py-28`}>
      <div className={CONTAINER}>
        {(str(d.heading) || str(d.eyebrow)) && (
          <div className={`max-w-2xl mb-12 lg:mb-16 ${center ? "mx-auto text-center" : ""}`}>
            <Eyebrow text={str(d.eyebrow)} center={center} />
            <h2 className="text-3xl md:text-4xl font-bold text-navy dark:text-white tracking-tight">{str(d.heading)}</h2>
            {str(d.text) && <p className="text-slate mt-4 leading-relaxed">{str(d.text)}</p>}
          </div>
        )}
        <div className={`grid sm:grid-cols-2 ${list.length % 4 === 0 ? "lg:grid-cols-4" : "lg:grid-cols-3"} ${cards ? "gap-5 md:gap-6" : "gap-8 lg:gap-10"}`}>
          {list.map((it, i) => (
            <div key={i} className={cards ? "bg-white dark:bg-navy border border-border rounded-lg p-6 md:p-8 hover-lift" : ""}>
              <div className="w-11 h-11 bg-gold/10 rounded-lg flex items-center justify-center text-gold mb-4">
                <Icon name={str(it.icon, "sparkle")} />
              </div>
              <h3 className="text-base font-bold text-navy dark:text-white mb-2">{str(it.title)}</h3>
              <p className="text-slate text-sm leading-relaxed">{str(it.text)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ImageText({ d }: { d: D }) {
  const image = imageRef(d.image);
  const left = str(d.imageSide) === "left";
  const tint = str(d.background, "tint") === "tint";
  const aspect = str(d.aspect, "4/3");
  const aspectClass = aspect === "1/1" ? "aspect-square" : aspect === "3/4" ? "aspect-[4/5] lg:aspect-[3/4]" : "aspect-[4/3]";
  const bullets = strList(d.bullets);
  const blocks = paragraphs(str(d.body));
  return (
    <section className={`${tint ? "bg-warm-gray dark:bg-navy-light border-y border-border" : ""} py-16 md:py-20 lg:py-28`}>
      <div className={CONTAINER}>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className={left ? "lg:order-2" : ""}>
            <Eyebrow text={str(d.eyebrow)} />
            {str(d.heading) && (
              <h2 className="text-3xl md:text-4xl font-bold text-navy dark:text-white tracking-tight leading-tight mb-6">{str(d.heading)}</h2>
            )}
            <div className="space-y-5 text-slate leading-relaxed">
              {blocks.map((b, i) =>
                b.type === "ul" ? (
                  <ul key={i} className="space-y-2">
                    {b.lines.map((l) => (
                      <Bullet key={l} text={l} />
                    ))}
                  </ul>
                ) : (
                  <p key={i}>{b.lines[0]}</p>
                )
              )}
            </div>
            {bullets.length > 0 && (
              <ul className="space-y-2 mt-6">
                {bullets.map((b) => (
                  <Bullet key={b} text={b} />
                ))}
              </ul>
            )}
            <TextLink l={link(d.cta)} className="mt-8" />
          </div>
          {image.url && (
            <div className={`relative rounded-lg overflow-hidden ${aspectClass} ${left ? "lg:order-1" : ""}`}>
              <SmartImage src={image.url} alt={image.alt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-top" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function RichText({ d }: { d: D }) {
  const center = str(d.align) === "center";
  const blocks = paragraphs(str(d.body));
  return (
    <section className={`py-16 md:py-20 ${center ? "bg-navy text-white" : ""}`}>
      <div className={`${center ? "max-w-4xl text-center" : "max-w-3xl"} mx-auto px-5 sm:px-6`}>
        <Eyebrow text={str(d.eyebrow)} center={center} />
        {str(d.heading) && (
          <h2 className={`text-3xl font-bold tracking-tight mb-8 ${center ? "" : "text-navy dark:text-white"}`}>{str(d.heading)}</h2>
        )}
        <div className={`space-y-5 leading-relaxed ${center ? "text-xl md:text-2xl font-semibold" : "text-slate"}`}>
          {blocks.map((b, i) =>
            b.type === "ul" ? (
              <ul key={i} className="space-y-2 text-left">
                {b.lines.map((l) => (
                  <Bullet key={l} text={l} />
                ))}
              </ul>
            ) : (
              <p key={i} className={center && i > 0 ? "text-base font-normal text-white/60" : ""}>
                {b.lines[0]}
              </p>
            )
          )}
        </div>
      </div>
    </section>
  );
}

function TestimonialSpotlight({ d, content }: { d: D; content: SiteContent }) {
  const list = publishedTestimonials(content);
  const t: Testimonial | undefined =
    (str(d.testimonialId) && list.find((x) => x.id === str(d.testimonialId))) ||
    list.find((x) => x.featured) ||
    list[0];
  if (!t) return null;
  return (
    <section className="bg-warm-gray dark:bg-navy-light border-y border-border py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 text-center">
        <div className="flex justify-center mb-6">
          <Stars n={t.rating || 5} />
        </div>
        <p className="text-lg sm:text-xl md:text-2xl text-navy dark:text-white leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
        <p className="text-navy dark:text-white font-semibold">{t.author}</p>
        {t.project && <p className="text-slate text-sm">{t.project}</p>}
        <TextLink l={link(d.cta)} className="mt-8 !text-gold" />
      </div>
    </section>
  );
}

function TestimonialsGrid({ d, content }: { d: D; content: SiteContent }) {
  const limit = num(d.limit, 0);
  const list = publishedTestimonials(content).slice(0, limit > 0 ? limit : undefined);
  if (!list.length) return null;
  return (
    <section className="border-t border-border py-16 md:py-24">
      <div className={CONTAINER}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {list.map((t) => (
            <div key={t.id} className="bg-white dark:bg-navy-light border border-border rounded-lg p-6 md:p-8 hover-lift flex flex-col">
              <div className="mb-5">
                <Stars n={t.rating || 5} className="w-4 h-4" />
              </div>
              <p className="text-navy/80 dark:text-white/70 leading-relaxed mb-6 text-sm flex-1">&ldquo;{t.quote}&rdquo;</p>
              <div className="border-t border-border pt-4">
                <p className="font-semibold text-navy dark:text-white text-sm">{t.author}</p>
                <p className="text-slate text-xs mt-0.5">
                  {t.project}
                  {t.source ? ` · via ${t.source}` : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectRow({ project, index, videoCount }: { project: Project; index: number; videoCount: number }) {
  return (
    <div className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center py-14 md:py-20`}>
      <Link
        href={`/portfolio/${project.slug}`}
        className={`relative rounded-lg overflow-hidden aspect-[4/3] block bg-warm-gray dark:bg-navy-light ${index % 2 === 1 ? "lg:order-2" : ""}`}
      >
        {project.cover.url && (
          <SmartImage src={project.cover.url} alt={project.cover.alt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-center" />
        )}
        {(project.gallery.length > 0 || videoCount > 0) && (
          <span className="absolute bottom-3 left-3 flex gap-2">
            {project.gallery.length > 0 && (
              <span className="bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <Icon name="camera" className="w-3.5 h-3.5" /> {project.gallery.length + 1} photos
              </span>
            )}
            {videoCount > 0 && (
              <span className="bg-gold text-navy text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <Icon name="video" className="w-3.5 h-3.5" /> {videoCount} video{videoCount > 1 ? "s" : ""}
              </span>
            )}
          </span>
        )}
      </Link>
      <div className={index % 2 === 1 ? "lg:order-1" : ""}>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
          <span className="text-xs font-semibold text-gold bg-gold/10 px-3 py-1 rounded-full">{project.category}</span>
          <StatusBadge status={project.status} />
          {project.location && <span className="text-xs text-slate">{project.location}</span>}
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-navy dark:text-white tracking-tight mb-4">
          <Link href={`/portfolio/${project.slug}`} className="hover:text-gold transition-colors">
            {project.title}
          </Link>
        </h2>
        <p className="text-slate leading-relaxed mb-8">{project.description || project.summary}</p>
        {project.scope.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-navy/40 dark:text-white/30 uppercase tracking-widest mb-3">Project Scope</p>
            <ul className="space-y-2">
              {project.scope.map((item) => (
                <Bullet key={item} text={item} />
              ))}
            </ul>
          </div>
        )}
        <TextLink l={{ label: "View Project", href: `/portfolio/${project.slug}` }} className="mt-8" />
      </div>
    </div>
  );
}

export function ProjectCard({ project, videoCount = 0 }: { project: Project; videoCount?: number }) {
  return (
    <Link href={`/portfolio/${project.slug}`} className="group bg-white dark:bg-navy-light border border-border rounded-lg overflow-hidden hover-lift block">
      <div className="relative aspect-[4/3] bg-warm-gray dark:bg-navy">
        {project.cover.url && (
          <SmartImage src={project.cover.url} alt={project.cover.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover group-hover:scale-[1.03] transition-transform duration-500" />
        )}
        {videoCount > 0 && (
          <span className="absolute bottom-3 left-3 bg-gold text-navy text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
            <Icon name="video" className="w-3.5 h-3.5" /> Video
          </span>
        )}
      </div>
      <div className="p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-gold bg-gold/10 px-2.5 py-1 rounded-full">{project.category}</span>
          <StatusBadge status={project.status} />
        </div>
        <h3 className="text-lg font-bold text-navy dark:text-white mb-1.5 group-hover:text-gold transition-colors">{project.title}</h3>
        <p className="text-slate text-sm leading-relaxed line-clamp-3">{project.summary || project.description}</p>
      </div>
    </Link>
  );
}

function ProjectsList({ d, content }: { d: D; content: SiteContent }) {
  const status = str(d.status, "all");
  const limit = num(d.limit, 0);
  let list = publishedProjects(content);
  if (status !== "all") list = list.filter((p) => p.status === status);
  if (limit > 0) list = list.slice(0, limit);
  if (!list.length) {
    return (
      <section className="border-t border-border py-16">
        <div className={`${CONTAINER} text-center text-slate`}>New projects are being documented — check back soon.</div>
      </section>
    );
  }
  const grid = str(d.layout, "rows") === "grid";
  return (
    <section className="border-t border-border">
      <div className={`${CONTAINER} ${grid ? "py-14 md:py-20" : ""}`}>
        {grid ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {list.map((p) => (
              <ProjectCard key={p.id} project={p} videoCount={projectVideos(content, p).length} />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {list.map((p, i) => (
              <ProjectRow key={p.id} project={p} index={i} videoCount={projectVideos(content, p).length} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function VideoCard({ video, project }: { video: Video; project?: Project }) {
  const thumb = videoThumbnail(video);
  return (
    <Link href={`/videos/${video.slug}`} className="group bg-white dark:bg-navy-light border border-border rounded-lg overflow-hidden hover-lift block">
      <div className="relative aspect-video bg-navy">
        {thumb ? (
          <SmartImage src={thumb} alt={video.poster?.alt || video.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover group-hover:scale-[1.03] transition-transform duration-500" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-navy to-navy-dark" />
        )}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-14 h-14 rounded-full bg-gold/95 text-navy flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <svg className="w-6 h-6 ml-0.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
        {video.durationSeconds ? (
          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">{formatDuration(video.durationSeconds)}</span>
        ) : null}
      </div>
      <div className="p-5 md:p-6">
        {(video.category || project) && (
          <p className="text-xs font-semibold text-gold uppercase tracking-widest mb-2">{video.category || project?.category}</p>
        )}
        <h3 className="text-lg font-bold text-navy dark:text-white mb-1.5 group-hover:text-gold transition-colors">{video.title}</h3>
        {video.description && <p className="text-slate text-sm leading-relaxed line-clamp-2">{video.description}</p>}
        {project && <p className="text-xs text-slate mt-3">Project: {project.title}</p>}
      </div>
    </Link>
  );
}

function VideosGrid({ d, content }: { d: D; content: SiteContent }) {
  let list = publishedVideos(content);
  if (bool(d.featuredOnly)) list = list.filter((v) => v.featured);
  const limit = num(d.limit, 0);
  if (limit > 0) list = list.slice(0, limit);
  const hasHeading = str(d.heading) || str(d.eyebrow);
  if (!list.length) {
    // On the home page just skip the section; on the Videos page show a note.
    if (limit > 0) return null;
    const fb = content.business.socials.find((s) => /facebook/i.test(s.platform));
    return (
      <section className="border-t border-border py-16 md:py-20">
        <div className={`${CONTAINER} text-center`}>
          <div className="w-16 h-16 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto mb-5">
            <Icon name="video" className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-navy dark:text-white tracking-tight mb-2">Walkthrough videos are on the way</h2>
          <p className="text-slate max-w-md mx-auto leading-relaxed">We&apos;re filming current projects now. In the meantime, browse the photos in our portfolio{fb ? " or follow along on Facebook" : ""}.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link href="/portfolio" className="bg-navy dark:bg-gold text-white dark:text-navy font-semibold px-6 py-3 rounded transition-colors hover:bg-navy-light dark:hover:bg-gold-light">View Projects</Link>
            {fb && (
              <a href={fb.url} target="_blank" rel="noopener noreferrer" className="border border-border hover:border-navy dark:hover:border-gold text-navy dark:text-white font-semibold px-6 py-3 rounded transition-colors">Follow on Facebook</a>
            )}
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="py-16 md:py-20 lg:py-28 border-t border-border">
      <div className={CONTAINER}>
        {hasHeading && (
          <div className="max-w-2xl mb-10 lg:mb-14">
            <Eyebrow text={str(d.eyebrow)} />
            <h2 className="text-3xl md:text-4xl font-bold text-navy dark:text-white tracking-tight">{str(d.heading)}</h2>
            {str(d.text) && <p className="text-slate mt-4 leading-relaxed">{str(d.text)}</p>}
          </div>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {list.map((v) => (
            <VideoCard key={v.id} video={v} project={v.projectId ? findProject(content, v.projectId) : undefined} />
          ))}
        </div>
        <div className="mt-10">
          <TextLink l={link(d.cta)} />
        </div>
      </div>
    </section>
  );
}

function VideoEmbed({ d, content }: { d: D; content: SiteContent }) {
  const v = str(d.videoId) ? findVideo(content, str(d.videoId)) : publishedVideos(content)[0];
  if (!v || !v.published) return null;
  return (
    <section className="py-16 md:py-20 lg:py-28">
      <div className="max-w-5xl mx-auto px-5 sm:px-6">
        {(str(d.heading) || str(d.eyebrow)) && (
          <div className="max-w-2xl mb-8 lg:mb-10">
            <Eyebrow text={str(d.eyebrow)} />
            <h2 className="text-3xl md:text-4xl font-bold text-navy dark:text-white tracking-tight">{str(d.heading)}</h2>
            {str(d.text) && <p className="text-slate mt-4 leading-relaxed">{str(d.text)}</p>}
          </div>
        )}
        <VideoPlayer video={v} />
        <p className="text-sm text-slate mt-4">
          <Link href={`/videos/${v.slug}`} className="font-semibold text-navy dark:text-gold hover:text-gold">
            {v.title}
          </Link>
          {v.description ? ` — ${v.description}` : ""}
        </p>
      </div>
    </section>
  );
}

function GallerySection({ d }: { d: D }) {
  const imgs: ImageRef[] = items(d.images).map((it) => imageRef(it.image)).filter((i) => i.url);
  if (!imgs.length) return null;
  const columns = (num(Number(str(d.columns, "3")), 3) as 2 | 3 | 4) || 3;
  return (
    <section className="py-16 md:py-20 lg:py-28">
      <div className={CONTAINER}>
        {(str(d.heading) || str(d.eyebrow)) && (
          <div className="max-w-2xl mb-8 lg:mb-10">
            <Eyebrow text={str(d.eyebrow)} />
            <h2 className="text-3xl md:text-4xl font-bold text-navy dark:text-white tracking-tight">{str(d.heading)}</h2>
          </div>
        )}
        <Gallery images={imgs} columns={columns} />
      </div>
    </section>
  );
}

function ProcessSteps({ d }: { d: D }) {
  const list = items(d.items);
  if (!list.length) return null;
  return (
    <section className="py-16 md:py-20 lg:py-28">
      <div className={CONTAINER}>
        <div className="max-w-2xl mb-12 lg:mb-16">
          <Eyebrow text={str(d.eyebrow)} />
          <h2 className="text-3xl font-bold text-navy dark:text-white tracking-tight">{str(d.heading)}</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {list.map((it, i) => (
            <div key={i}>
              <span className="text-5xl font-bold text-border dark:text-white/10">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-base font-bold text-navy dark:text-white mt-3 mb-2">{str(it.title)}</h3>
              <p className="text-slate text-sm leading-relaxed">{str(it.text)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Timeline({ d }: { d: D }) {
  const list = items(d.items);
  if (!list.length) return null;
  return (
    <section className="py-16 md:py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-5 sm:px-6">
        <Eyebrow text={str(d.eyebrow)} />
        <h2 className="text-3xl font-bold text-navy dark:text-white tracking-tight mb-10 lg:mb-12">{str(d.heading)}</h2>
        <div>
          {list.map((it, index) => (
            <div key={index} className="flex gap-5 sm:gap-6">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 bg-gold rounded-full flex-shrink-0 mt-2" />
                {index < list.length - 1 && <div className="w-px flex-1 bg-border" />}
              </div>
              <div className="pb-10">
                <p className="text-xs font-bold text-gold uppercase tracking-widest mb-2">{str(it.label)}</p>
                <p className="text-navy/80 dark:text-white/70 leading-relaxed text-[15px]">{str(it.text)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq({ d, content }: { d: D; content: SiteContent }) {
  const list = bool(d.useGlobal, true)
    ? content.seo.faq
    : items(d.items).map((it, i) => ({ id: String(i), question: str(it.question), answer: str(it.answer) }));
  const clean = list.filter((f) => f.question && f.answer);
  if (!clean.length) return null;
  return (
    <section className="py-16 md:py-20 lg:py-28 border-t border-border">
      <div className="max-w-3xl mx-auto px-5 sm:px-6">
        <JsonLd data={faqJsonLd(clean)} />
        <Eyebrow text={str(d.eyebrow)} />
        <h2 className="text-3xl font-bold text-navy dark:text-white tracking-tight mb-8 lg:mb-10">{str(d.heading)}</h2>
        <div className="divide-y divide-border border-y border-border">
          {clean.map((f) => (
            <details key={f.id} className="group py-5">
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none text-navy dark:text-white font-semibold">
                <span>{f.question}</span>
                <svg className="w-5 h-5 text-gold flex-shrink-0 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-slate leading-relaxed mt-3 pr-8">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cta({ d, content }: { d: D; content: SiteContent }) {
  const dark = str(d.style, "dark") === "dark";
  const primary = link(d.primaryCta);
  const b = content.business;
  return (
    <section className={dark ? "bg-navy text-white py-16 md:py-20" : "bg-warm-gray dark:bg-navy-light border-t border-border py-16 md:py-20"}>
      <div className="max-w-3xl mx-auto px-5 sm:px-6 text-center">
        <h2 className={`text-3xl md:text-4xl font-bold tracking-tight mb-4 ${dark ? "" : "text-navy dark:text-white"}`}>{str(d.heading)}</h2>
        {str(d.text) && <p className={`text-lg mb-10 max-w-xl mx-auto leading-relaxed ${dark ? "text-white/50" : "text-slate"}`}>{str(d.text)}</p>}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {primary.label && primary.href && (
            <Link
              href={primary.href}
              className={
                dark
                  ? "bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-4 rounded transition-colors"
                  : "bg-navy dark:bg-gold text-white dark:text-navy font-semibold px-8 py-4 rounded transition-colors hover:bg-navy-light dark:hover:bg-gold-light"
              }
            >
              {primary.label}
            </Link>
          )}
          {bool(d.showPhone, true) && (
            <PhoneLink
              href={telHref(b.phoneE164, b.phone)}
              className={
                dark
                  ? "border border-white/20 hover:border-white/40 text-white font-semibold px-8 py-4 rounded transition-colors"
                  : "border border-border hover:border-navy dark:hover:border-gold text-navy dark:text-white font-semibold px-8 py-4 rounded transition-colors"
              }
            >
              Call {b.phone}
            </PhoneLink>
          )}
        </div>
      </div>
    </section>
  );
}

function ContactFormSection({ d, content }: { d: D; content: SiteContent }) {
  const b = content.business;
  return (
    <ContactForm
      serviceOptions={strList(d.serviceOptions)}
      expectations={strList(d.expectations)}
      successMessage={str(d.successMessage) || "Message received! We'll get back to you within 24 hours."}
      recipient={b.formRecipient}
      phone={b.phone}
      telHref={telHref(b.phoneE164, b.phone)}
      city={b.city}
      region={b.region}
      serviceAreaSummary={b.serviceAreaSummary}
      license={b.license}
      licenseIssuer={b.licenseIssuer}
    />
  );
}

function CareersPositions({ d, content }: { d: D; content: SiteContent }) {
  return (
    <CareersSection
      positions={content.positions}
      eyebrow={str(d.eyebrow)}
      heading={str(d.heading)}
      applyEyebrow={str(d.applyEyebrow)}
      applyHeading={str(d.applyHeading)}
      applyText={str(d.applyText)}
      applyNote={str(d.applyNote)}
      recipient={content.business.formRecipient}
      phone={content.business.phone}
    />
  );
}

function CareersPerks({ d }: { d: D }) {
  const list = items(d.items);
  if (!list.length) return null;
  return (
    <section className="border-t border-border bg-warm-gray dark:bg-navy-light py-14 md:py-20">
      <div className={CONTAINER}>
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {list.map((it, i) => (
            <div key={i}>
              <h3 className="text-lg font-bold text-navy dark:text-white mb-3">{str(it.title)}</h3>
              <p className="text-navy/70 dark:text-white/60 leading-relaxed">{str(it.text)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- renderer ----------

export function renderSection(section: Section, ctx: Ctx) {
  const d = section.data;
  const { content, index } = ctx;
  switch (section.type) {
    case "hero":
      return <Hero d={d} />;
    case "page-header":
      return <PageHeader d={d} index={index} />;
    case "stats":
      return <Stats d={d} />;
    case "services-grid":
      return <ServicesGrid d={d} content={content} />;
    case "services-detail":
      return <ServicesDetail d={d} content={content} />;
    case "featured-project":
      return <FeaturedProject d={d} content={content} />;
    case "feature-cards":
      return <FeatureCards d={d} />;
    case "image-text":
      return <ImageText d={d} />;
    case "rich-text":
      return <RichText d={d} />;
    case "testimonial-spotlight":
      return <TestimonialSpotlight d={d} content={content} />;
    case "testimonials-grid":
      return <TestimonialsGrid d={d} content={content} />;
    case "projects-list":
      return <ProjectsList d={d} content={content} />;
    case "videos-grid":
      return <VideosGrid d={d} content={content} />;
    case "video-embed":
      return <VideoEmbed d={d} content={content} />;
    case "gallery":
      return <GallerySection d={d} />;
    case "process-steps":
      return <ProcessSteps d={d} />;
    case "timeline":
      return <Timeline d={d} />;
    case "faq":
      return <Faq d={d} content={content} />;
    case "cta":
      return <Cta d={d} content={content} />;
    case "contact-form":
      return <ContactFormSection d={d} content={content} />;
    case "careers-positions":
      return <CareersPositions d={d} content={content} />;
    case "careers-perks":
      return <CareersPerks d={d} />;
    default:
      return null;
  }
}

export default function SectionRenderer({ page, content }: { page: Page; content: SiteContent }) {
  const visible = page.sections.filter((s) => s.visible);
  return (
    <>
      {visible.map((section, index) => (
        <div key={section.id} id={`s-${section.id}`}>
          {renderSection(section, { content, page, index })}
        </div>
      ))}
    </>
  );
}
