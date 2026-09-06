import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import type { WordEntry } from "@/types/dictionary";

/**
 * How long a cached entry is trusted before it's considered worth
 * refreshing. Not a hard expiry — a stale entry still gets served (and
 * still beats hitting the external API), it just also triggers a
 * re-fetch so the cache doesn't silently freeze forever.
 */
const STALE_AFTER_MS = 90 * 24 * 60 * 60 * 1000; // 90 days

export interface CachedWordRow {
  slug: string;
  word: string;
  data: WordEntry;
  source: string;
  fetched_at: string;
  updated_at: string;
}

/** Never throws — caching is purely an optimization, so any failure here
 *  (including Supabase not being configured at all) should fall through
 *  to the normal live-fetch path rather than breaking word lookups. */
export async function getCachedWord(slug: string): Promise<CachedWordRow | null> {
  try {
    const supabase = await getSupabaseServerClient();
    if (!supabase) return null;

    const { data, error } = await supabase.from("cached_words").select("*").eq("slug", slug).single();
    if (error || !data) return null;
    return data as CachedWordRow;
  } catch {
    return null;
  }
}

export function isCacheStale(updatedAt: string): boolean {
  return Date.now() - new Date(updatedAt).getTime() > STALE_AFTER_MS;
}

export async function saveCachedWord(slug: string, word: string, data: WordEntry): Promise<void> {
  try {
    const supabase = await getSupabaseServerClient();
    if (!supabase) return;

    await supabase.from("cached_words").upsert(
      { slug, word, data, source: "wiktionary", fetched_at: new Date().toISOString() },
      { onConflict: "slug" }
    );
  } catch {
    // Saving is best-effort — a failed write just means this word gets
    // fetched live again next time, same as if caching didn't exist.
  }
}
