import "server-only";
import { unstable_cache, revalidateTag, revalidatePath } from "next/cache";
import { getStorage } from "@/lib/storage";
import { normalizeContent } from "./normalize";
import { DEFAULT_CONTENT } from "./defaults";
import type { SiteContent } from "./types";

export const CONTENT_TAG = "site-content";

// Uncached read straight from the provider (used by the dashboard so the
// owner always edits the latest copy).
export async function readContentUncached(): Promise<SiteContent> {
  try {
    const storage = await getStorage();
    const raw = await storage.readContent();
    return normalizeContent(raw ?? DEFAULT_CONTENT);
  } catch (err) {
    console.error("[content] read failed, using defaults:", err);
    return normalizeContent(DEFAULT_CONTENT);
  }
}

// Cached read for public pages. Invalidated on every save.
export const getSiteContent = unstable_cache(
  async () => readContentUncached(),
  ["site-content-v2"],
  { tags: [CONTENT_TAG] }
);

export async function writeContent(next: SiteContent): Promise<SiteContent> {
  const storage = await getStorage();
  const stamped: SiteContent = { ...next, updatedAt: new Date().toISOString() };
  await storage.writeContent(stamped);
  revalidateAll();
  return stamped;
}

export function revalidateAll() {
  revalidateTag(CONTENT_TAG, { expire: 0 });
  revalidatePath("/", "layout");
}

// Read-modify-write helper so concurrent edits to different collections don't
// clobber each other.
export async function mutateContent(
  fn: (current: SiteContent) => SiteContent | Promise<SiteContent>
): Promise<SiteContent> {
  const current = await readContentUncached();
  const next = await fn(structuredClone(current));
  return writeContent(next);
}
