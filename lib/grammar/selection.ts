import { GRAMMAR_POINTS } from "@/lib/grammar/data";
import type { GrammarPoint, GrammarCategory } from "@/types/grammar";
import type { CEFRLevel } from "@/types/dictionary";
import { pickWithSpacedRepetition } from "@/lib/spacedRepetition";

export type GrammarFilter = "all" | CEFRLevel | "saved" | "learning";

export interface GrammarSelectionContext {
  filter: GrammarFilter;
  savedSlugs: Set<string>;
  learningSlugs: Set<string>;
  recentSlugs: string[];
}

function poolForFilter(ctx: GrammarSelectionContext): GrammarPoint[] {
  switch (ctx.filter) {
    case "A1":
    case "A2":
    case "B1":
    case "B2":
    case "C1":
    case "C2":
      return GRAMMAR_POINTS.filter((g) => g.cefrLevel === ctx.filter);
    case "saved":
      return GRAMMAR_POINTS.filter((g) => ctx.savedSlugs.has(g.slug));
    case "learning":
      return GRAMMAR_POINTS.filter((g) => ctx.learningSlugs.has(g.slug));
    case "all":
    default:
      return GRAMMAR_POINTS;
  }
}

export function selectNextGrammarPoint(ctx: GrammarSelectionContext): GrammarPoint | null {
  const pool = poolForFilter(ctx);
  return pickWithSpacedRepetition("grammar", pool, (g) => g.slug, ctx.recentSlugs);
}

export function getGrammarPointBySlug(slug: string): GrammarPoint | undefined {
  return GRAMMAR_POINTS.find((g) => g.slug === slug);
}

export function totalGrammarPointCount(): number {
  return GRAMMAR_POINTS.length;
}

export function getGrammarCategoryCounts(): Record<GrammarCategory, number> {
  const counts = {} as Record<GrammarCategory, number>;
  for (const g of GRAMMAR_POINTS) {
    counts[g.category] = (counts[g.category] ?? 0) + 1;
  }
  return counts;
}
