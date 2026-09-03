import "server-only";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "./auth";

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

// Defense in depth for server actions: the proxy already gates /admin, but
// every mutation re-checks the cookie before touching storage.
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) {
    throw new Error("Not signed in. Reload the page and sign in again.");
  }
}
