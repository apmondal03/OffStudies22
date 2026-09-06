import { type NextRequest, NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase/serverClient";

/**
 * Every magic link now points here instead of straight at a page like
 * /admin or /account. That distinction matters: this route runs entirely
 * server-side, so it can exchange the link's code/token for a session and
 * have Supabase write the session cookie via a Set-Cookie response header
 * — all BEFORE redirecting anywhere. Landing directly on a server-rendered
 * page like /admin used to fail every time: that page's own server-side
 * "are you signed in?" check ran on the very first request, before the
 * browser's JavaScript had even loaded to process the link — so it always
 * said no and bounced back to sign-in, regardless of how valid the link
 * actually was.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const next = searchParams.get("next") ?? "/account";
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.redirect(`${origin}/account`);
  }

  let verified = false;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    verified = !error;
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    verified = !error;
  }

  if (verified) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(`${origin}/account?error=link_invalid`);
}
