import { promises as fs } from "node:fs";
import path from "node:path";
import type { StorageProvider, ContentVersion } from "./types";
import { uploadPath } from "./types";

// Development provider: content lives in ./content/site.json, versions in
// ./content/versions/, uploads in ./public/uploads/. Not for production
// (Vercel's filesystem is read-only at runtime).

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content");
const CONTENT_FILE = path.join(CONTENT_DIR, "site.json");
const VERSIONS_DIR = path.join(CONTENT_DIR, "versions");
const UPLOAD_DIR = path.join(ROOT, "public");
const KEEP_VERSIONS = 30;

async function ensureDirs() {
  await fs.mkdir(VERSIONS_DIR, { recursive: true });
}

export const localProvider: StorageProvider = {
  name: "local",

  async readContent() {
    try {
      const raw = await fs.readFile(CONTENT_FILE, "utf8");
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  async writeContent(content) {
    await ensureDirs();
    const json = JSON.stringify(content, null, 2);
    // Keep the previous version before overwriting.
    try {
      const prev = await fs.readFile(CONTENT_FILE, "utf8");
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      await fs.writeFile(path.join(VERSIONS_DIR, `${stamp}.json`), prev, "utf8");
    } catch {
      // no previous version
    }
    await fs.writeFile(CONTENT_FILE, json, "utf8");
    // prune
    const files = (await fs.readdir(VERSIONS_DIR)).filter((f) => f.endsWith(".json")).sort();
    const extra = files.slice(0, Math.max(0, files.length - KEEP_VERSIONS));
    await Promise.all(extra.map((f) => fs.unlink(path.join(VERSIONS_DIR, f)).catch(() => {})));
  },

  async listVersions(limit = 30): Promise<ContentVersion[]> {
    await ensureDirs();
    const files = (await fs.readdir(VERSIONS_DIR)).filter((f) => f.endsWith(".json")).sort().reverse();
    const out: ContentVersion[] = [];
    for (const f of files.slice(0, limit)) {
      const st = await fs.stat(path.join(VERSIONS_DIR, f));
      out.push({
        id: f,
        savedAt: st.mtime.toISOString(),
        size: st.size,
      });
    }
    return out;
  },

  async readVersion(id) {
    const safe = path.basename(id);
    try {
      return JSON.parse(await fs.readFile(path.join(VERSIONS_DIR, safe), "utf8"));
    } catch {
      return null;
    }
  },

  async planUpload() {
    return { mode: "direct" };
  },

  async storeFile({ filename, data }) {
    const rel = uploadPath(filename);
    const abs = path.join(UPLOAD_DIR, rel);
    await fs.mkdir(path.dirname(abs), { recursive: true });
    await fs.writeFile(abs, data);
    return { url: `/${rel}` };
  },

  async deleteFile(url) {
    if (!url.startsWith("/uploads/")) return;
    const abs = path.join(UPLOAD_DIR, url.replace(/^\//, ""));
    await fs.unlink(abs).catch(() => {});
  },
};
