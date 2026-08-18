import { CORE_3000 } from "@/lib/dictionary/coreList";
import { PHRASAL_VERBS } from "@/lib/phrasalVerbs/data";
import { GRAMMAR_POINTS } from "@/lib/grammar/data";
import { IDIOMS } from "@/lib/idioms/data";
import { PREPOSITIONS } from "@/lib/prepositions/data";
import { DISCOVERY_ENTRIES } from "@/lib/discovery/data";

/**
 * Unified in-app search across every adult content type — the blueprint's
 * "internal application search," kept explicitly distinct from public SEO
 * (Next.js metadata/sitemap, unrelated to this). Implemented as simple
 * substring matching over the existing in-memory data files: appropriate at
 * the current content volume (a few thousand records total across all
 * types), per the blueprint's own guidance not to adopt a dedicated search
 * service (Algolia/Meilisearch) before relevance needs actually outgrow
 * this. Swapping the implementation later doesn't change this function's
 * signature or any calling code.
 */

export type SearchResultType =
  | "vocabulary"
  | "phrasal-verb"
  | "grammar"
  | "idiom"
  | "preposition"
  | "encyclopedia";

export interface SearchResult {
  type: SearchResultType;
  typeLabel: string;
  title: string;
  snippet: string;
  href: string;
}

const TYPE_LABEL: Record<SearchResultType, string> = {
  vocabulary: "Vocabulary",
  "phrasal-verb": "Phrasal Verb",
  grammar: "Grammar",
  idiom: "Idiom",
  preposition: "Preposition",
  encyclopedia: "Encyclopedia",
};

function matches(haystack: string, q: string): boolean {
  return haystack.toLowerCase().includes(q);
}

export function unifiedSearch(query: string, limitPerType = 5): Record<SearchResultType, SearchResult[]> {
  const q = query.trim().toLowerCase();
  const empty: Record<SearchResultType, SearchResult[]> = {
    vocabulary: [],
    "phrasal-verb": [],
    grammar: [],
    idiom: [],
    preposition: [],
    encyclopedia: [],
  };
  if (!q) return empty;

  const vocabulary: SearchResult[] = [];
  for (const w of CORE_3000) {
    if (matches(w.word, q)) {
      vocabulary.push({
        type: "vocabulary",
        typeLabel: TYPE_LABEL.vocabulary,
        title: w.word,
        snippet: `${w.partOfSpeech} · ${w.cefrLevel}`,
        href: `/word/${w.slug}`,
      });
      if (vocabulary.length >= limitPerType) break;
    }
  }

  const phrasalVerb: SearchResult[] = [];
  for (const p of PHRASAL_VERBS) {
    if (matches(p.phrase, q) || p.senses.some((s) => matches(s.meaning, q))) {
      phrasalVerb.push({
        type: "phrasal-verb",
        typeLabel: TYPE_LABEL["phrasal-verb"],
        title: p.phrase,
        snippet: p.senses[0]?.simpleDefinition ?? p.senses[0]?.meaning ?? "",
        href: `/phrasal-verbs/${p.slug}`,
      });
      if (phrasalVerb.length >= limitPerType) break;
    }
  }

  const grammar: SearchResult[] = [];
  for (const g of GRAMMAR_POINTS) {
    if (matches(g.title, q) || matches(g.explanation, q)) {
      grammar.push({
        type: "grammar",
        typeLabel: TYPE_LABEL.grammar,
        title: g.title,
        snippet: g.explanation,
        href: `/grammar/${g.slug}`,
      });
      if (grammar.length >= limitPerType) break;
    }
  }

  const idiom: SearchResult[] = [];
  for (const i of IDIOMS) {
    if (matches(i.idiom, q) || matches(i.meaning, q)) {
      idiom.push({
        type: "idiom",
        typeLabel: TYPE_LABEL.idiom,
        title: i.idiom,
        snippet: i.simpleDefinition,
        href: `/idioms/${i.slug}`,
      });
      if (idiom.length >= limitPerType) break;
    }
  }

  const preposition: SearchResult[] = [];
  for (const p of PREPOSITIONS) {
    if (matches(p.phrase, q) || p.senses.some((s) => matches(s.explanation, q))) {
      preposition.push({
        type: "preposition",
        typeLabel: TYPE_LABEL.preposition,
        title: p.phrase,
        snippet: p.senses[0]?.explanation ?? "",
        href: `/prepositions/${p.slug}`,
      });
      if (preposition.length >= limitPerType) break;
    }
  }

  const encyclopedia: SearchResult[] = [];
  for (const e of DISCOVERY_ENTRIES) {
    if (matches(e.name, q) || matches(e.simpleFact, q)) {
      encyclopedia.push({
        type: "encyclopedia",
        typeLabel: TYPE_LABEL.encyclopedia,
        title: e.name,
        snippet: e.simpleFact,
        href: `/encyclopedia/${e.slug}`,
      });
      if (encyclopedia.length >= limitPerType) break;
    }
  }

  return { vocabulary, "phrasal-verb": phrasalVerb, grammar, idiom, preposition, encyclopedia };
}

export function unifiedSearchTotalCount(query: string): number {
  const results = unifiedSearch(query, 1000);
  return Object.values(results).reduce((sum, arr) => sum + arr.length, 0);
}
