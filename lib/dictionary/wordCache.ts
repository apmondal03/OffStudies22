import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import type { WordEntry } from "@/types/dictionary";

/**
 * How long a cached entry is trusted before it's considered worth
 * refreshing. Not a hard expiry — a stale entry still gets served (and
 * still beats hitting the external API), it just also triggers a
 * re-fetch so the cache doesn't silently freeze forever.
 */
const STALE_AFTER_MS = 90 * 24 * 60 * 60 * 1000; // 90 days

/**
 * Every Supabase call here is capped to this long. Caching is meant to
 * make word lookups FASTER — if Supabase itself is ever slow (its free
 * tier pauses after inactivity and can take a moment to fully wake back
 * up after restoring), the cache-check must never be allowed to eat into
 * the time budget that should go to the actual dictionary API fetch.
 * Without this, a slow Supabase response could silently starve the
 * retry logic on the real lookup, turning "our optimization is slow
 * right now" into "word lookups are broken," which defeats the entire
 * point of caching being a pure speed optimization.
 */
const CACHE_TIMEOUT_MS = 2500;

export interface CachedWordRow {
  slug: string;
  word: string;
  data: WordEntry;
  source: string;
  fetched_at: string;
  updated_at: string;
}

/** Never throws — caching is purely an optimization, so any failure here
 *  (including Supabase not being configured at all, or simply being
 *  slow) should fall through to the normal live-fetch path rather than
 *  breaking or even delaying word lookups. */
export async function getCachedWord(slug: string): Promise<CachedWordRow | null> {
  try {
    const supabase = await getSupabaseServerClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("cached_words")
      .select("*")
      .eq("slug", slug)
      .abortSignal(AbortSignal.timeout(CACHE_TIMEOUT_MS))
      .single();
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

    await supabase
      .from("cached_words")
      .upsert(
        { slug, word, data, source: "wiktionary", fetched_at: new Date().toISOString() },
        { onConflict: "slug" }
      )
      .abortSignal(AbortSignal.timeout(CACHE_TIMEOUT_MS));
  } catch {
    // Saving is best-effort — a failed write just means this word gets
    // fetched live again next time, same as if caching didn't exist.
  }
}
