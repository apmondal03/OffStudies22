import Link from "next/link";
import { notFound } from "next/navigation";
import { Play } from "lucide-react";
import { DISCOVERY_ENTRIES } from "@/lib/discovery/data";
import { DISCOVERY_CATEGORY_LABEL, DISCOVERY_CATEGORY_EMOJI } from "@/types/discovery";
import type { DiscoveryCategory } from "@/types/discovery";

const VALID_CATEGORIES = new Set(Object.keys(DISCOVERY_CATEGORY_LABEL));

export default async function KidsDiscoverCategoryGridPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const isAll = category === "all";
  if (!isAll && !VALID_CATEGORIES.has(category)) notFound();

  const entries = isAll ? DISCOVERY_ENTRIES : DISCOVERY_ENTRIES.filter((e) => e.category === category);
  const label = isAll ? "Everything" : DISCOVERY_CATEGORY_LABEL[category as DiscoveryCategory];
  const emoji = isAll ? "🌟" : DISCOVERY_CATEGORY_EMOJI[category as DiscoveryCategory];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-16 text-center">
      <Link
        href="/kids/discover"
        className="inline-block text-sm font-semibold text-[var(--kids-ink-muted)] hover:text-[var(--kids-ink)] mb-4"
      >
        ← Topics
      </Link>
      <p className="text-5xl mb-2">{emoji}</p>
      <h1 className="kids-display text-4xl sm:text-5xl font-bold text-[var(--kids-ink)] mb-2">{label}</h1>
      <p className="text-lg text-[var(--kids-ink-muted)] mb-8">Tap one, or learn them all in order!</p>

      <Link
        href={`/kids/discover/${category}/learn`}
        className="kids-display inline-flex items-center gap-2 rounded-full bg-[var(--kids-accent-2)] px-7 py-3.5 text-lg font-bold text-white shadow-md hover:scale-105 active:scale-95 transition-transform mb-10"
      >
        <Play className="h-5 w-5 fill-current" />
        Learn All {entries.length}
      </Link>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {entries.map((e) => (
          <Link
            key={e.slug}
            href={`/kids/discover/${category}/${e.slug}`}
            className="animate-kids-pop flex flex-col items-center gap-1.5 rounded-3xl bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
          >
            <span className="text-5xl">{e.emoji}</span>
            <span className="kids-display text-base font-bold text-[var(--kids-ink)]">{e.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
