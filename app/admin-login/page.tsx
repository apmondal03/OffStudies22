"use client";

import { useState } from "react";
import { ShieldCheck, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { checkIsAdminEmail } from "@/lib/admin/settings";

export default function AdminLoginPage() {
  const { isConfigured, signInWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("checking");
    setErrorMessage("");

    const isAdmin = await checkIsAdminEmail(email);
    if (!isAdmin) {
      setStatus("error");
      setErrorMessage("That email isn't set up for admin access.");
      return;
    }

    const { error } = await signInWithEmail(email);
    if (error) {
      setStatus("error");
      setErrorMessage(error);
    } else {
      setStatus("sent");
    }
  }

  if (!isConfigured) {
    return (
      <div className="mx-auto max-w-md px-4 sm:px-6 py-16 text-center">
        <h1 className="font-display text-2xl tracking-tight mb-3">Admin isn&apos;t set up yet</h1>
        <p className="text-ink-muted">This deployment hasn&apos;t been connected to a Supabase project.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-16">
      <ShieldCheck className="h-8 w-8 text-accent mb-4" strokeWidth={1.5} />
      <h1 className="font-display text-3xl tracking-tight mb-2">Admin sign-in</h1>
      <p className="text-ink-muted mb-8">
        Separate from regular sign-in, and never affected by the &quot;new sign-ins paused&quot;
        setting — this only works for the admin email(s) configured for this deployment.
      </p>

      {status === "sent" ? (
        <div className="rounded-2xl border border-border bg-surface p-6 text-center">
          <Mail className="mx-auto h-8 w-8 text-accent mb-3" />
          <p className="font-medium">Check your email</p>
          <p className="text-sm text-ink-muted mt-1">
            We sent a sign-in link to {email}. Click it to continue.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            className="rounded-xl border border-border-strong bg-surface px-4 py-3 text-sm outline-none focus:border-accent"
          />
          <button
            type="submit"
            disabled={status === "checking"}
            className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-accent-contrast hover:bg-accent-strong disabled:opacity-60"
          >
            {status === "checking" ? "Checking…" : "Send sign-in link"}
          </button>
          {status === "error" && <p className="text-sm text-b2">{errorMessage}</p>}
        </form>
      )}
    </div>
  );
}
