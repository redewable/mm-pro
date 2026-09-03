"use client";

import { upload as blobUpload } from "@vercel/blob/client";
import type { MediaItem } from "@/lib/content/types";
import type { UploadPlan } from "@/lib/storage/types";
import { newId } from "@/lib/ids";

export type ProgressFn = (pct: number) => void;

async function plan(file: File): Promise<UploadPlan> {
  const res = await fetch("/api/admin/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "plan", filename: file.name, contentType: file.type, size: file.size }),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error || "Could not start upload");
  return res.json();
}

function putWithProgress(url: string, file: File, headers: Record<string, string>, onProgress: ProgressFn) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    for (const [k, v] of Object.entries(headers)) xhr.setRequestHeader(k, v);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`Upload failed (${xhr.status})`));
    };
    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(file);
  });
}

function postWithProgress(url: string, file: File, onProgress: ProgressFn) {
  return new Promise<{ url: string }>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const form = new FormData();
    form.append("file", file, file.name);
    xhr.open("POST", url);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      try {
        const json = JSON.parse(xhr.responseText);
        if (xhr.status < 300 && json.url) resolve(json);
        else reject(new Error(json.error || "Upload failed"));
      } catch {
        reject(new Error("Upload failed"));
      }
    };
    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(form);
  });
}

export async function uploadFile(file: File, onProgress: ProgressFn = () => {}): Promise<string> {
  const p = await plan(file);
  if (p.mode === "vercel-blob") {
    const result = await blobUpload(file.name, file, {
      access: "public",
      handleUploadUrl: "/api/admin/upload",
      multipart: file.size > 8 * 1024 * 1024,
      onUploadProgress: (e) => onProgress(Math.round(e.percentage)),
    });
    return result.url;
  }
  if (p.mode === "signed-put") {
    await putWithProgress(p.uploadUrl, file, p.headers ?? {}, onProgress);
    return p.publicUrl;
  }
  const { url } = await postWithProgress("/api/admin/upload", file, onProgress);
  return url;
}

// Phone photos are 4–8 MB HEIC/JPEG. Resize to a sane maximum and re-encode
// as WebP in the browser so uploads are fast and the site stays quick. Falls
// back to the original file when the browser can't decode it (HEIC on
// Chrome desktop, for example — iPhones hand the picker a JPEG anyway).
const MAX_EDGE = 2400;
const SKIP_UNDER_BYTES = 400 * 1024;

export async function optimizeImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") return file;
  try {
    // imageOrientation: "from-image" applies EXIF rotation so sideways phone
    // shots come out upright.
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const { width, height } = bitmap;
    const scale = Math.min(1, MAX_EDGE / Math.max(width, height));
    if (scale === 1 && file.size < SKIP_UNDER_BYTES && file.type !== "image/heic" && file.type !== "image/heif") {
      bitmap.close();
      return file;
    }
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.84));
    if (!blob || blob.type !== "image/webp") {
      const jpeg = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.86));
      if (!jpeg) return file;
      return new File([jpeg], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
    }
    // Only keep the re-encode if it actually helped.
    if (scale === 1 && blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".webp", { type: "image/webp" });
  } catch {
    return file;
  }
}

export function imageDimensions(file: File): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/")) return resolve(null);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

// Grab a frame ~1s in as a JPEG poster, plus the duration.
export function videoPosterAndDuration(
  file: File
): Promise<{ poster: File | null; duration: number | null; width?: number; height?: number }> {
  return new Promise((resolve) => {
    if (!file.type.startsWith("video/")) return resolve({ poster: null, duration: null });
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";
    let done = false;
    const finish = (poster: File | null) => {
      if (done) return;
      done = true;
      const out = {
        poster,
        duration: Number.isFinite(video.duration) ? video.duration : null,
        width: video.videoWidth || undefined,
        height: video.videoHeight || undefined,
      };
      URL.revokeObjectURL(url);
      resolve(out);
    };
    video.onloadedmetadata = () => {
      video.currentTime = Math.min(1, Math.max(0, (video.duration || 2) / 4));
    };
    video.onseeked = () => {
      try {
        const canvas = document.createElement("canvas");
        const scale = Math.min(1, 1280 / (video.videoWidth || 1280));
        canvas.width = Math.round(video.videoWidth * scale);
        canvas.height = Math.round(video.videoHeight * scale);
        canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => finish(blob ? new File([blob], file.name.replace(/\.[^.]+$/, "") + "-poster.jpg", { type: "image/jpeg" }) : null),
          "image/jpeg",
          0.82
        );
      } catch {
        finish(null);
      }
    };
    video.onerror = () => finish(null);
    setTimeout(() => finish(null), 15000);
    video.src = url;
  });
}

export function kindOf(mime: string): MediaItem["kind"] {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  return "file";
}

export function toMediaItem(file: File, url: string, extra: Partial<MediaItem> = {}): MediaItem {
  return {
    id: newId("med"),
    url,
    kind: kindOf(file.type),
    name: file.name,
    mime: file.type,
    size: file.size,
    createdAt: new Date().toISOString(),
    alt: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
    ...extra,
  };
}

export function formatBytes(n: number): string {
  if (!n) return "";
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  return `${(n / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
