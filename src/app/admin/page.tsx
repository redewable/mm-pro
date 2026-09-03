import Link from "next/link";
import { readContentUncached } from "@/lib/content/server";
import { providerStatus } from "@/lib/storage";
import { isAuthConfigured } from "@/lib/auth";
import { STATUS_LABEL, videoThumbnail } from "@/lib/content/helpers";
import SmartImage from "@/components/SmartImage";
import Icon from "@/components/Icon";
import type { IconName } from "@/lib/content/types";

export default async function AdminHome() {
  const c = await readContentUncached();
  const provider = providerStatus();
  const authOk = isAuthConfigured() || Boolean(c.auth.passwordHash);
  const recentProjects = [...c.projects].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 6);
  const recentVideos = [...c.videos].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 3);

  const tiles: { label: string; count: number; href: string; icon: IconName; tone: string }[] = [
    { label: "Projects", count: c.projects.length, href: "/admin/projects", icon: "building", tone: "bg-amber-50 text-amber-700" },
    { label: "Videos", count: c.videos.length, href: "/admin/videos", icon: "video", tone: "bg-red-50 text-red-700" },
    { label: "Photos", count: c.media.filter((m) => m.kind === "image").length, href: "/admin/media", icon: "camera", tone: "bg-green-50 text-green-700" },
    { label: "Reviews", count: c.testimonials.length, href: "/admin/testimonials", icon: "heart", tone: "bg-pink-50 text-pink-700" },
    { label: "Services", count: c.services.length, href: "/admin/services", icon: "wrench", tone: "bg-blue-50 text-blue-700" },
    { label: "Jobs", count: c.positions.length, href: "/admin/careers", icon: "users", tone: "bg-indigo-50 text-indigo-700" },
    { label: "Pages", count: Object.keys(c.pages).length, href: "/admin/pages", icon: "layout", tone: "bg-purple-50 text-purple-700" },
    { label: "SEO & Ads", count: [c.tracking.ga4MeasurementId, c.tracking.googleAdsId, c.tracking.gtmContainerId].filter(Boolean).length, href: "/admin/seo", icon: "eye", tone: "bg-gray-100 text-gray-700" },
  ];

  const alerts: { text: string; href: string }[] = [];
  if (provider.warn) alerts.push({ text: "Storage not connected — attach Vercel Blob and redeploy", href: "/admin/history" });
  if (!authOk) alerts.push({ text: "Set a dashboard password", href: "/admin/account" });
  if (!c.tracking.ga4MeasurementId && !c.tracking.googleAdsId) alerts.push({ text: "Connect Google Ads / Analytics", href: "/admin/seo" });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-5 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-navy tracking-tight">Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/admin/quick" className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-navy font-semibold text-sm px-4 py-2.5 rounded-lg">
            <Icon name="camera" className="w-4 h-4" /> Quick add photos / video
          </Link>
          <Link href="/admin/projects/new" className="hidden sm:inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold text-sm px-4 py-2.5 rounded-lg">
            <Icon name="building" className="w-4 h-4" /> New project
          </Link>
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {alerts.map((a) => (
            <Link key={a.text} href={a.href} className="inline-flex items-center gap-2 text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 rounded-full px-3 py-1.5 hover:bg-amber-100">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> {a.text}
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {tiles.map((t) => (
          <Link key={t.label} href={t.href} className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-gold hover:shadow-sm transition-all flex items-center gap-3">
            <span className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${t.tone}`}>
              <Icon name={t.icon} className="w-6 h-6" />
            </span>
            <span className="min-w-0">
              <span className="block text-2xl font-bold text-navy leading-none">{t.count}</span>
              <span className="block text-xs font-semibold text-slate mt-1 truncate">{t.label}</span>
            </span>
          </Link>
        ))}
      </div>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-navy">Projects</h2>
          <Link href="/admin/projects" className="text-sm font-semibold text-navy hover:text-gold">All →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {recentProjects.map((p) => (
            <Link key={p.id} href={`/admin/projects/${p.id}`} className="group block">
              <span className="relative block aspect-[4/3] rounded-lg overflow-hidden bg-gray-200 border border-gray-200 group-hover:border-gold">
                {p.cover.url && <SmartImage src={p.cover.url} alt="" fill sizes="200px" className="object-cover group-hover:scale-[1.03] transition-transform" />}
              </span>
              <span className="block text-xs font-semibold text-navy mt-2 truncate">{p.title}</span>
              <span className={`block text-[11px] font-medium mt-0.5 ${p.status === "completed" ? "text-green-700" : p.status === "in-progress" ? "text-blue-700" : "text-amber-700"}`}>{STATUS_LABEL[p.status]}</span>
            </Link>
          ))}
          <Link href="/admin/projects/new" className="aspect-[4/3] rounded-lg border-2 border-dashed border-gray-300 hover:border-gold flex flex-col items-center justify-center text-slate hover:text-navy">
            <span className="text-2xl leading-none">+</span>
            <span className="text-xs font-semibold mt-1">New</span>
          </Link>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-navy">Videos</h2>
          <Link href="/admin/videos" className="text-sm font-semibold text-navy hover:text-gold">All →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {recentVideos.map((v) => {
            const thumb = videoThumbnail(v);
            return (
              <Link key={v.id} href={`/admin/videos/${v.id}`} className="group block">
                <span className="relative block aspect-video rounded-lg overflow-hidden bg-navy border border-gray-200 group-hover:border-gold">
                  {thumb && <SmartImage src={thumb} alt="" fill sizes="240px" className="object-cover" />}
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="w-9 h-9 rounded-full bg-gold text-navy flex items-center justify-center">
                      <svg className="w-4 h-4 ml-0.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
                    </span>
                  </span>
                </span>
                <span className="block text-xs font-semibold text-navy mt-1.5 truncate">{v.title}</span>
              </Link>
            );
          })}
          <Link href="/admin/videos/new" className="aspect-video rounded-lg border-2 border-dashed border-gray-300 hover:border-gold flex flex-col items-center justify-center text-slate hover:text-navy">
            <span className="text-2xl leading-none">+</span>
            <span className="text-xs font-semibold mt-1">Add video</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
