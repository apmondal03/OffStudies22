"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ADVANCED_1500 } from "@/lib/dictionary/advancedList";
import { CefrBadge } from "@/components/ui/CefrBadge";
import { EmptyList } from "@/components/ui/States";
import { ShowMoreButton } from "@/components/ui/ShowMoreButton";
import { usePagination } from "@/hooks/usePagination";
import type { CEFRLevel } from "@/types/dictionary";

const LEVELS: (CEFRLevel | "ALL")[] = ["ALL", "C1", "C2"];

const POS_OPTIONS = ["ALL", "noun", "verb", "adjective", "adverb"];

export default function AdvancedPage() {
  const [level, setLevel] = useState<CEFRLevel | "ALL">("ALL");
  const [pos, setPos] = useState<string>("ALL");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ADVANCED_1500.filter((w) => {
      if (level !== "ALL" && w.cefrLevel !== level) return false;
      if (pos !== "ALL" && w.partOfSpeech !== pos) return false;
      if (q && !w.word.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [level, pos, query]);

  const { visibleCount, showMore, hasMore, remaining } = usePagination(filtered.length);
  const visible = filtered.slice(0, visibleCount);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-14">
      <p className="text-xs uppercase tracking-widest text-accent font-medium mb-2">Advanced 1500</p>
      <h1 className="font-display text-4xl sm:text-5xl tracking-tight mb-3">
        Beyond the essentials
      </h1>
      <p className="text-ink-muted max-w-xl mb-8">
        {filtered.length.toLocaleString()} of {ADVANCED_1500.length.toLocaleString()} words shown — C1
        and C2 vocabulary for advanced learners, kept separate from the Core 3000 so that stays a
        clean essentials-only list.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search advanced words…"
          aria-label="Search"
          className="flex-1 rounded-xl border border-border-strong bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
        />
        <select
          value={pos}
          onChange={(e) => setPos(e.target.value)}
          className="rounded-xl border border-border-strong bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
        >
          {POS_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {p === "ALL" ? "All parts of speech" : p}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 mb-8" role="tablist" aria-label="CEFR level">
        {LEVELS.map((l) => (
          <button
            key={l}
            role="tab"
            aria-selected={level === l}
            onClick={() => setLevel(l)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              level === l
                ? "border-accent bg-accent-soft text-accent-strong font-medium"
                : "border-border text-ink-muted hover:text-ink"
            }`}
          >
            {l === "ALL" ? "All" : l}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyList title="No words match those filters." hint="Try a different search term or level." />
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {visible.map((w) => (
            <li key={w.slug}>
              <Link
                href={`/word/${w.slug}`}
                className="flex items-center justify-between gap-2 rounded-xl border border-border bg-surface px-4 py-3 hover:border-accent transition-colors"
              >
                <span className="font-medium">{w.word}</span>
                <CefrBadge level={w.cefrLevel} />
              </Link>
            </li>
          ))}
        </ul>
      )}

      {hasMore && <ShowMoreButton remaining={remaining} onClick={showMore} />}
    </div>
  );
}
