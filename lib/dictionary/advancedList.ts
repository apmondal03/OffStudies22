import advancedListRaw from "@/data/advanced-1500.json";
import type { WordSummary, SearchSuggestion } from "@/types/dictionary";

/**
 * A separate list from CORE_3000, not an extension of it — this is the
 * C1/C2 tier the product deliberately keeps apart from "Core 3000" so that
 * name stays literally accurate (the curated ~3,000-word A1-B2 set).
 * Currently a first batch (156 entries: 106 C1, 50 C2), not the full
 * ~1,500-word target — see README for the phased plan. Same shape and
 * lookup pattern as CORE_3000 deliberately, so every piece of code that
 * already knows how to work with a WordSummary works here unchanged.
 */
export const ADVANCED_1500: WordSummary[] = advancedListRaw as WordSummary[];

const bySlug = new Map<string, WordSummary>();
const byWordLower = new Map<string, WordSummary[]>();

for (const entry of ADVANCED_1500) {
  bySlug.set(entry.slug, entry);
  const key = entry.word.toLowerCase();
  const list = byWordLower.get(key) ?? [];
  list.push(entry);
  byWordLower.set(key, list);
}

export function getAdvancedEntryBySlug(slug: string): WordSummary | undefined {
  return bySlug.get(slug);
}

export function getAdvancedEntriesByWord(word: string): WordSummary[] {
  return byWordLower.get(word.toLowerCase()) ?? [];
}

export function searchAdvancedList(query: string, limit = 20): SearchSuggestion[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const starts: WordSummary[] = [];
  const contains: WordSummary[] = [];

  for (const entry of ADVANCED_1500) {
    const w = entry.word.toLowerCase();
    if (w.startsWith(q)) starts.push(entry);
    else if (w.includes(q)) contains.push(entry);
    if (starts.length >= limit) break;
  }

  const combined = [...starts, ...contains].slice(0, limit);
  return combined.map((e) => ({
    word: e.word,
    slug: e.slug,
    partOfSpeech: e.partOfSpeech,
    cefrLevel: e.cefrLevel,
  }));
}
