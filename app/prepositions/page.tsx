"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PREPOSITIONS } from "@/lib/prepositions/data";
import { PREPOSITION_TYPE_LABEL } from "@/types/preposition";
import type { PrepositionType, PrepositionEntry } from "@/types/preposition";
import { EmptyList } from "@/components/ui/States";
import { listPublicAdminEntries } from "@/lib/admin/content";
import { toPrepositionEntry } from "@/lib/admin/mappers";

const TYPES: (PrepositionType | "ALL")[] = ["ALL", "core", "adjective-preposition", "noun-preposition"];

export default function PrepositionsPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<PrepositionType | "ALL">("ALL");
  const [adminEntries, setAdminEntries] = useState<PrepositionEntry[]>([]);

  useEffect(() => {
    listPublicAdminEntries("prepositions")
      .then((rows) => setAdminEntries(rows.map(toPrepositionEntry)))
      .catch(() => setAdminEntries([]));
  }, []);

  const allEntries = useMemo(() => [...adminEntries, ...PREPOSITIONS], [adminEntries]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allEntries.filter((p) => {
      if (type !== "ALL" && p.type !== type) return false;
      if (q && !p.phrase.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [allEntries, query, type]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
      <p className="text-xs uppercase tracking-widest text-accent font-medium mb-2">Prepositions</p>
      <h1 className="font-display text-4xl sm:text-5xl tracking-tight mb-3">
        Get the small words right
      </h1>
      <p className="text-ink-muted max-w-xl mb-8">
        {filtered.length} of {allEntries.length} entries shown — core prepositions with their
        time/place/movement uses, plus common adjective and noun collocations.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by phrase…"
          aria-label="Filter prepositions"
          className="flex-1 rounded-xl border border-border-strong bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Type">
        {TYPES.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={type === t}
            onClick={() => setType(t)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              type === t
                ? "border-accent bg-accent-soft text-accent-strong font-medium"
                : "border-border text-ink-muted hover:text-ink"
            }`}
          >
            {t === "ALL" ? "All" : PREPOSITION_TYPE_LABEL[t]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyList title="No entries match those filters." hint="Try a different search term or type." />
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filtered.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/prepositions/${p.slug}`}
                className="group flex flex-col gap-1.5 rounded-xl border border-border bg-surface px-4 py-3.5 hover:border-accent transition-colors h-full"
              >
                <span className="font-display text-lg leading-tight group-hover:text-accent transition-colors">
                  {p.phrase}
                </span>
                <span className="text-xs italic text-ink-faint">{PREPOSITION_TYPE_LABEL[p.type]}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
