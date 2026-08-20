import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin/auth";
import { getMfaStatus } from "@/lib/admin/mfa";
import { MfaVerifyForm } from "@/components/admin/MfaVerifyForm";

export default async function MfaVerifyPage() {
  const admin = await getAdminUser();
  if (!admin) redirect("/admin-login");

  const status = await getMfaStatus();
  if (status === "not-enrolled") redirect("/mfa-setup");
  if (status === "verified") redirect("/admin");

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-16">
      <h1 className="font-display text-3xl tracking-tight mb-2">Enter your code</h1>
      <p className="text-ink-muted mb-8">
        Open your authenticator app and enter the current 6-digit code to continue to the admin
        dashboard.
      </p>
      <MfaVerifyForm />
    </div>
  );
}
