"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, ArrowUpRight } from "lucide-react";
import { unifiedSearch, type SearchResultType } from "@/lib/search/unifiedSearch";
import { EmptyList } from "@/components/ui/States";

const TYPE_ORDER: SearchResultType[] = [
  "vocabulary",
  "phrasal-verb",
  "grammar",
  "idiom",
  "preposition",
  "encyclopedia",
];

function SearchPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  const results = useMemo(() => unifiedSearch(query, 6), [query]);
  const totalCount = useMemo(
    () => Object.values(results).reduce((sum, arr) => sum + arr.length, 0),
    [results]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-14">
      <p className="text-xs uppercase tracking-widest text-accent font-medium mb-2">Search</p>
      <h1 className="font-display text-4xl sm:text-5xl tracking-tight mb-6">
        Search everything
      </h1>

      <form onSubmit={handleSubmit} className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-faint" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search vocabulary, phrasal verbs, grammar, idioms, prepositions, encyclopedia…"
          autoFocus
          className="w-full rounded-2xl border border-border-strong bg-surface pl-12 pr-4 py-3.5 text-base outline-none focus:border-accent"
        />
      </form>

      {!query.trim() && (
        <p className="text-ink-muted">Search across every part of Lexicon at once.</p>
      )}

      {query.trim() && totalCount === 0 && (
        <EmptyList title={`No results for "${query}"`} hint="Try a different word or phrase." />
      )}

      {query.trim() && totalCount > 0 && (
        <div className="space-y-10">
          {TYPE_ORDER.map((type) => {
            const group = results[type];
            if (group.length === 0) return null;
            return (
              <section key={type}>
                <h2 className="text-sm uppercase tracking-wide text-ink-faint mb-3">
                  {group[0].typeLabel}
                  <span className="ml-2 font-mono text-ink-faint">({group.length})</span>
                </h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {group.map((r) => (
                    <li key={r.href}>
                      <Link
                        href={r.href}
                        className="group flex flex-col gap-1 rounded-xl border border-border bg-surface px-4 py-3.5 hover:border-accent transition-colors"
                      >
                        <span className="flex items-center gap-1.5 font-display text-lg group-hover:text-accent transition-colors">
                          {r.title}
                          <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </span>
                        {r.snippet && (
                          <span className="text-sm text-ink-muted line-clamp-2">{r.snippet}</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchPageInner />
    </Suspense>
  );
}
