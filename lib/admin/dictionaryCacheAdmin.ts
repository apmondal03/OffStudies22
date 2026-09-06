"use server";

import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { getAdminUser } from "@/lib/admin/auth";
import type { CachedWordRow } from "@/lib/dictionary/wordCache";

export interface CacheStats {
  total: number;
}

/**
 * Never throws — this is called directly from the page's Server
 * Component render, so any thrown error here crashes the whole page
 * (and, worse, can crash a build-time static-generation attempt). Checks
 * configuration before authorization deliberately: "not configured" and
 * "not an authorized admin" are different situations, and only the first
 * one is safe to resolve with a quiet default rather than needing real
 * enforcement (the /admin layout itself is what actually gates access;
 * this is just a safe value to render if it's ever reached before that).
 */
export async function getCachedWordStats(): Promise<CacheStats> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { total: 0 };

  const admin = await getAdminUser();
  if (!admin) return { total: 0 };

  const { count } = await supabase.from("cached_words").select("*", { count: "exact", head: true });
  return { total: count ?? 0 };
}

/**
 * Fetches every cached word for export. Fine at the scale this cache
 * realistically grows to from organic usage (a few thousand entries at
 * most in any reasonable timeframe) — if it ever grew large enough for a
 * single fetch to become a real problem, this would need pagination, but
 * that's a known future limit, not something handled today.
 *
 * Unlike the stats function above, this one is only ever called from a
 * button click in a client component that already catches and displays
 * thrown errors — so throwing here is the right, expected behavior for
 * a genuine authorization failure. It still checks configuration first,
 * though, for the same reason: an unconfigured deployment isn't really
 * an authorization problem.
 */
export async function getAllCachedWords(): Promise<CachedWordRow[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return [];

  const admin = await getAdminUser();
  if (!admin) throw new Error("Not authorized.");

  const { data, error } = await supabase.from("cached_words").select("*").order("word");
  if (error || !data) return [];
  return data as CachedWordRow[];
}
