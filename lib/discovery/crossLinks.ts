import { CORE_3000 } from "@/lib/dictionary/coreList";
import { DISCOVERY_ENTRIES } from "@/lib/discovery/data";
import type { DiscoveryEntry } from "@/types/discovery";
import type { WordSummary } from "@/types/dictionary";

/**
 * Cross-links between encyclopedia content and vocabulary — the "Volcano"
 * model from the product blueprint (an article about volcanoes surfaces
 * "eruption," "lava," "magma" as related vocabulary, and vice versa).
 *
 * Implemented as a COMPUTED relationship (text co-occurrence against the
 * real Core 3000 word list) rather than a stored join table. This matches
 * the blueprint's own MVP guidance: model relationships properly, but don't
 * stand up a database for it before there's a real need — a derived lookup
 * gives the same product value with zero schema/infrastructure cost, and
 * only surfaces genuine matches (a word actually has to appear in both the
 * article text and the real Core 3000 list) rather than hand-authored,
 * potentially-stale links.
 */

const STOP_WORDS = new Set([
  "its", "it's", "this", "that", "these", "those", "than", "then", "also",
  "into", "not", "yes", "you", "your", "they", "their", "them", "he", "she",
  "his", "her", "we", "our", "us", "be", "been", "being", "do", "does",
  "did", "will", "would", "may", "might", "one", "two", "three", "some",
  "more", "most", "much", "many", "very", "so", "just", "only", "even",
  "still", "each", "every", "other", "such", "own", "same", "too", "there",
  "here", "when", "where", "which", "who", "what", "how", "why", "get",
  "gets", "got", "make", "makes", "made", "like", "long", "small", "big",
  "large", "called", "known", "around", "have", "has", "had",
]);

// Function-word parts of speech to exclude — a Core 3000 word only counts
// as a genuine content link if it's a noun, verb, or adjective (the parts
// of speech that actually carry topic meaning), not grammatical scaffolding
// like conjunctions, articles, or plain adverbs of degree/frequency.
const CONTENT_PARTS_OF_SPEECH = new Set(["noun", "verb", "adjective", "adjective/adverb", "modal verb"]);

const CORE_WORD_MAP = new Map<string, WordSummary>();
for (const entry of CORE_3000) {
  if (CONTENT_PARTS_OF_SPEECH.has(entry.partOfSpeech)) {
    CORE_WORD_MAP.set(entry.word.toLowerCase(), entry);
  }
}

function tokenize(text: string): string[] {
  return text.toLowerCase().match(/[a-z']+/g) ?? [];
}

function discoveryEntryText(entry: DiscoveryEntry): string {
  return [entry.name, entry.simpleFact, ...entry.facts, entry.funFact ?? ""].join(" ");
}

/** Real Core 3000 words that actually appear in this entry's text. */
export function getRelatedVocabulary(entry: DiscoveryEntry, max = 6): WordSummary[] {
  const tokens = tokenize(discoveryEntryText(entry));
  const seen = new Set<string>();
  const matches: WordSummary[] = [];

  for (const token of tokens) {
    if (token.length <= 3 || STOP_WORDS.has(token) || seen.has(token)) continue;
    const word = CORE_WORD_MAP.get(token);
    if (word) {
      matches.push(word);
      seen.add(token);
      if (matches.length >= max) break;
    }
  }
  return matches;
}

/** Discovery entries whose text mentions this word — the reverse link. */
export function getRelatedDiscoveryEntries(word: string, max = 4): DiscoveryEntry[] {
  const target = word.toLowerCase();
  const matches: DiscoveryEntry[] = [];

  for (const entry of DISCOVERY_ENTRIES) {
    const tokens = new Set(tokenize(discoveryEntryText(entry)));
    if (tokens.has(target)) {
      matches.push(entry);
      if (matches.length >= max) break;
    }
  }
  return matches;
}
