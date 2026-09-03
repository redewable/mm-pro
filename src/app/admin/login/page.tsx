import Image from "next/image";
import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <div className="min-h-screen flex items-center justify-center bg-navy px-5 py-10">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Image src="/mm-pro-logo.png" alt="" width={44} height={44} className="w-11 h-11" />
          <div className="text-white">
            <p className="text-lg font-bold leading-tight">M&amp;M Pro</p>
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/50">Site Dashboard</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8">
          <h1 className="text-xl font-bold text-navy mb-1">Sign in</h1>
          <p className="text-sm text-slate mb-6">Enter the dashboard password to manage the website.</p>
          <LoginForm next={next ?? "/admin"} />
        </div>
        <p className="text-center text-white/30 text-xs mt-6">
          <Link href="/" className="hover:text-white/60">← Back to website</Link>
        </p>
      </div>
    </div>
  );
}
