import { NextResponse, type NextRequest } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { isAdmin } from "@/lib/admin-session";
import { getStorage } from "@/lib/storage";
import {
  ALLOWED_UPLOAD_TYPES,
  MAX_UPLOAD_BYTES,
  safeFilename,
  uploadPath,
} from "@/lib/storage/types";

export const runtime = "nodejs";
export const maxDuration = 60;

// One endpoint, three jobs:
//   GET                      -> which provider is active (the uploader adapts)
//   POST json {action:plan}  -> how the browser should upload this file
//   POST json (blob client)  -> Vercel Blob client-upload token exchange
//   POST multipart           -> direct upload (local development)
export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const storage = await getStorage();
  return NextResponse.json({ provider: storage.name, maxBytes: MAX_UPLOAD_BYTES });
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const storage = await getStorage();
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "No file" }, { status: 400 });
    if (!storage.storeFile) {
      return NextResponse.json({ error: "Direct upload not supported by this provider" }, { status: 400 });
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: "File too large" }, { status: 413 });
    }
    const data = new Uint8Array(await file.arrayBuffer());
    const { url } = await storage.storeFile({ filename: file.name, contentType: file.type, data });
    return NextResponse.json({ url });
  }

  const body = (await request.json().catch(() => null)) as
    | { action: "plan"; filename: string; contentType: string; size: number }
    | HandleUploadBody
    | null;
  if (!body) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  if ("action" in body && body.action === "plan") {
    if (body.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: "File too large" }, { status: 413 });
    }
    const plan = await storage.planUpload({
      filename: body.filename,
      contentType: body.contentType,
      size: body.size,
    });
    return NextResponse.json(plan);
  }

  // Vercel Blob client-upload protocol
  try {
    const result = await handleUpload({
      request,
      body: body as HandleUploadBody,
      onBeforeGenerateToken: async (pathname) => ({
        allowedContentTypes: ALLOWED_UPLOAD_TYPES,
        maximumSizeInBytes: MAX_UPLOAD_BYTES,
        addRandomSuffix: true,
        // Re-home client-chosen names under uploads/YYYY/MM/
        tokenPayload: JSON.stringify({ pathname: uploadPath(safeFilename(pathname)) }),
      }),
      onUploadCompleted: async () => {
        // Media library registration happens from the browser after upload
        // (registerMediaAction), so nothing to do here.
      },
    });
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
