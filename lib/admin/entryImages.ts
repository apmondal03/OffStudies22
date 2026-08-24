"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { getAdminUser } from "@/lib/admin/auth";
import { getAdminModule } from "@/lib/admin/registry";

/** Public read — used when rendering a public entry page to check for an override. */
export async function getEntryImageOverride(moduleId: string, slug: string): Promise<string | null> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("entry_image_overrides")
    .select("image_url")
    .eq("module_id", moduleId)
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data.image_url;
}

/** Public read — all overrides for a module at once, for merging into a listing page. */
export async function listEntryImageOverrides(moduleId: string): Promise<Record<string, string>> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return {};

  const { data, error } = await supabase
    .from("entry_image_overrides")
    .select("slug, image_url")
    .eq("module_id", moduleId);

  if (error || !data) return {};
  return Object.fromEntries(data.map((row) => [row.slug, row.image_url]));
}

export async function setEntryImageOverride(moduleId: string, slug: string, formData: FormData): Promise<void> {
  const admin = await getAdminUser();
  if (!admin) throw new Error("Not authorized.");

  const adminModule = getAdminModule(moduleId);
  if (!adminModule) throw new Error("Unknown content module.");

  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Accounts aren't configured on this deployment.");

  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) throw new Error("Please choose an image file.");

  const path = `${moduleId}-${slug}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
  const { error: uploadError } = await supabase.storage.from("content-images").upload(path, file, {
    contentType: file.type,
  });
  if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

  const { data: urlData } = supabase.storage.from("content-images").getPublicUrl(path);

  const { error } = await supabase
    .from("entry_image_overrides")
    .upsert({ module_id: moduleId, slug, image_url: urlData.publicUrl }, { onConflict: "module_id,slug" });

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/${moduleId}-photos`);
  revalidatePath(adminModule.publicListRoute);
  revalidatePath(`${adminModule.publicListRoute}/${slug}`);
}
