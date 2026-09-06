import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin/auth";
import { getMfaStatus } from "@/lib/admin/mfa";
import { MfaSetupForm } from "@/components/admin/MfaSetupForm";

export default async function MfaSetupPage() {
  const admin = await getAdminUser();
  if (!admin) redirect("/admin-login");

  const status = await getMfaStatus();
  if (status === "needs-verification") redirect("/mfa-verify");
  if (status === "verified") redirect("/admin");

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-16">
      <h1 className="font-display text-3xl tracking-tight mb-2">Set up two-factor sign-in</h1>
      <p className="text-ink-muted mb-8">
        One-time setup — scan this code with an authenticator app (Google Authenticator, Authy, 1Password,
        etc.), then enter the 6-digit code it shows to confirm.
      </p>
      <MfaSetupForm />
    </div>
  );
}
