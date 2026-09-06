import { after } from "next/server";
import { resolveWordOnServer, slugify } from "./freeDictionaryProvider";
import { getCachedWord, saveCachedWord, isCacheStale } from "./wordCache";
import type { WordEntry } from "@/types/dictionary";

/**
 * The Supabase-backed persistent cache, layered on top of the plain
 * `resolveWordOnServer`. Deliberately kept in its OWN file rather than
 * built into `freeDictionaryProvider.ts`: that file is shared by both
 * server and client code (its exported `dictionaryProvider.getWord`
 * branches on `typeof window`), so anything imported at its top level —
 * even something only used on the server branch — risks being pulled
 * into the browser bundle by the build tool's static analysis. This file
 * is only ever imported by genuinely server-only code: the `/api/word`
 * Route Handler and the word detail page's Server Component. Neither of
 * those is ever bundled for the browser, so `wordCache.ts`'s dependency
 * on `next/headers` (which cannot appear in any client bundle at all) is
 * safe here in a way it wasn't inside the shared file.
 */
export async function resolveWordWithCache(word: string): Promise<WordEntry | null> {
  const slug = slugify(word);

  const cached = await getCachedWord(slug);
  if (cached && !isCacheStale(cached.updated_at)) {
    return cached.data;
  }

  const result = await resolveWordOnServer(word);

  if (result) {
    // Deliberately not awaited on the response path — saving to the
    // cache should never delay showing the user their result, since the
    // whole point of caching is to make future lookups faster, not to
    // slow this one down. `after()` (not a bare unawaited call) keeps
    // the function alive long enough for the write to actually finish
    // after the response is sent, rather than risking it getting killed
    // mid-write the instant the response goes out.
    after(() => saveCachedWord(slug, word, result));
    return result;
  }

  // A live fetch returning nothing (e.g. a transient API issue) still
  // has a stale cached fallback to lean on, if one exists.
  return cached?.data ?? null;
}
