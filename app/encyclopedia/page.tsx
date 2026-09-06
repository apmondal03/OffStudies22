"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DISCOVERY_ENTRIES } from "@/lib/discovery/data";
import { DISCOVERY_CATEGORY_LABEL } from "@/types/discovery";
import type { DiscoveryCategory, DiscoveryEntry } from "@/types/discovery";
import { EmptyList } from "@/components/ui/States";
import { listPublicAdminEntries } from "@/lib/admin/content";
import { toDiscoveryEntry } from "@/lib/admin/mappers";

const CATEGORIES: (DiscoveryCategory | "ALL")[] = ["ALL", ...(Object.keys(DISCOVERY_CATEGORY_LABEL) as DiscoveryCategory[])];

export default function EncyclopediaPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<DiscoveryCategory | "ALL">("ALL");
  // Admin-added entries (see /admin/encyclopedia) load in after the initial
  // render — the static list always shows instantly regardless of whether
  // this succeeds, fails, or Supabase isn't configured at all.
  const [adminEntries, setAdminEntries] = useState<DiscoveryEntry[]>([]);

  useEffect(() => {
    listPublicAdminEntries("encyclopedia")
      .then((rows) => setAdminEntries(rows.map(toDiscoveryEntry)))
      .catch(() => setAdminEntries([]));
  }, []);

  const allEntries = useMemo(() => [...adminEntries, ...DISCOVERY_ENTRIES], [adminEntries]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allEntries.filter((e) => {
      if (category !== "ALL" && e.category !== category) return false;
      if (q && !e.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [allEntries, query, category]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
      <p className="text-xs uppercase tracking-widest text-accent font-medium mb-2">Encyclopedia</p>
      <h1 className="font-display text-4xl sm:text-5xl tracking-tight mb-3">
        Explore the world
      </h1>
      <p className="text-ink-muted max-w-xl mb-8">
        {filtered.length} of {allEntries.length} entries shown — every article links to the
        vocabulary words it uses.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the encyclopedia…"
          aria-label="Search encyclopedia"
          className="flex-1 rounded-xl border border-border-strong bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Category">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={category === cat}
            onClick={() => setCategory(cat)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              category === cat
                ? "border-accent bg-accent-soft text-accent-strong font-medium"
                : "border-border text-ink-muted hover:text-ink"
            }`}
          >
            {cat === "ALL" ? "All" : DISCOVERY_CATEGORY_LABEL[cat]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyList title="No entries match those filters." hint="Try a different search term or category." />
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filtered.map((e) => (
            <li key={e.slug}>
              <Link
                href={`/encyclopedia/${e.slug}`}
                className="group flex flex-col gap-1.5 rounded-xl border border-border bg-surface px-4 py-3.5 hover:border-accent transition-colors h-full"
              >
                <span className="text-2xl">{e.emoji}</span>
                <span className="font-display text-lg leading-tight group-hover:text-accent transition-colors">
                  {e.name}
                </span>
                <span className="text-xs italic text-ink-faint">{DISCOVERY_CATEGORY_LABEL[e.category]}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
