// Dashboard authentication. One shared password, a signed session cookie.
//
// - ADMIN_PASSWORD (env)        bootstrap password. Required to log in unless
//                               the owner has set a password from the dashboard
//                               (stored as a PBKDF2 hash in the content doc).
// - ADMIN_SESSION_SECRET (env)  signs the cookie. Falls back to a hash of the
//                               password so a single env var is enough.
//
// Everything here uses Web Crypto so it works in proxy.ts (edge) and in
// server actions / route handlers (node).

export const SESSION_COOKIE = "mmpro_admin";
const SESSION_DAYS = 30;

const enc = new TextEncoder();

function b64url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = "";
  for (const b of arr) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function fromB64url(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", enc.encode(input));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function isAuthConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD || process.env.ADMIN_SESSION_SECRET);
}

async function sessionSecret(): Promise<string> {
  if (process.env.ADMIN_SESSION_SECRET) return process.env.ADMIN_SESSION_SECRET;
  if (process.env.ADMIN_PASSWORD) {
    return sha256Hex(`mmpro-session:${process.env.ADMIN_PASSWORD}`);
  }
  // Dev fallback so the dashboard works out of the box locally.
  return "mmpro-dev-secret-change-me";
}

async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    enc.encode(await sessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createSessionToken(): Promise<string> {
  const payload = {
    exp: Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000,
    iat: Date.now(),
    n: b64url(crypto.getRandomValues(new Uint8Array(8))),
  };
  const body = b64url(enc.encode(JSON.stringify(payload)));
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(), enc.encode(body));
  return `${body}.${b64url(sig)}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [body, sig] = token.split(".");
  if (!body || !sig) return false;
  try {
    const expected = b64url(
      await crypto.subtle.sign("HMAC", await hmacKey(), enc.encode(body))
    );
    if (!timingSafeEqual(expected, sig)) return false;
    const payload = JSON.parse(new TextDecoder().decode(fromB64url(body))) as {
      exp?: number;
    };
    return typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  };
}

// ---- Password hashing (PBKDF2, for the "change password" feature) ----

export async function hashPassword(
  password: string,
  saltB64?: string
): Promise<{ hash: string; salt: string }> {
  const salt = saltB64 ? fromB64url(saltB64) : crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, [
    "deriveBits",
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations: 210_000 },
    key,
    256
  );
  return { hash: b64url(bits), salt: b64url(salt) };
}

export async function verifyPassword(
  password: string,
  stored: { passwordHash: string; passwordSalt: string }
): Promise<boolean> {
  if (stored.passwordHash && stored.passwordSalt) {
    const { hash } = await hashPassword(password, stored.passwordSalt);
    return timingSafeEqual(hash, stored.passwordHash);
  }
  const envPassword = process.env.ADMIN_PASSWORD;
  if (!envPassword) {
    // Local development convenience only.
    return process.env.NODE_ENV !== "production" && password === "admin";
  }
  return timingSafeEqual(password, envPassword);
}
