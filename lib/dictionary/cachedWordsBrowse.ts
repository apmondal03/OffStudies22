"use server";

import { getSupabaseServerClient } from "@/lib/supabase/serverClient";

export interface DictionaryBrowseWord {
  word: string;
  slug: string;
  partOfSpeech: string;
  cefrLevel: string;
}

export interface DictionaryBrowsePage {
  words: DictionaryBrowseWord[];
  total: number;
}

/**
 * Browses the same `cached_words` table that powers instant repeat word
 * lookups — this page doesn't add any new data source, it just makes
 * that growing table browsable. Public, no admin check: `cached_words`
 * already has an "anyone can read" policy, since caching itself happens
 * on behalf of anonymous visitors too.
 */
export async function browseCachedWords(
  query: string,
  offset: number,
  limit: number
): Promise<DictionaryBrowsePage> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { words: [], total: 0 };

  let builder = supabase.from("cached_words").select("word, slug, data", { count: "exact" });
  const q = query.trim();
  if (q) {
    builder = builder.ilike("word", `${q}%`);
  }

  const { data, count, error } = await builder.order("word").range(offset, offset + limit - 1);
  if (error || !data) return { words: [], total: 0 };

  return {
    words: data.map((row) => ({
      word: row.word,
      slug: row.slug,
      partOfSpeech: row.data?.partOfSpeech ?? "",
      cefrLevel: row.data?.cefrLevel ?? "",
    })),
    total: count ?? 0,
  };
}
