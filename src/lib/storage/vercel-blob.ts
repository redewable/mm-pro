import { put, get, list, del } from "@vercel/blob";
import type { StorageProvider, ContentVersion } from "./types";

// Vercel Blob provider. Needs BLOB_READ_WRITE_TOKEN (added automatically when
// you attach a Blob store to the project in the Vercel dashboard).
//
// Content JSON is stored as a *private* blob and read with useCache:false so
// edits show up instantly (public blob URLs sit behind a CDN cache). Uploaded
// media is public so <img>/<video> can load it directly.

const CONTENT_PATH = "content/site.json";
const VERSION_PREFIX = "content/versions/";
const KEEP_VERSIONS = 30;

async function readJson(pathname: string): Promise<unknown | null> {
  const res = await get(pathname, { access: "private", useCache: false });
  if (!res || !res.stream) return null;
  const text = await new Response(res.stream).text();
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export const vercelBlobProvider: StorageProvider = {
  name: "vercel-blob",

  async readContent() {
    try {
      return await readJson(CONTENT_PATH);
    } catch (err) {
      // BlobNotFoundError on first run is expected.
      const name = (err as { name?: string })?.name ?? "";
      if (name === "BlobNotFoundError") return null;
      throw err;
    }
  },

  async writeContent(content) {
    const json = JSON.stringify(content);
    // Save previous as a version first (best effort).
    try {
      const prev = await get(CONTENT_PATH, { access: "private", useCache: false });
      if (prev?.stream) {
        const prevText = await new Response(prev.stream).text();
        const stamp = new Date().toISOString().replace(/[:.]/g, "-");
        await put(`${VERSION_PREFIX}${stamp}.json`, prevText, {
          access: "private",
          contentType: "application/json",
          addRandomSuffix: false,
        });
      }
    } catch {
      // nothing to version yet
    }
    await put(CONTENT_PATH, json, {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    // Prune old versions.
    try {
      const { blobs } = await list({ prefix: VERSION_PREFIX, limit: 1000 });
      const sorted = blobs.sort((a, b) => a.pathname.localeCompare(b.pathname));
      const extra = sorted.slice(0, Math.max(0, sorted.length - KEEP_VERSIONS));
      if (extra.length) await del(extra.map((b) => b.url));
    } catch {
      // pruning is best effort
    }
  },

  async listVersions(limit = 30): Promise<ContentVersion[]> {
    const { blobs } = await list({ prefix: VERSION_PREFIX, limit: 1000 });
    return blobs
      .sort((a, b) => b.pathname.localeCompare(a.pathname))
      .slice(0, limit)
      .map((b) => ({
        id: b.pathname,
        savedAt: b.uploadedAt.toISOString(),
        size: b.size,
      }));
  },

  async readVersion(id) {
    if (!id.startsWith(VERSION_PREFIX)) return null;
    return readJson(id);
  },

  async planUpload() {
    return { mode: "vercel-blob" };
  },

  async deleteFile(url) {
    if (!/\.blob\.vercel-storage\.com\//.test(url)) return;
    await del(url);
  },
};
