"use client";

import { useState } from "react";
import { Mail, LogOut, CheckCircle2, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { pushAllProgress } from "@/lib/sync/progressSync";

export default function AccountPage() {
  const { user, loading, isConfigured, signInWithEmail, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const { error } = await signInWithEmail(email);
    if (error) {
      setStatus("error");
      setErrorMessage(error);
    } else {
      setStatus("sent");
    }
  }

  async function handleManualSync() {
    if (!user) return;
    setSyncing(true);
    await pushAllProgress(user.id);
    setSyncing(false);
    setLastSynced(new Date().toLocaleTimeString());
  }

  if (!isConfigured) {
    return (
      <div className="mx-auto max-w-md px-4 sm:px-6 py-16 text-center">
        <h1 className="font-display text-3xl tracking-tight mb-3">Accounts aren&apos;t set up yet</h1>
        <p className="text-ink-muted">
          This deployment hasn&apos;t been connected to a Supabase project. Everything still
          works fully offline — your progress is just saved on this device only.
        </p>
      </div>
    );
  }

  if (loading) {
    return <div className="mx-auto max-w-md px-4 sm:px-6 py-16 text-center text-ink-muted">Loading…</div>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 sm:px-6 py-16">
        <h1 className="font-display text-3xl tracking-tight mb-2">Sign in</h1>
        <p className="text-ink-muted mb-8">
          Sync your saved words and progress across devices. No password — we&apos;ll email you a
          link.
        </p>

        {status === "sent" ? (
          <div className="rounded-2xl border border-border bg-surface p-6 text-center">
            <Mail className="mx-auto h-8 w-8 text-accent mb-3" />
            <p className="font-medium">Check your email</p>
            <p className="text-sm text-ink-muted mt-1">
              We sent a sign-in link to {email}. Click it to finish signing in.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="rounded-xl border border-border-strong bg-surface px-4 py-3 text-sm outline-none focus:border-accent"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-accent-contrast hover:bg-accent-strong disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Send sign-in link"}
            </button>
            {status === "error" && <p className="text-sm text-b2">{errorMessage}</p>}
          </form>
        )}

        <p className="mt-6 text-xs text-ink-faint">
          Only applies to the main app (Vocabulary, Phrasal Verbs, Grammar, Idioms,
          Prepositions, Encyclopedia). Kids Mode and Young Learners never require an account.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 py-16">
      <h1 className="font-display text-3xl tracking-tight mb-2">Your account</h1>
      <p className="text-ink-muted mb-8">{user.email}</p>

      <div className="rounded-2xl border border-border bg-surface p-6 mb-6">
        <div className="flex items-center gap-2 text-sm text-ink-muted mb-3">
          <CheckCircle2 className="h-4 w-4 text-accent" />
          Progress syncs automatically across your signed-in devices.
        </div>
        <button
          type="button"
          onClick={handleManualSync}
          disabled={syncing}
          className="inline-flex items-center gap-1.5 rounded-full border border-border-strong px-4 py-2 text-sm hover:border-accent hover:text-accent disabled:opacity-60"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing…" : "Sync now"}
        </button>
        {lastSynced && <p className="mt-2 text-xs text-ink-faint">Last synced at {lastSynced}</p>}
      </div>

      <button
        type="button"
        onClick={signOut}
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </div>
  );
}
