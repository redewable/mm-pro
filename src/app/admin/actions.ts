"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  createSessionToken,
  hashPassword,
  sessionCookieOptions,
  verifyPassword,
} from "@/lib/auth";
import { requireAdmin } from "@/lib/admin-session";
import { mutateContent, readContentUncached, writeContent, revalidateAll } from "@/lib/content/server";
import { normalizeContent } from "@/lib/content/normalize";
import { getStorage } from "@/lib/storage";
import type { ContentCollectionKey, ImageRef, MediaItem, Page, Project, ProjectStatus, SiteContent, Video } from "@/lib/content/types";
import { newId, slugify, uniqueSlug, todayIso, nowIso } from "@/lib/ids";

export type ActionResult<T = undefined> =
  | { ok: true; data?: T; savedAt: string }
  | { ok: false; error: string };

function fail(err: unknown): ActionResult<never> {
  const message = err instanceof Error ? err.message : "Something went wrong.";
  console.error("[admin action]", err);
  return { ok: false, error: message };
}

// ---------- auth ----------

const attempts = new Map<string, { count: number; until: number }>();

export async function loginAction(
  _prev: { error: string } | undefined,
  formData: FormData
): Promise<{ error: string }> {
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");
  const key = "global";
  const now = Date.now();
  const a = attempts.get(key);
  if (a && a.count >= 8 && a.until > now) {
    return { error: "Too many attempts. Try again in a few minutes." };
  }
  const content = await readContentUncached();
  const ok = await verifyPassword(password, content.auth);
  if (!ok) {
    const count = (a && a.until > now ? a.count : 0) + 1;
    attempts.set(key, { count, until: now + 10 * 60 * 1000 });
    return { error: "Incorrect password." };
  }
  attempts.delete(key);
  const token = await createSessionToken();
  const store = await cookies();
  store.set(SESSION_COOKIE, token, sessionCookieOptions());
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/admin/login");
}

export async function changePasswordAction(
  current: string,
  next: string
): Promise<ActionResult> {
  try {
    await requireAdmin();
    if (next.length < 8) return { ok: false, error: "New password must be at least 8 characters." };
    const content = await readContentUncached();
    if (!(await verifyPassword(current, content.auth))) {
      return { ok: false, error: "Current password is incorrect." };
    }
    const { hash, salt } = await hashPassword(next);
    const saved = await mutateContent((c) => ({
      ...c,
      auth: { passwordHash: hash, passwordSalt: salt },
    }));
    return { ok: true, savedAt: saved.updatedAt };
  } catch (err) {
    return fail(err);
  }
}

// ---------- content ----------

export async function getContentAction(): Promise<SiteContent> {
  await requireAdmin();
  return readContentUncached();
}

export async function saveCollectionAction<K extends ContentCollectionKey>(
  key: K,
  value: SiteContent[K]
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const saved = await mutateContent((c) => normalizeContent({ ...c, [key]: value }));
    return { ok: true, savedAt: saved.updatedAt };
  } catch (err) {
    return fail(err);
  }
}

export async function savePageAction(slug: string, page: Page): Promise<ActionResult> {
  try {
    await requireAdmin();
    const saved = await mutateContent((c) =>
      normalizeContent({ ...c, pages: { ...c.pages, [slug]: { ...page, slug } } })
    );
    return { ok: true, savedAt: saved.updatedAt };
  } catch (err) {
    return fail(err);
  }
}

export async function saveAllAction(content: SiteContent): Promise<ActionResult> {
  try {
    await requireAdmin();
    const current = await readContentUncached();
    const saved = await writeContent(normalizeContent({ ...content, auth: current.auth }));
    return { ok: true, savedAt: saved.updatedAt };
  } catch (err) {
    return fail(err);
  }
}

// ---------- quick add (one screen from the phone) ----------

export interface QuickAddInput {
  projectId: string; // existing id, or "" to create
  newProject?: { title: string; category: string; status: ProjectStatus };
  note: { title: string; text: string; date: string };
  images: ImageRef[];
  videos: { url: string; poster?: ImageRef; durationSeconds?: number; name: string }[];
  setCover: boolean;
}

