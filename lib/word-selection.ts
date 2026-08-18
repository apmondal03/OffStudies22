import { CORE_3000 } from "@/lib/dictionary/coreList";
import type { WordSummary, CEFRLevel, LearningStatus } from "@/types/dictionary";
import { pickWithSpacedRepetition } from "@/lib/spacedRepetition";

export type StreamFilter =
  | "essential"
  | "A1"
  | "A2"
  | "B1"
  | "B2"
  | "random"
  | "saved"
  | "learning";

export interface SelectionContext {
  filter: StreamFilter;
  savedSlugs: Set<string>;
  learningSlugs: Set<string>;
  knownSlugs: Set<string>;
  /** Slugs shown recently, most recent last — used to avoid immediate repeats. */
  recentSlugs: string[];
}

const ESSENTIAL_LEVELS: CEFRLevel[] = ["A1", "A2"];

function poolForFilter(ctx: SelectionContext): WordSummary[] {
  switch (ctx.filter) {
    case "essential":
      return CORE_3000.filter((w) => ESSENTIAL_LEVELS.includes(w.cefrLevel));
    case "A1":
    case "A2":
    case "B1":
    case "B2":
      return CORE_3000.filter((w) => w.cefrLevel === ctx.filter);
    case "saved":
      return CORE_3000.filter((w) => ctx.savedSlugs.has(w.slug));
    case "learning":
      return CORE_3000.filter((w) => ctx.learningSlugs.has(w.slug));
    case "random":
    default:
      return CORE_3000;
  }
}

/**
 * Picks the next word to show in the Word Stream: prefers words due for
 * spaced-repetition review (see lib/spacedRepetition.ts), biased away from
 * words shown in the last few picks so the same word doesn't reappear too
 * soon; falls back to random selection within the active filter when
 * nothing is due.
 */
export function selectNextWord(ctx: SelectionContext): WordSummary | null {
  const pool = poolForFilter(ctx);
  return pickWithSpacedRepetition("vocabulary", pool, (w) => w.slug, ctx.recentSlugs);
}

export function selectPreviousWord(
  ctx: SelectionContext,
  currentIndex: number
): WordSummary | null {
  if (currentIndex <= 0) return null;
  const slug = ctx.recentSlugs[currentIndex - 1];
  return CORE_3000.find((w) => w.slug === slug) ?? null;
}

export function poolSizeForFilter(
  filter: StreamFilter,
  savedSlugs: Set<string>,
  learningSlugs: Set<string>
): number {
  return poolForFilter({
    filter,
    savedSlugs,
    learningSlugs,
    knownSlugs: new Set(),
    recentSlugs: [],
  }).length;
}

export function computeProgress(statusBySlug: Record<string, LearningStatus>) {
  const total = CORE_3000.length;
  let known = 0;
  let learning = 0;
  for (const status of Object.values(statusBySlug)) {
    if (status === "known") known++;
    else if (status === "learning") learning++;
  }
  const unseen = total - known - learning;
  return {
    total,
    known,
    learning,
    unseen,
    knownPct: Math.round((known / total) * 100),
    learningPct: Math.round((learning / total) * 100),
    unseenPct: Math.round((unseen / total) * 100),
  };
}
