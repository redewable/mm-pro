import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSiteContent } from "@/lib/content/server";
import { findProject, projectVideos, publishedProjects, telHref } from "@/lib/content/helpers";
import { absoluteUrl, breadcrumbJsonLd, projectJsonLd } from "@/lib/seo";
import SmartImage from "@/components/SmartImage";
import Gallery from "@/components/Gallery";
import VideoPlayer from "@/components/VideoPlayer";
import BeforeAfter from "@/components/BeforeAfter";
import JsonLd from "@/components/JsonLd";
import PhoneLink from "@/components/PhoneLink";
import { Eyebrow, ProjectCard, StatusBadge } from "@/components/sections";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const c = await getSiteContent();
  return publishedProjects(c).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const c = await getSiteContent();
  const p = findProject(c, slug);
  if (!p || !p.published) return {};
  const title = p.seoTitle || `${p.title} — ${p.category} Project`;
  const description = p.seoDescription || p.summary || p.description.slice(0, 160);
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(c, `/portfolio/${p.slug}`) },
    openGraph: {
      title: `${title} | ${c.business.name}`,
      description,
      url: absoluteUrl(c, `/portfolio/${p.slug}`),
      type: "article",
      ...(p.cover.url ? { images: [{ url: absoluteUrl(c, p.cover.url), alt: p.cover.alt }] } : {}),
    },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const c = await getSiteContent();
  const p = findProject(c, slug);
  if (!p || !p.published) notFound();
  const videos = projectVideos(c, p);
  const related = publishedProjects(c)
    .filter((x) => x.id !== p.id && (x.category === p.category || x.featured))
    .slice(0, 3);
  const b = c.business;
  const gallery = [p.cover, ...p.gallery].filter((i) => i.url);
  const pairs = (p.beforeAfter ?? []).filter((x) => x.before.url && x.after.url);
  const updates = [...(p.updates ?? [])].sort((a, b2) => (b2.date || "").localeCompare(a.date || ""));
  const videoById = new Map(c.videos.map((v) => [v.id, v]));
  const fmtDate = (d: string) => {
    const t = Date.parse(d);
    return Number.isNaN(t) ? d : new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <>
      <JsonLd
        data={[
          projectJsonLd(c, p, videos),
          breadcrumbJsonLd(c, [
            { name: "Home", path: "/" },
            { name: "Portfolio", path: "/portfolio" },
            { name: p.title, path: `/portfolio/${p.slug}` },
          ]),
        ]}
      />

      <section className="pt-10 md:pt-14 lg:pt-20 pb-10 md:pb-14">
        <div className="max-w-7xl mx-auto px-5 sm:px-6">
          <nav aria-label="Breadcrumb" className="text-sm text-slate mb-8">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-gold">Home</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/portfolio" className="hover:text-gold">Portfolio</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-navy dark:text-white font-medium">{p.title}</li>
            </ol>
          </nav>
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-5">
              <span className="text-xs font-semibold text-gold bg-gold/10 px-3 py-1 rounded-full">{p.category}</span>
              <StatusBadge status={p.status} />
              {p.location && <span className="text-xs text-slate">{p.location}</span>}
              {p.completedAt && <span className="text-xs text-slate">Completed {p.completedAt}</span>}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy dark:text-white tracking-tight leading-[1.15] mb-5">{p.title}</h1>
            <p className="text-slate text-lg leading-relaxed">{p.summary || p.description}</p>
          </div>
        </div>
      </section>

      {p.cover.url && (
        <section className="max-w-7xl mx-auto px-5 sm:px-6 mb-12 md:mb-16">
          <div className="relative rounded-lg overflow-hidden aspect-[16/9] bg-warm-gray dark:bg-navy-light">
            <SmartImage src={p.cover.url} alt={p.cover.alt} fill sizes="(max-width: 1280px) 100vw, 1280px" className="object-cover" priority />
          </div>
        </section>
      )}

      <section className="pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 grid lg:grid-cols-3 gap-10 lg:gap-16">
          <div className="lg:col-span-2 space-y-12">
            {p.description && (
              <div>
                <Eyebrow text="About This Project" />
                <div className="text-slate leading-relaxed space-y-4">
                  {p.description.split(/\n\s*\n/).map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>
            )}

            {videos.length > 0 && (
              <div>
                <Eyebrow text={videos.length > 1 ? "Project Videos" : "Project Video"} />
                <div className="space-y-6">
                  {videos.map((v) => (
                    <div key={v.id}>
                      <VideoPlayer video={v} />
                      <p className="text-sm text-slate mt-3">
                        <Link href={`/videos/${v.slug}`} className="font-semibold text-navy dark:text-gold hover:text-gold">
                          {v.title}
                        </Link>
                        {v.description ? ` — ${v.description}` : ""}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pairs.length > 0 && (
              <div>
                <Eyebrow text="Before & After" />
                <div className={`grid gap-6 ${pairs.length > 1 ? "md:grid-cols-2" : ""}`}>
                  {pairs.map((pair) => (
                    <BeforeAfter key={pair.id} pair={pair} />
                  ))}
                </div>
              </div>
            )}

            {gallery.length > 1 && (
              <div>
                <Eyebrow text="Photos" />
                <Gallery images={gallery} columns={3} />
              </div>
            )}

            {updates.length > 0 && (
              <div>
                <Eyebrow text="Progress Updates" />
                <ol className="relative border-l border-border ml-1.5 space-y-8">
                  {updates.map((u) => {
                    const uv = u.videoId ? videoById.get(u.videoId) : undefined;
                    return (
                      <li key={u.id} className="pl-6">
                        <span className="absolute -left-1.5 mt-1.5 w-3 h-3 rounded-full bg-gold" />
                        <p className="text-xs font-bold text-gold uppercase tracking-widest">{fmtDate(u.date)}</p>
                        {u.title && <h3 className="text-lg font-bold text-navy dark:text-white mt-1">{u.title}</h3>}
                        {u.text && <p className="text-slate leading-relaxed mt-1.5">{u.text}</p>}
                        {uv && uv.published && (
                          <div className="mt-4 max-w-xl">
                            <VideoPlayer video={uv} />
                          </div>
                        )}
                        {u.images.length > 0 && (
                          <div className="mt-4">
                            <Gallery images={u.images} columns={u.images.length === 1 ? 2 : 3} />
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-32 self-start">
            {p.scope.length > 0 && (
              <div className="bg-warm-gray dark:bg-navy-light border border-border rounded-lg p-6 sm:p-8">
                <p className="text-xs font-semibold text-navy/40 dark:text-white/30 uppercase tracking-widest mb-4">Project Scope</p>
                <ul className="space-y-2.5">
                  {p.scope.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-gold rounded-full flex-shrink-0 mt-2" />
                      <span className="text-navy/80 dark:text-white/70 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="bg-navy text-white rounded-lg p-6 sm:p-8">
              <p className="text-lg font-bold mb-2">Want something like this?</p>
              <p className="text-white/60 text-sm leading-relaxed mb-6">Same-day response. Detailed estimate in 24–48 hours.</p>
              <div className="flex flex-col gap-3">
                <Link href="/contact" className="bg-gold hover:bg-gold-light text-navy font-semibold px-6 py-3 rounded text-center transition-colors">
                  Request a Free Estimate
                </Link>
                <PhoneLink href={telHref(b.phoneE164, b.phone)} className="border border-white/20 hover:border-white/40 text-white font-semibold px-6 py-3 rounded text-center transition-colors">
                  Call {b.phone}
                </PhoneLink>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-border bg-warm-gray dark:bg-navy-light py-14 md:py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-6">
            <div className="flex items-end justify-between gap-4 mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-navy dark:text-white tracking-tight">More Projects</h2>
              <Link href="/portfolio" className="text-sm font-semibold text-navy dark:text-gold hover:text-gold whitespace-nowrap">
                View all →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {related.map((r) => (
                <ProjectCard key={r.id} project={r} videoCount={projectVideos(c, r).length} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
