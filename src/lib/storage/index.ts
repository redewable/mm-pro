import "server-only";
import type { StorageProvider, ProviderName } from "./types";

// Picks the storage provider from the environment.
//   CONTENT_PROVIDER=vercel-blob | supabase | local   (optional, explicit)
// Otherwise auto-detects: Blob token -> Vercel Blob, Supabase keys -> Supabase,
// else local disk (development only).

export function detectProvider(): ProviderName {
  const explicit = process.env.CONTENT_PROVIDER as ProviderName | undefined;
  if (explicit === "vercel-blob" || explicit === "supabase" || explicit === "local") {
    return explicit;
  }
  if (process.env.BLOB_READ_WRITE_TOKEN) return "vercel-blob";
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) return "supabase";
  return "local";
}

let cached: StorageProvider | null = null;

export async function getStorage(): Promise<StorageProvider> {
  if (cached) return cached;
  const name = detectProvider();
  switch (name) {
    case "vercel-blob": {
      const { vercelBlobProvider } = await import("./vercel-blob");
      cached = vercelBlobProvider;
      break;
    }
    case "supabase": {
      const { supabaseProvider } = await import("./supabase");
      cached = supabaseProvider;
      break;
    }
    default: {
      const { localProvider } = await import("./local");
      cached = localProvider;
    }
  }
  return cached;
}

export function providerStatus(): {
  name: ProviderName;
  productionReady: boolean;
  // true only when a live (production) build has no persistent store —
  // the one situation where saves would be lost.
  warn: boolean;
  note: string;
} {
  const name = detectProvider();
  const isProd = process.env.NODE_ENV === "production";
  if (name === "local") {
    return {
      name,
      productionReady: false,
      warn: isProd,
      note: isProd
        ? "No storage connected. Attach a Vercel Blob store (Storage tab) and redeploy so edits persist."
        : "Local development storage (content/site.json).",
    };
  }
  if (name === "vercel-blob") {
    return { name, productionReady: true, warn: false, note: "Vercel Blob store connected." };
  }
  return { name, productionReady: true, warn: false, note: "Supabase connected." };
}
