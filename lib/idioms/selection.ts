import { IDIOMS } from "@/lib/idioms/data";
import type { IdiomEntry, IdiomCategory, IdiomRegister } from "@/types/idiom";
import { pickWithSpacedRepetition } from "@/lib/spacedRepetition";

export type IdiomFilter = "all" | IdiomRegister | "saved" | "learning";

export interface IdiomSelectionContext {
  filter: IdiomFilter;
  savedSlugs: Set<string>;
  learningSlugs: Set<string>;
  recentSlugs: string[];
}

function poolForFilter(ctx: IdiomSelectionContext): IdiomEntry[] {
  switch (ctx.filter) {
    case "informal":
    case "neutral":
    case "formal":
      return IDIOMS.filter((i) => i.register === ctx.filter);
    case "saved":
      return IDIOMS.filter((i) => ctx.savedSlugs.has(i.slug));
    case "learning":
      return IDIOMS.filter((i) => ctx.learningSlugs.has(i.slug));
    case "all":
    default:
      return IDIOMS;
  }
}

export function selectNextIdiom(ctx: IdiomSelectionContext): IdiomEntry | null {
  const pool = poolForFilter(ctx);
  return pickWithSpacedRepetition("idioms", pool, (i) => i.slug, ctx.recentSlugs);
}

export function getIdiomBySlug(slug: string): IdiomEntry | undefined {
  return IDIOMS.find((i) => i.slug === slug);
}

export function totalIdiomCount(): number {
  return IDIOMS.length;
}

export function getIdiomCategoryCounts(): Record<IdiomCategory, number> {
  const counts = {} as Record<IdiomCategory, number>;
  for (const i of IDIOMS) {
    counts[i.category] = (counts[i.category] ?? 0) + 1;
  }
  return counts;
}
