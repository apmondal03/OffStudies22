import { createBrowserClient } from "@supabase/ssr";

/**
 * Accounts & sync are opt-in and adult-track only — Kids Mode and Young
 * Learners intentionally never touch this file (see README for the full
 * reasoning: no accounts, no PII, ever, for the children's tracks).
 *
 * Every function here degrades gracefully to `null`/no-op when
 * NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY aren't set,
 * rather than throwing — so the app works exactly as it always has (fully
 * local, no accounts) until a Supabase project is actually configured.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowserClient() {
  if (!isSupabaseConfigured) return null;
  if (!browserClient) {
    browserClient = createBrowserClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
  }
  return browserClient;
}
