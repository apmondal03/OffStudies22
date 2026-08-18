import Link from "next/link";
import { notFound } from "next/navigation";
import { Play } from "lucide-react";
import { KIDS_WORDS } from "@/lib/kids/words";
import { KIDS_CATEGORY_LABEL, KIDS_CATEGORY_EMOJI } from "@/types/kids";
import type { KidsCategory } from "@/types/kids";

const VALID_CATEGORIES = new Set(Object.keys(KIDS_CATEGORY_LABEL));

export default async function KidsWordsCategoryGridPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const isAll = category === "all";
  if (!isAll && !VALID_CATEGORIES.has(category)) notFound();

  const words = isAll ? KIDS_WORDS : KIDS_WORDS.filter((w) => w.category === category);
  const label = isAll ? "All Words" : KIDS_CATEGORY_LABEL[category as KidsCategory];
  const emoji = isAll ? "🌟" : KIDS_CATEGORY_EMOJI[category as KidsCategory];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-16 text-center">
      <Link
        href="/kids/words"
        className="inline-block text-sm font-semibold text-[var(--kids-ink-muted)] hover:text-[var(--kids-ink)] mb-4"
      >
        ← Topics
      </Link>
      <p className="text-5xl mb-2">{emoji}</p>
      <h1 className="kids-display text-4xl sm:text-5xl font-bold text-[var(--kids-ink)] mb-2">{label}</h1>
      <p className="text-lg text-[var(--kids-ink-muted)] mb-8">Tap a word, or learn them all in order!</p>

      <Link
        href={`/kids/words/${category}/learn`}
        className="kids-display inline-flex items-center gap-2 rounded-full bg-[var(--kids-accent)] px-7 py-3.5 text-lg font-bold text-white shadow-md hover:scale-105 active:scale-95 transition-transform mb-10"
      >
        <Play className="h-5 w-5 fill-current" />
        Learn All {words.length} Words
      </Link>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {words.map((w) => (
          <Link
            key={w.slug}
            href={`/kids/words/${category}/${w.slug}`}
            className="animate-kids-pop flex flex-col items-center gap-1.5 rounded-3xl bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
          >
            <span className="text-5xl">{w.emoji}</span>
            <span className="kids-display text-base font-bold text-[var(--kids-ink)]">{w.word}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
