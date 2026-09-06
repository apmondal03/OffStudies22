import { getSupabaseServerClient } from "@/lib/supabase/serverClient";

/**
 * TOTP-based 2FA specifically for /admin — layered on top of the existing
 * magic-link sign-in rather than replacing it. Magic-link stays the only
 * sign-in method (simplest, no password-security surface for anyone), but
 * reaching /admin additionally requires a verified TOTP code this session.
 *
 * Supabase Auth's built-in MFA API tracks this via "Authenticator Assurance
 * Level" (AAL) on the session: aal1 = single factor (the magic link),
 * aal2 = a second factor (TOTP) has also been verified this session. A
 * signed-in admin without an enrolled TOTP factor is sent to set one up
 * once; an admin who has one but is only at aal1 (e.g. a fresh sign-in) is
 * sent to enter a code before /admin unlocks.
 */

export type MfaStatus = "not-enrolled" | "needs-verification" | "verified";

export async function getMfaStatus(): Promise<MfaStatus> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return "not-enrolled";

  const { data: factorsData } = await supabase.auth.mfa.listFactors();
  const hasVerifiedFactor = (factorsData?.totp ?? []).some((f) => f.status === "verified");

  if (!hasVerifiedFactor) return "not-enrolled";

  const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aalData?.currentLevel === "aal2") return "verified";

  return "needs-verification";
}
