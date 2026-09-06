"use client";

import { useState } from "react";
import Image from "next/image";
import { setEntryImageOverride } from "@/lib/admin/entryImages";

export function EntryPhotoForm({
  moduleId,
  slug,
  currentImage,
}: {
  moduleId: string;
  slug: string;
  currentImage: string | null;
}) {
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const formData = new FormData(e.currentTarget);
      await setEntryImageOverride(moduleId, slug, formData);
      setSavedAt(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      {currentImage && (
        <div className="mb-5">
          <p className="text-xs uppercase tracking-widest text-ink-faint mb-2">Current photo</p>
          <Image
            src={currentImage}
            alt=""
            width={480}
            height={220}
            unoptimized
            className="h-44 w-full max-w-md rounded-2xl object-cover border border-border"
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
        <label htmlFor="image" className="text-sm font-medium">
          {currentImage ? "Replace photo" : "Add a photo"}
        </label>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          required
          className="block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-accent-soft file:px-4 file:py-2 file:text-sm file:font-medium file:text-accent-strong"
        />
        {error && <p className="text-sm text-b2">{error}</p>}
        {savedAt && !error && <p className="text-sm text-accent-strong">Saved at {savedAt}.</p>}
        <button
          type="submit"
          disabled={saving}
          className="self-start rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-contrast hover:bg-accent-strong disabled:opacity-60"
        >
          {saving ? "Uploading…" : "Save photo"}
        </button>
      </form>
    </div>
  );
}
