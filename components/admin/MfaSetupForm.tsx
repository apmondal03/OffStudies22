"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { AuthMFAEnrollResponse } from "@supabase/supabase-js";

export function MfaSetupForm() {
  const router = useRouter();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
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

    supabase.auth.mfa.enroll({ factorType: "totp" }).then((result: AuthMFAEnrollResponse) => {
      if (result.error || !result.data || !("totp" in result.data)) {
        setStatus("error");
        setError(result.error?.message ?? "Couldn't start setup. Please try again.");
        return;
      }
      setFactorId(result.data.id);
      setQrCode(result.data.totp.qr_code);
      setSecret(result.data.totp.secret);
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
      setError("That code didn't work — check your authenticator app and try again.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  if (status === "loading") {
    return <p className="text-ink-muted">Setting up…</p>;
  }

  if (status === "error" && !qrCode) {
    return <p className="text-b2">{error}</p>;
  }

  return (
    <div>
      {qrCode && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={qrCode} alt="Scan with your authenticator app" className="w-48 h-48 rounded-xl border border-border mb-4" />
      )}

      {secret && (
        <p className="text-xs text-ink-faint mb-6 font-mono break-all">
          Can&apos;t scan? Enter this code manually: {secret}
        </p>
      )}

      <form onSubmit={handleVerify} className="flex flex-col gap-3">
        <label htmlFor="code" className="text-sm font-medium">
          Enter the 6-digit code from your app
        </label>
        <input
          id="code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
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
          {status === "verifying" ? "Confirming…" : "Confirm and continue"}
        </button>
      </form>
    </div>
  );
}
