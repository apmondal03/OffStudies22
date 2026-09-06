"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { setRegistrationEnabled } from "@/lib/admin/settings";

export function RegistrationToggle({ initialEnabled }: { initialEnabled: boolean }) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleToggle() {
    const next = !enabled;
    setSaving(true);
    setError(null);
    setEnabled(next); // optimistic
    try {
      await setRegistrationEnabled(next);
    } catch (e) {
      setEnabled(!next); // revert on failure
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-medium">New account sign-ins</p>
          <p className="text-sm text-ink-muted mt-0.5">
            {enabled
              ? "Anyone can create an account via the magic-link sign-in."
              : "New sign-ins are paused — only already-signed-in devices keep working."}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={handleToggle}
          disabled={saving}
          className={`relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-60 ${
            enabled ? "bg-accent" : "bg-surface-sunken border border-border-strong"
          }`}
        >
          <span
            className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
              enabled ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-b2/40 bg-[color-mix(in_srgb,var(--b2)_8%,transparent)] px-3.5 py-2.5 text-sm text-b2">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
