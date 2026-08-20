"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { getAdminUser } from "@/lib/admin/auth";

/**
 * Fails open: if Supabase isn't configured, or the settings row can't be
 * read for any reason, registration is treated as enabled — the same
 * "degrade to current behavior" pattern used everywhere else in the
 * accounts system, so a misconfigured or unreachable settings table can
 * never accidentally lock everyone out of signing in.
 */
export async function isRegistrationEnabled(): Promise<boolean> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return true;

  const { data, error } = await supabase
    .from("app_settings")
    .select("registration_enabled")
    .eq("id", true)
    .single();

  if (error || !data) return true;
  return data.registration_enabled;
}

export async function setRegistrationEnabled(enabled: boolean): Promise<void> {
  const admin = await getAdminUser();
  if (!admin) throw new Error("Not authorized.");

  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Accounts aren't configured on this deployment.");

  const { error } = await supabase
    .from("app_settings")
    .update({ registration_enabled: enabled })
    .eq("id", true);

  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/account");
}
