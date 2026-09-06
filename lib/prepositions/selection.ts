import { PREPOSITIONS } from "@/lib/prepositions/data";
import type { PrepositionEntry, PrepositionType } from "@/types/preposition";
import { pickWithSpacedRepetition } from "@/lib/spacedRepetition";

export type PrepositionFilter = "all" | PrepositionType | "saved" | "learning";

export interface PrepositionSelectionContext {
  filter: PrepositionFilter;
  savedSlugs: Set<string>;
  learningSlugs: Set<string>;
  recentSlugs: string[];
}

function poolForFilter(ctx: PrepositionSelectionContext): PrepositionEntry[] {
  switch (ctx.filter) {
    case "core":
    case "adjective-preposition":
    case "noun-preposition":
      return PREPOSITIONS.filter((p) => p.type === ctx.filter);
    case "saved":
      return PREPOSITIONS.filter((p) => ctx.savedSlugs.has(p.slug));
    case "learning":
      return PREPOSITIONS.filter((p) => ctx.learningSlugs.has(p.slug));
    case "all":
    default:
      return PREPOSITIONS;
  }
}

export function selectNextPreposition(ctx: PrepositionSelectionContext): PrepositionEntry | null {
  const pool = poolForFilter(ctx);
  return pickWithSpacedRepetition("prepositions", pool, (p) => p.slug, ctx.recentSlugs);
}

export function getPrepositionBySlug(slug: string): PrepositionEntry | undefined {
  return PREPOSITIONS.find((p) => p.slug === slug);
}

export function totalPrepositionCount(): number {
  return PREPOSITIONS.length;
}
