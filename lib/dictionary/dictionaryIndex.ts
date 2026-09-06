import dictionaryIndexRaw from "@/data/dictionary-index.json";

/**
 * ~82,000 English words, sourced from Webster's Unabridged Dictionary
 * (1913, public domain via Project Gutenberg), filtered to drop entries
 * Webster's itself marks obsolete/archaic, and deduplicated against
 * everything already in CORE_3000 and ADVANCED_1500.
 *
 * This is a SEARCH INDEX ONLY — it stores nothing but the words
 * themselves, no definitions. Deliberately: the actual definitions in
 * this 1913 dictionary are written for educated adults of that era, not
 * English learners, and are frequently harder to read than the words
 * they define. Real definitions still come from the live modern
 * dictionary API — used at lookup time, for whichever specific word a
 * real person actually searches — the same pipeline every other word in
 * the app already goes through. This file only makes that word
 * *findable* via search; it plays no other role.
 *
 * Deliberately server-only: `lib/dictionary/coreList.ts` and
 * `advancedList.ts` are small enough to bundle into the browser, but at
 * ~1MB this file must not be — it's imported only here, and this module
 * is only ever called from a Server Action (see
 * `lib/dictionary/dictionarySearchAction.ts`), never from client code
 * directly.
 */
const DICTIONARY_INDEX: string[] = dictionaryIndexRaw as string[];

export function searchDictionaryIndex(query: string, limit = 8): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const starts: string[] = [];
  for (const word of DICTIONARY_INDEX) {
    if (word.startsWith(q)) {
      starts.push(word);
      if (starts.length >= limit) break;
    }
  }
  return starts;
}
