"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { BookMarked } from "lucide-react";
import { browseCachedWords, type DictionaryBrowseWord } from "@/lib/dictionary/cachedWordsBrowse";
import { CefrBadge } from "@/components/ui/CefrBadge";
import type { CEFRLevel } from "@/types/dictionary";

const PAGE_SIZE = 60;

export default function DictionaryPage() {
  const [query, setQuery] = useState("");
  const [words, setWords] = useState<DictionaryBrowseWord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadedOnce, setLoadedOnce] = useState(false);

  const loadPage = useCallback(async (q: string, offset: number, append: boolean) => {
    setLoading(true);
    const result = await browseCachedWords(q, offset, PAGE_SIZE);
    setWords((prev) => (append ? [...prev, ...result.words] : result.words));
    setTotal(result.total);
    setLoading(false);
    setLoadedOnce(true);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => loadPage(query, 0, false), 250);
    return () => clearTimeout(timer);
  }, [query, loadPage]);

  const hasMore = words.length < total;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
      <p className="text-xs uppercase tracking-widest text-accent font-medium mb-2">Complete Dictionary</p>
      <h1 className="font-display text-4xl sm:text-5xl tracking-tight mb-3">Built from every search</h1>
      <p className="text-ink-muted max-w-2xl mb-8">
        Unlike Core 3000 and Advanced 1500, this isn&apos;t a fixed list — it&apos;s every word anyone has
        looked up on this site, saved automatically the first time, and growing with every new search.
        {loadedOnce && total > 0 && (
          <>
            {" "}
            Currently <span className="font-medium text-ink">{total.toLocaleString()}</span>{" "}
            {total === 1 ? "word" : "words"}.
          </>
        )}
      </p>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter by word…"
        aria-label="Filter words"
        className="w-full max-w-md rounded-xl border border-border-strong bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent mb-8"
      />

      {!loadedOnce && loading ? (
        <p className="text-sm text-ink-muted">Loading…</p>
      ) : total === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-strong bg-surface p-10 text-center">
          <BookMarked className="mx-auto h-8 w-8 text-ink-faint mb-3" strokeWidth={1.5} />
          <p className="font-medium mb-1">
            {query.trim() ? `No cached words start with "${query}" yet.` : "No words cached yet."}
          </p>
          <p className="text-sm text-ink-muted">
            {query.trim()
              ? "Look that word up anywhere on the site to add it here."
              : "This page fills in automatically as people search the dictionary elsewhere on the site — try looking up a word first."}
          </p>
        </div>
      ) : (
        <>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {words.map((w) => (
              <li key={w.slug}>
                <Link
                  href={`/word/${w.slug}`}
                  className="group flex flex-col gap-1.5 rounded-xl border border-border bg-surface px-4 py-3.5 hover:border-accent transition-colors h-full"
                >
                  <span className="font-display text-lg leading-tight group-hover:text-accent transition-colors">
                    {w.word}
                  </span>
                  {w.partOfSpeech && <span className="text-xs italic text-ink-faint">{w.partOfSpeech}</span>}
                  {w.cefrLevel && <CefrBadge level={w.cefrLevel as CEFRLevel} className="mt-auto self-start" />}
                </Link>
              </li>
            ))}
          </ul>

          {hasMore && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => loadPage(query, words.length, true)}
                disabled={loading}
                className="rounded-full border border-border-strong px-6 py-2.5 text-sm font-medium hover:border-accent hover:text-accent transition-colors disabled:opacity-60"
              >
                {loading ? "Loading…" : `Show more (${(total - words.length).toLocaleString()} remaining)`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
