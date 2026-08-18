import { YOUNG_SIGHT_WORDS } from "@/lib/youngLearners/sightWords";
import { YOUNG_GRAMMAR } from "@/lib/youngLearners/grammar";
import type { YoungSightWordEntry, YoungGrammarPoint, SightWordTier, YoungGrammarCategory } from "@/types/youngLearner";
import { pickWithSpacedRepetition } from "@/lib/spacedRepetition";

// --- Sight Words ---

export type YoungSightWordFilter = "all" | SightWordTier | "saved" | "learning";

export interface YoungSightWordSelectionContext {
  filter: YoungSightWordFilter;
  savedSlugs: Set<string>;
  learningSlugs: Set<string>;
  recentSlugs: string[];
}

function sightWordPool(ctx: YoungSightWordSelectionContext): YoungSightWordEntry[] {
  switch (ctx.filter) {
    case "primer":
    case "grade1":
    case "grade2":
    case "grade3":
      return YOUNG_SIGHT_WORDS.filter((w) => w.tier === ctx.filter);
    case "saved":
      return YOUNG_SIGHT_WORDS.filter((w) => ctx.savedSlugs.has(w.slug));
    case "learning":
      return YOUNG_SIGHT_WORDS.filter((w) => ctx.learningSlugs.has(w.slug));
    case "all":
    default:
      return YOUNG_SIGHT_WORDS;
  }
}

export function selectNextYoungSightWord(ctx: YoungSightWordSelectionContext): YoungSightWordEntry | null {
  const pool = sightWordPool(ctx);
  return pickWithSpacedRepetition("young-sight-words", pool, (w) => w.slug, ctx.recentSlugs);
}

export function getYoungSightWordBySlug(slug: string): YoungSightWordEntry | undefined {
  return YOUNG_SIGHT_WORDS.find((w) => w.slug === slug);
}

export function totalYoungSightWordCount(): number {
  return YOUNG_SIGHT_WORDS.length;
}

// --- Grammar ---

export type YoungGrammarFilter = "all" | YoungGrammarCategory | "saved" | "learning";

export interface YoungGrammarSelectionContext {
  filter: YoungGrammarFilter;
  savedSlugs: Set<string>;
  learningSlugs: Set<string>;
  recentSlugs: string[];
}

function grammarPool(ctx: YoungGrammarSelectionContext): YoungGrammarPoint[] {
  switch (ctx.filter) {
    case "word-types":
    case "sentences":
    case "punctuation":
    case "word-play":
      return YOUNG_GRAMMAR.filter((g) => g.category === ctx.filter);
    case "saved":
      return YOUNG_GRAMMAR.filter((g) => ctx.savedSlugs.has(g.slug));
    case "learning":
      return YOUNG_GRAMMAR.filter((g) => ctx.learningSlugs.has(g.slug));
    case "all":
    default:
      return YOUNG_GRAMMAR;
  }
}

export function selectNextYoungGrammar(ctx: YoungGrammarSelectionContext): YoungGrammarPoint | null {
  const pool = grammarPool(ctx);
  return pickWithSpacedRepetition("young-grammar", pool, (g) => g.slug, ctx.recentSlugs);
}

export function getYoungGrammarBySlug(slug: string): YoungGrammarPoint | undefined {
  return YOUNG_GRAMMAR.find((g) => g.slug === slug);
}

export function totalYoungGrammarCount(): number {
  return YOUNG_GRAMMAR.length;
}
