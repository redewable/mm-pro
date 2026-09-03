import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { ToastProvider } from "@/components/admin/Toast";
import { isAdmin } from "@/lib/admin-session";
import { providerStatus } from "@/lib/storage";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s · M&M Pro Dashboard" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const signedIn = await isAdmin();
  const provider = providerStatus();
  return (
    <ToastProvider>
      {signedIn ? <AdminShell provider={provider}>{children}</AdminShell> : children}
    </ToastProvider>
  );
}
