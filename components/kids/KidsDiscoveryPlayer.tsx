"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DISCOVERY_ENTRIES } from "@/lib/discovery/data";
import { DISCOVERY_CATEGORY_LABEL } from "@/types/discovery";
import type { DiscoveryCategory } from "@/types/discovery";
import { KidsWordCard } from "@/components/kids/KidsWordCard";
import { KidsNavControls } from "@/components/kids/KidsNavControls";
import { useKidsPlayer } from "@/hooks/useKidsPlayer";
import { markSeen } from "@/lib/kids/storage";

const VALID_CATEGORIES = new Set(Object.keys(DISCOVERY_CATEGORY_LABEL));

export function KidsDiscoveryPlayer({ category, startTopic }: { category: string; startTopic?: string }) {
  const isAll = category === "all";
  const entries = isAll ? DISCOVERY_ENTRIES : DISCOVERY_ENTRIES.filter((e) => e.category === category);

  const { current, index, total, next, previous, goTo } = useKidsPlayer(entries, (e) => e.slug);

  useEffect(() => {
    if (startTopic) goTo(startTopic);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTopic]);

  useEffect(() => {
    if (current) markSeen("discover", current.slug);
  }, [current]);

  const categoryLabel = isAll
    ? "All Topics"
    : VALID_CATEGORIES.has(category)
      ? DISCOVERY_CATEGORY_LABEL[category as DiscoveryCategory]
      : "Discover";

  if (!current) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="kids-display text-2xl font-bold text-[var(--kids-ink)]">Nothing here yet.</p>
        <Link href="/kids/discover" className="mt-4 inline-block text-[var(--kids-accent)] font-semibold">
          ← Back to topics
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8 sm:py-12">
      <Link
        href={`/kids/discover/${category}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--kids-ink-muted)] hover:text-[var(--kids-ink)] mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        {categoryLabel}
      </Link>

      <div key={current.slug} className="animate-kids-pop flex flex-col items-center">
        <KidsWordCard headline={current.name} visual={current.emoji} sentence={current.simpleFact} />
      </div>

      <KidsNavControls onPrevious={previous} onNext={next} index={index} total={total} />
    </div>
  );
}
