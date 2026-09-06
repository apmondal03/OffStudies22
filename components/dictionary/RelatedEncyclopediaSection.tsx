import Link from "next/link";
import { getRelatedDiscoveryEntries } from "@/lib/discovery/crossLinks";

export function RelatedEncyclopediaSection({ word }: { word: string }) {
  const entries = getRelatedDiscoveryEntries(word);
  if (entries.length === 0) return null;

  return (
    <section className="mt-10 border-t border-border pt-8">
      <h2 className="text-sm uppercase tracking-wide text-ink-faint mb-4">
        Related encyclopedia articles
      </h2>
      <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {entries.map((e) => (
          <li key={e.slug}>
            <Link
              href={`/encyclopedia/${e.slug}`}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-3.5 text-center hover:border-accent transition-colors"
            >
              <span className="text-2xl">{e.emoji}</span>
              <span className="text-sm font-medium">{e.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