export async function quickAddAction(input: QuickAddInput): Promise<ActionResult<{ projectId: string; slug: string }>> {
  try {
    await requireAdmin();
    let projectId = input.projectId;
    let slug = "";
    const saved = await mutateContent((c) => {
      let project = c.projects.find((p) => p.id === projectId);
      if (!project) {
        const np = input.newProject;
        if (!np?.title) throw new Error("Pick a project or give the new one a name.");
        project = {
          id: newId("prj"),
          slug: uniqueSlug(np.title, c.projects.map((p) => p.slug)),
          title: np.title,
          category: np.category || "Project",
          status: np.status || "in-progress",
          summary: "",
          description: input.note.text,
          scope: [],
          cover: { url: "", alt: "" },
          gallery: [],
          videoIds: [],
          updates: [],
          beforeAfter: [],
          featured: false,
          published: true,
          createdAt: nowIso(),
          updatedAt: nowIso(),
        };
        c.projects = [project, ...c.projects];
        projectId = project.id;
      }
      // Videos become Video entries linked to the project.
      const newVideos: Video[] = input.videos.map((v, i) => ({
        id: newId("vid"),
        slug: uniqueSlug(`${project!.title} ${input.note.title || "walkthrough"} ${i ? i + 1 : ""}`.trim(), c.videos.map((x) => x.slug)),
        title: input.note.title ? `${input.note.title} — ${project!.title}` : `${project!.title} walkthrough`,
        description: input.note.text,
        source: "upload",
        url: v.url,
        poster: v.poster,
        projectId: project!.id,
        category: project!.category,
        featured: false,
        published: true,
        publishedAt: input.note.date || todayIso(),
        durationSeconds: v.durationSeconds,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      }));
      c.videos = [...newVideos, ...c.videos];

      const images = input.images.filter((i) => i.url);
      const cover = !project.cover.url || input.setCover ? images[0] ?? project.cover : project.cover;
      const gallery = [...project.gallery, ...images.filter((i) => i.url !== cover.url && !project!.gallery.some((g) => g.url === i.url))];
      const hasNote = Boolean(input.note.title || input.note.text || images.length || newVideos.length);
      const updates = hasNote
        ? [
            ...project.updates,
            {
              id: newId("upd"),
              date: input.note.date || todayIso(),
              title: input.note.title || (newVideos.length ? "New video" : "New photos"),
              text: input.note.text,
              images,
              ...(newVideos[0] ? { videoId: newVideos[0].id } : {}),
            },
          ]
        : project.updates;
      const next: Project = {
        ...project,
        cover,
        gallery,
        updates,
        videoIds: [...project.videoIds, ...newVideos.map((v) => v.id)],
        updatedAt: nowIso(),
      };
      slug = next.slug || slugify(next.title);
      c.projects = c.projects.map((p) => (p.id === next.id ? next : p));
      return c;
    });
    return { ok: true, data: { projectId, slug }, savedAt: saved.updatedAt };
  } catch (err) {
    return fail(err);
  }
}

// ---------- media ----------

export async function registerMediaAction(items: MediaItem[]): Promise<ActionResult<MediaItem[]>> {
  try {
    await requireAdmin();
    const saved = await mutateContent((c) => ({
      ...c,
      media: [...items, ...c.media.filter((m) => !items.some((i) => i.id === m.id || i.url === m.url))],
    }));
    return { ok: true, data: saved.media, savedAt: saved.updatedAt };
  } catch (err) {
    return fail(err);
  }
}

export async function updateMediaAction(item: MediaItem): Promise<ActionResult> {
  try {
    await requireAdmin();
    const saved = await mutateContent((c) => ({
      ...c,
      media: c.media.map((m) => (m.id === item.id ? { ...m, ...item } : m)),
    }));
    return { ok: true, savedAt: saved.updatedAt };
  } catch (err) {
    return fail(err);
  }
}

export async function deleteMediaAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const content = await readContentUncached();
    const item = content.media.find((m) => m.id === id);
    if (!item) return { ok: false, error: "File not found." };
    // Only delete the file itself when it lives in the storage provider (not
    // the built-in /public assets).
    if (!item.url.startsWith("/") || item.url.startsWith("/uploads/")) {
      const storage = await getStorage();
      await storage.deleteFile(item.url).catch((e) => console.warn("deleteFile", e));
    }
    const saved = await mutateContent((c) => ({ ...c, media: c.media.filter((m) => m.id !== id) }));
    return { ok: true, savedAt: saved.updatedAt };
  } catch (err) {
    return fail(err);
  }
}

// ---------- versions ----------

export async function listVersionsAction() {
  await requireAdmin();
  const storage = await getStorage();
  return storage.listVersions(30);
}

export async function restoreVersionAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const storage = await getStorage();
    const raw = await storage.readVersion(id);
    if (!raw) return { ok: false, error: "That version could not be read." };
    const current = await readContentUncached();
    const restored = normalizeContent(raw);
    const saved = await writeContent({ ...restored, auth: current.auth });
    return { ok: true, savedAt: saved.updatedAt };
  } catch (err) {
    return fail(err);
  }
}

export async function revalidateSiteAction(): Promise<ActionResult> {
  try {
    await requireAdmin();
    revalidateAll();
    return { ok: true, savedAt: new Date().toISOString() };
  } catch (err) {
    return fail(err);
  }
}
