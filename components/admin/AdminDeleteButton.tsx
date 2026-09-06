"use client";

import { Trash2 } from "lucide-react";

export function AdminDeleteButton({ label }: { label: string }) {
  return (
    <button
      type="submit"
      aria-label={`Delete ${label}`}
      onClick={(e) => {
        if (!window.confirm(`Delete "${label}"? This can't be undone.`)) {
          e.preventDefault();
        }
      }}
      className="rounded-full p-2 text-ink-muted hover:text-b2 hover:bg-[color-mix(in_srgb,var(--b2)_10%,transparent)] transition-colors"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
