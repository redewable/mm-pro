import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { StorageProvider, ContentVersion } from "./types";
import { uploadPath } from "./types";

// Supabase provider. Needs SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
// Run supabase/schema.sql once in the SQL editor to create the tables and
// the public "media" storage bucket.

const TABLE = "site_content";
const VERSIONS_TABLE = "site_content_versions";
const BUCKET = process.env.SUPABASE_MEDIA_BUCKET || "media";
const ROW_ID = "site";
const KEEP_VERSIONS = 30;

let client: SupabaseClient | null = null;
function sb(): SupabaseClient {
  if (!client) {
    client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );
  }
  return client;
}

export const supabaseProvider: StorageProvider = {
  name: "supabase",

  async readContent() {
    const { data, error } = await sb()
      .from(TABLE)
      .select("data")
      .eq("id", ROW_ID)
      .maybeSingle();
    if (error) throw new Error(`Supabase read failed: ${error.message}`);
    return data?.data ?? null;
  },

  async writeContent(content) {
    const db = sb();
    // Save previous version
    const { data: prev } = await db.from(TABLE).select("data").eq("id", ROW_ID).maybeSingle();
    if (prev?.data) {
      await db.from(VERSIONS_TABLE).insert({ data: prev.data });
    }
    const { error } = await db
      .from(TABLE)
      .upsert({ id: ROW_ID, data: content, updated_at: new Date().toISOString() });
    if (error) throw new Error(`Supabase write failed: ${error.message}`);
    // Prune
    const { data: old } = await db
      .from(VERSIONS_TABLE)
      .select("id")
      .order("created_at", { ascending: false })
      .range(KEEP_VERSIONS, KEEP_VERSIONS + 500);
    if (old?.length) {
      await db.from(VERSIONS_TABLE).delete().in("id", old.map((r) => r.id));
    }
  },

  async listVersions(limit = 30): Promise<ContentVersion[]> {
    const { data, error } = await sb()
      .from(VERSIONS_TABLE)
      .select("id, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw new Error(error.message);
    return (data ?? []).map((r) => ({
      id: String(r.id),
      savedAt: r.created_at,
      size: 0,
    }));
  },

  async readVersion(id) {
    const { data } = await sb().from(VERSIONS_TABLE).select("data").eq("id", id).maybeSingle();
    return data?.data ?? null;
  },

  async planUpload({ filename, contentType }) {
    const path = uploadPath(filename);
    const { data, error } = await sb().storage.from(BUCKET).createSignedUploadUrl(path);
    if (error || !data) throw new Error(`Could not create upload URL: ${error?.message}`);
    const { data: pub } = sb().storage.from(BUCKET).getPublicUrl(path);
    return {
      mode: "signed-put",
      uploadUrl: data.signedUrl,
      publicUrl: pub.publicUrl,
      headers: { "Content-Type": contentType, "x-upsert": "true" },
    };
  },

  async deleteFile(url) {
    const marker = `/object/public/${BUCKET}/`;
    const i = url.indexOf(marker);
    if (i === -1) return;
    const path = decodeURIComponent(url.slice(i + marker.length));
    await sb().storage.from(BUCKET).remove([path]);
  },
};
