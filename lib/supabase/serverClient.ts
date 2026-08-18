import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export { isSupabaseConfigured };

/**
 * Used in Server Components, layouts, and Route Handlers — anywhere that
 * isn't the middleware itself (see lib/supabase/server.ts's
 * getSupabaseMiddlewareClient for that specific case, which needs the
 * request/response pair instead of the cookies() API).
 */
export async function getSupabaseServerClient() {
  if (!isSupabaseConfigured) return null;

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Called from a Server Component that can't set cookies — safe to
            // ignore since the middleware already handles session refresh.
          }
        },
      },
    }
  );
}
