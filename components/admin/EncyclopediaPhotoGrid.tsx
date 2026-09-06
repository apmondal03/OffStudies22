"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ImagePlus } from "lucide-react";
import { DISCOVERY_CATEGORY_LABEL } from "@/types/discovery";
import type { DiscoveryEntry } from "@/types/discovery";

export function EncyclopediaPhotoGrid({
  entries,
  overrides,
}: {
  entries: DiscoveryEntry[];
  overrides: Record<string, string>;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) => e.name.toLowerCase().includes(q));
  }, [entries, query]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Find an entry by name…"
        aria-label="Find an entry"
        className="w-full rounded-xl border border-border-strong bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent mb-5"
      />

      {filtered.length === 0 ? (
        <p className="text-sm text-ink-muted">No entries match &ldquo;{query}&rdquo;.</p>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filtered.map((entry) => {
            const photoUrl = overrides[entry.slug];
            return (
              <li key={entry.slug}>
                <Link
                  href={`/admin/encyclopedia-photos/${entry.slug}`}
                  className="group flex flex-col gap-2 rounded-xl border border-border bg-surface p-3.5 hover:border-accent transition-colors h-full"
                >
                  {photoUrl ? (
                    <Image
                      src={photoUrl}
                      alt=""
                      width={200}
                      height={100}
                      unoptimized
                      className="h-20 w-full rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-full items-center justify-center rounded-lg bg-surface-sunken text-3xl">
                      {entry.emoji}
                    </div>
                  )}
                  <div>
                    <p className="font-display text-sm leading-tight group-hover:text-accent transition-colors truncate">
                      {entry.name}
                    </p>
                    <p className="text-xs text-ink-faint truncate">{DISCOVERY_CATEGORY_LABEL[entry.category]}</p>
                  </div>
                  {!photoUrl && (
                    <p className="mt-auto flex items-center gap-1 text-xs text-ink-faint">
                      <ImagePlus className="h-3 w-3" />
                      Add photo
                    </p>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
