import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSiteContent } from "@/lib/content/server";
import { findProject, findVideo, publishedVideos, videoThumbnail, telHref } from "@/lib/content/helpers";
import { absoluteUrl, breadcrumbJsonLd, videoJsonLd } from "@/lib/seo";
import VideoPlayer from "@/components/VideoPlayer";
import JsonLd from "@/components/JsonLd";
import PhoneLink from "@/components/PhoneLink";
import { Eyebrow, ProjectCard, VideoCard } from "@/components/sections";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const c = await getSiteContent();
  return publishedVideos(c).map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const c = await getSiteContent();
  const v = findVideo(c, slug);
  if (!v || !v.published) return {};
  const thumb = videoThumbnail(v);
  const description = v.description || `${v.title} — project video by ${c.business.name}.`;
  return {
    title: v.title,
    description,
    alternates: { canonical: absoluteUrl(c, `/videos/${v.slug}`) },
    openGraph: {
      title: `${v.title} | ${c.business.name}`,
      description,
      url: absoluteUrl(c, `/videos/${v.slug}`),
      type: "video.other",
      ...(thumb ? { images: [{ url: absoluteUrl(c, thumb) }] } : {}),
    },
    ...(thumb ? { twitter: { card: "summary_large_image", images: [absoluteUrl(c, thumb)] } } : {}),
  };
}

export default async function VideoPage({ params }: Params) {
  const { slug } = await params;
  const c = await getSiteContent();
  const v = findVideo(c, slug);
  if (!v || !v.published) notFound();
  const project = v.projectId ? findProject(c, v.projectId) : undefined;
  const more = publishedVideos(c).filter((x) => x.id !== v.id).slice(0, 3);
  const b = c.business;

  return (
    <>
      <JsonLd
        data={[
          videoJsonLd(c, v),
          breadcrumbJsonLd(c, [
            { name: "Home", path: "/" },
            { name: "Videos", path: "/videos" },
            { name: v.title, path: `/videos/${v.slug}` },
          ]),
        ]}
      />
      <section className="pt-10 md:pt-14 lg:pt-20 pb-14 md:pb-20">
        <div className="max-w-5xl mx-auto px-5 sm:px-6">
          <nav aria-label="Breadcrumb" className="text-sm text-slate mb-8">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-gold">Home</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/videos" className="hover:text-gold">Videos</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-navy dark:text-white font-medium">{v.title}</li>
            </ol>
          </nav>
          <VideoPlayer video={v} className="shadow-lg" />
          <div className="mt-8 md:mt-10 grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {(v.category || project) && <Eyebrow text={v.category || project?.category || ""} />}
              <h1 className="text-3xl md:text-4xl font-bold text-navy dark:text-white tracking-tight mb-4">{v.title}</h1>
              {v.description && <p className="text-slate leading-relaxed text-lg">{v.description}</p>}
              {v.publishedAt && <p className="text-xs text-slate mt-4">Published {v.publishedAt}</p>}
            </div>
            <div className="space-y-4">
              {project && (
                <div className="border border-border rounded-lg p-5">
                  <p className="text-xs font-semibold text-navy/40 dark:text-white/30 uppercase tracking-widest mb-2">From the project</p>
                  <Link href={`/portfolio/${project.slug}`} className="font-bold text-navy dark:text-white hover:text-gold transition-colors">
                    {project.title}
                  </Link>
                  <p className="text-slate text-sm mt-1">{project.summary}</p>
                </div>
              )}
              <div className="bg-navy text-white rounded-lg p-5">
                <p className="font-bold mb-3">Ready to start yours?</p>
                <div className="flex flex-col gap-2">
                  <Link href="/contact" className="bg-gold hover:bg-gold-light text-navy font-semibold px-5 py-2.5 rounded text-center text-sm transition-colors">
                    Request a Free Estimate
                  </Link>
                  <PhoneLink href={telHref(b.phoneE164, b.phone)} className="border border-white/20 hover:border-white/40 text-white font-semibold px-5 py-2.5 rounded text-center text-sm transition-colors">
                    Call {b.phone}
                  </PhoneLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {project && (
        <section className="border-t border-border py-14 md:py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            <ProjectCard project={project} videoCount={1} />
          </div>
        </section>
      )}

      {more.length > 0 && (
        <section className="border-t border-border bg-warm-gray dark:bg-navy-light py-14 md:py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-6">
            <div className="flex items-end justify-between gap-4 mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-navy dark:text-white tracking-tight">More Videos</h2>
              <Link href="/videos" className="text-sm font-semibold text-navy dark:text-gold hover:text-gold whitespace-nowrap">
                View all →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {more.map((m) => (
                <VideoCard key={m.id} video={m} project={m.projectId ? findProject(c, m.projectId) : undefined} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
