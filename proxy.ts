import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseMiddlewareClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request });

  if (!isSupabaseConfigured) return response;

  const supabase = getSupabaseMiddlewareClient(request, response);
  if (!supabase) return response;

  // Touching getUser() refreshes the session cookie if it's about to expire.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    /*
     * Skip static assets and image optimization requests — session
     * refresh is only relevant for actual page/API navigations.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
