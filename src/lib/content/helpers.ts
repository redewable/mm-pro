// Pure helpers usable on both server and client.
import type {
  SiteContent,
  Project,
  Video,
  Testimonial,
  Service,
  ProjectStatus,
} from "./types";

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  planned: "Upcoming",
  "in-progress": "In Progress",
  completed: "Completed",
};

export const STATUS_ORDER: ProjectStatus[] = ["in-progress", "planned", "completed"];

export function publishedProjects(c: SiteContent): Project[] {
  return c.projects.filter((p) => p.published);
}
export function publishedVideos(c: SiteContent): Video[] {
  return c.videos.filter((v) => v.published);
}
export function publishedTestimonials(c: SiteContent): Testimonial[] {
  return c.testimonials.filter((t) => t.published);
}
export function publishedServices(c: SiteContent): Service[] {
  return c.services.filter((s) => s.published);
}

export function findProject(c: SiteContent, idOrSlug: string): Project | undefined {
  return c.projects.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
}
export function findVideo(c: SiteContent, idOrSlug: string): Video | undefined {
  return c.videos.find((v) => v.id === idOrSlug || v.slug === idOrSlug);
}

export function projectVideos(c: SiteContent, p: Project): Video[] {
  const byId = new Map(c.videos.map((v) => [v.id, v]));
  const fromProject = p.videoIds.map((id) => byId.get(id)).filter((v): v is Video => !!v);
  const linked = c.videos.filter((v) => v.projectId === p.id && !p.videoIds.includes(v.id));
  return [...fromProject, ...linked].filter((v) => v.published);
}

// ---------- Video embeds ----------

export interface VideoEmbed {
  kind: "file" | "iframe";
  src: string;
  title: string;
}

export function youtubeId(url: string): string | null {
  const m =
    url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{6,})/) ||
    url.match(/[?&]v=([\w-]{6,})/);
  return m ? m[1] : null;
}
export function vimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? m[1] : null;
}

export function detectVideoSource(url: string): Video["source"] {
  if (/youtu\.?be/.test(url)) return "youtube";
  if (/vimeo\.com/.test(url)) return "vimeo";
  if (/facebook\.com|fb\.watch/.test(url)) return "facebook";
  if (/\.(mp4|webm|mov|m4v)(\?|$)/i.test(url)) return "upload";
  return "url";
}

export function videoEmbed(v: Video): VideoEmbed {
  switch (v.source) {
    case "youtube": {
      const id = youtubeId(v.url);
      return {
        kind: "iframe",
        src: id
          ? `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`
          : v.url,
        title: v.title,
      };
    }
    case "vimeo": {
      const id = vimeoId(v.url);
      return {
        kind: "iframe",
        src: id ? `https://player.vimeo.com/video/${id}?dnt=1` : v.url,
        title: v.title,
      };
    }
    case "facebook":
      return {
        kind: "iframe",
        src: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
          v.url
        )}&show_text=false`,
        title: v.title,
      };
    case "upload":
    case "url":
    default:
      return { kind: "file", src: v.url, title: v.title };
  }
}

export function videoThumbnail(v: Video): string {
  if (v.poster?.url) return v.poster.url;
  if (v.source === "youtube") {
    const id = youtubeId(v.url);
    if (id) return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  }
  return "";
}

export function formatDuration(seconds?: number): string {
  if (!seconds || !Number.isFinite(seconds)) return "";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function telHref(phoneE164: string, fallback: string): string {
  const digits = (phoneE164 || fallback).replace(/[^\d+]/g, "");
  return `tel:${digits}`;
}

export function paragraphs(body: string): { type: "p" | "ul"; lines: string[] }[] {
  const blocks = body.replace(/\r/g, "").split(/\n\s*\n/);
  const out: { type: "p" | "ul"; lines: string[] }[] = [];
  for (const block of blocks) {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    if (!lines.length) continue;
    if (lines.every((l) => l.startsWith("- ") || l.startsWith("• "))) {
      out.push({ type: "ul", lines: lines.map((l) => l.slice(2).trim()) });
    } else {
      out.push({ type: "p", lines: [lines.join(" ")] });
    }
  }
  return out;
}

export function isExternalUrl(href: string): boolean {
  return /^(https?:)?\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");
}
