import Link from "next/link";
import { DISCOVERY_CATEGORY_LABEL, DISCOVERY_CATEGORY_EMOJI } from "@/types/discovery";
import type { DiscoveryCategory } from "@/types/discovery";
import { DISCOVERY_ENTRIES } from "@/lib/discovery/data";

const CATEGORIES = Object.keys(DISCOVERY_CATEGORY_LABEL) as DiscoveryCategory[];

export default function KidsDiscoverPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-16 text-center">
      <h1 className="kids-display text-4xl sm:text-5xl font-bold text-[var(--kids-ink)] mb-3">
        Discover the World
      </h1>
      <p className="text-lg text-[var(--kids-ink-muted)] mb-10">Pick something to explore!</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
        <Link
          href="/kids/discover/all"
          className="animate-kids-pop flex flex-col items-center gap-2 rounded-[2rem] bg-white p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
        >
          <span className="text-6xl">🌟</span>
          <span className="kids-display text-lg font-bold text-[var(--kids-ink)]">Everything</span>
          <span className="text-xs text-[var(--kids-ink-muted)]">{DISCOVERY_ENTRIES.length} topics</span>
        </Link>
        {CATEGORIES.map((cat) => {
          const count = DISCOVERY_ENTRIES.filter((e) => e.category === cat).length;
          return (
            <Link
              key={cat}
              href={`/kids/discover/${cat}`}
              className="animate-kids-pop flex flex-col items-center gap-2 rounded-[2rem] bg-white p-6 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <span className="text-6xl">{DISCOVERY_CATEGORY_EMOJI[cat]}</span>
              <span className="kids-display text-lg font-bold text-[var(--kids-ink)]">
                {DISCOVERY_CATEGORY_LABEL[cat]}
              </span>
              <span className="text-xs text-[var(--kids-ink-muted)]">{count} topics</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
