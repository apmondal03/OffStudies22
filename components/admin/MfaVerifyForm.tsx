"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { AuthMFAListFactorsResponse, Factor } from "@supabase/supabase-js";

export function MfaVerifyForm() {
  const router = useRouter();
  const [factorId, setFactorId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"loading" | "ready" | "verifying" | "error">("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setStatus("error");
      setError("Accounts aren't configured on this deployment.");
      return;
    }

    supabase.auth.mfa.listFactors().then((result: AuthMFAListFactorsResponse) => {
      const verified = result.data?.totp?.find((f: Factor) => f.status === "verified");
      if (result.error || !verified) {
        setStatus("error");
        setError("No verified authenticator found. Please contact the site owner.");
        return;
      }
      setFactorId(verified.id);
      setStatus("ready");
    });
  }, []);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    const supabase = getSupabaseBrowserClient();
    if (!supabase || !factorId) return;

    setStatus("verifying");
    setError("");

    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
    if (challengeError || !challenge) {
      setStatus("ready");
      setError(challengeError?.message ?? "Something went wrong. Please try again.");
      return;
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code,
    });

    if (verifyError) {
      setStatus("ready");
      setCode("");
      setError("That code didn't work — check your authenticator app and try again.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  if (status === "loading") {
    return <p className="text-ink-muted">Loading…</p>;
  }

  if (status === "error" && !factorId) {
    return <p className="text-b2">{error}</p>;
  }

  return (
    <form onSubmit={handleVerify} className="flex flex-col gap-3">
      <label htmlFor="code" className="text-sm font-medium">
        6-digit code
      </label>
      <input
        id="code"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        autoFocus
        required
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
        className="rounded-xl border border-border-strong bg-surface px-4 py-2.5 text-lg tracking-widest text-center outline-none focus:border-accent"
      />
      {error && <p className="text-sm text-b2">{error}</p>}
      <button
        type="submit"
        disabled={status === "verifying" || code.length !== 6}
        className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-accent-contrast hover:bg-accent-strong disabled:opacity-60"
      >
        {status === "verifying" ? "Verifying…" : "Continue"}
      </button>
    </form>
  );
}
