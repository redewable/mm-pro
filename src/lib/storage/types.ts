// A storage provider stores exactly two things:
//   1. the SiteContent JSON document (plus a short version history), and
//   2. uploaded media files (images / videos).
//
// Implementations: vercel-blob.ts (default on Vercel), supabase.ts, local.ts
// (development). To add Firebase or another provider, implement this interface
// and register it in index.ts.

export type ProviderName = "vercel-blob" | "supabase" | "local";

export interface ContentVersion {
  id: string; // provider-specific handle
  savedAt: string; // ISO
  size: number;
  label?: string;
}

// How the browser should upload a file. Each provider picks the mode that
// avoids routing large videos through a serverless function body.
export type UploadPlan =
  | {
      // Browser calls @vercel/blob/client upload() against /api/admin/upload
      mode: "vercel-blob";
    }
  | {
      // Browser PUTs the file straight to a signed URL
      mode: "signed-put";
      uploadUrl: string;
      publicUrl: string;
      headers?: Record<string, string>;
    }
  | {
      // Browser POSTs multipart to /api/admin/upload (local dev only)
      mode: "direct";
    };

export interface StorageProvider {
  readonly name: ProviderName;
  readContent(): Promise<unknown | null>;
  writeContent(content: unknown): Promise<void>;
  listVersions(limit?: number): Promise<ContentVersion[]>;
  readVersion(id: string): Promise<unknown | null>;
  // Called by the upload route to decide how the browser should upload.
  planUpload(input: {
    filename: string;
    contentType: string;
    size: number;
  }): Promise<UploadPlan>;
  // Only used by "direct" mode.
  storeFile?(input: {
    filename: string;
    contentType: string;
    data: Uint8Array;
  }): Promise<{ url: string }>;
  deleteFile(url: string): Promise<void>;
}

export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024 * 1024; // 2 GB (videos)
export const ALLOWED_UPLOAD_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/heic",
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/x-m4v",
  "application/pdf",
];

export function safeFilename(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? "file";
  const cleaned = base
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, 120);
  return cleaned || "file";
}

export function uploadPath(filename: string): string {
  const d = new Date();
  const stamp = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 8);
  return `uploads/${stamp}/${rand}-${safeFilename(filename)}`;
}
