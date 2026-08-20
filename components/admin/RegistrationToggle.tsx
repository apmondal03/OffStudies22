"use client";

import { useState } from "react";
import { setRegistrationEnabled } from "@/lib/admin/settings";

export function RegistrationToggle({ initialEnabled }: { initialEnabled: boolean }) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [saving, setSaving] = useState(false);

  async function handleToggle() {
    const next = !enabled;
    setSaving(true);
    setEnabled(next); // optimistic
    try {
      await setRegistrationEnabled(next);
    } catch {
      setEnabled(!next); // revert on failure
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-5">
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
  );
}
