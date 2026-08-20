import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin/auth";
import { getMfaStatus } from "@/lib/admin/mfa";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-display text-2xl tracking-tight mb-3">Admin isn&apos;t set up yet</h1>
        <p className="text-ink-muted mb-2">
          This deployment hasn&apos;t been connected to a Supabase project.
        </p>
        <p className="text-sm text-ink-faint">
          See the README&apos;s &quot;Admin content management&quot; section for setup steps.
        </p>
      </div>
    );
  }

  const admin = await getAdminUser();
  if (!admin) {
    redirect("/account");
  }

  const mfaStatus = await getMfaStatus();
  if (mfaStatus === "not-enrolled") {
    redirect("/mfa-setup");
  }
  if (mfaStatus === "needs-verification") {
    redirect("/mfa-verify");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-6 border-b border-border">
        <div>
          <p className="text-xs uppercase tracking-widest text-accent font-medium mb-1">Admin</p>
          <p className="text-sm text-ink-muted">Signed in as {admin.email}</p>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/admin" className="text-ink-muted hover:text-ink">
            Dashboard
          </Link>
          <Link href="/" className="text-ink-muted hover:text-ink">
            Back to app
          </Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
