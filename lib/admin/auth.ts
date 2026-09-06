import { getSupabaseServerClient } from "@/lib/supabase/serverClient";

/**
 * Admin access is a plain email allowlist read from an environment
 * variable — deliberately not a database roles table. This keeps "who is
 * an admin" something you control by editing one Vercel environment
 * variable (comma-separated emails), not something that needs a database
 * migration or a second admin-only sign-up flow to change.
 *
 * Set ADMIN_EMAILS in your environment, e.g.:
 *   ADMIN_EMAILS=you@example.com,someone-else@example.com
 */
function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** Exported so other checks (like the registration-pause gate) can exempt
 *  admin emails without duplicating the allowlist-parsing logic. */
export function isAdminEmail(email: string): boolean {
  return getAdminEmails().includes(email.trim().toLowerCase());
}

export interface AdminUser {
  id: string;
  email: string;
}

/** Returns the signed-in admin user, or null if not signed in / not an admin. */
export async function getAdminUser(): Promise<AdminUser | null> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;

  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user?.email) return null;

  const adminEmails = getAdminEmails();
  if (!adminEmails.includes(user.email.toLowerCase())) return null;

  return { id: user.id, email: user.email };
}
