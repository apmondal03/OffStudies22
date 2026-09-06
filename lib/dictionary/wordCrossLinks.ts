import { PHRASAL_VERBS } from "@/lib/phrasalVerbs/data";
import { IDIOMS } from "@/lib/idioms/data";
import type { PhrasalVerbEntry } from "@/types/phrasalVerb";
import type { IdiomEntry } from "@/types/idiom";

/**
 * Computed, not stored — same reasoning as lib/discovery/crossLinks.ts.
 * A phrasal verb is related to a word when that word is its base verb
 * ("give" → "give up," "give in," "give away"), a precise, meaningful
 * match rather than the fuzzy text co-occurrence used for Encyclopedia
 * links. An idiom is related when the word appears as a whole word inside
 * the idiom's text.
 */

export function getRelatedPhrasalVerbs(word: string, max = 6): PhrasalVerbEntry[] {
  const target = word.toLowerCase();
  return PHRASAL_VERBS.filter((p) => p.baseVerb.toLowerCase() === target).slice(0, max);
}

function containsWholeWord(text: string, word: string): boolean {
  const pattern = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
  return pattern.test(text);
}

export function getRelatedIdioms(word: string, max = 6): IdiomEntry[] {
  return IDIOMS.filter((i) => containsWholeWord(i.idiom, word)).slice(0, max);
}
