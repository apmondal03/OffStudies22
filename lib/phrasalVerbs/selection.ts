import { PHRASAL_VERBS } from "@/lib/phrasalVerbs/data";
import type { PhrasalVerbEntry, Formality } from "@/types/phrasalVerb";
import { pickWithSpacedRepetition } from "@/lib/spacedRepetition";

export type PhrasalVerbFilter = "all" | Formality | "saved" | "learning";

export interface PhrasalVerbSelectionContext {
  filter: PhrasalVerbFilter;
  savedSlugs: Set<string>;
  learningSlugs: Set<string>;
  recentSlugs: string[];
}

function poolForFilter(ctx: PhrasalVerbSelectionContext): PhrasalVerbEntry[] {
  switch (ctx.filter) {
    case "informal":
    case "neutral":
    case "formal":
      return PHRASAL_VERBS.filter((p) => p.formality === ctx.filter);
    case "saved":
      return PHRASAL_VERBS.filter((p) => ctx.savedSlugs.has(p.slug));
    case "learning":
      return PHRASAL_VERBS.filter((p) => ctx.learningSlugs.has(p.slug));
    case "all":
    default:
      return PHRASAL_VERBS;
  }
}

export function selectNextPhrasalVerb(ctx: PhrasalVerbSelectionContext): PhrasalVerbEntry | null {
  const pool = poolForFilter(ctx);
  return pickWithSpacedRepetition("phrasal-verbs", pool, (p) => p.slug, ctx.recentSlugs);
}

export function getPhrasalVerbBySlug(slug: string): PhrasalVerbEntry | undefined {
  return PHRASAL_VERBS.find((p) => p.slug === slug);
}

export function totalPhrasalVerbCount(): number {
  return PHRASAL_VERBS.length;
}
