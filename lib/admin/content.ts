"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { getAdminUser } from "@/lib/admin/auth";
import { getAdminModule } from "@/lib/admin/registry";
import { parseCsv } from "@/lib/admin/csv";
import type { AdminFieldDef } from "@/types/adminContent";

export interface AdminContentRow {
  id: string;
  module_id: string;
  slug: string;
  data: Record<string, unknown>;
  created_at: string;
}

function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

/** Parses raw FormData into a JSON object using the module's field schema —
 *  the one place that knows "list" fields are newline-separated text. */
function parseFormData(fields: AdminFieldDef[], formData: FormData): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (const field of fields) {
    const raw = String(formData.get(field.key) ?? "").trim();
    if (field.type === "list") {
      data[field.key] = raw
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    } else {
      data[field.key] = raw;
    }
  }
  return data;
}

function validate(fields: AdminFieldDef[], data: Record<string, unknown>) {
  for (const field of fields) {
    if (!field.required) continue;
    const value = data[field.key];
    const isEmpty = field.type === "list" ? !Array.isArray(value) || value.length === 0 : !value;
    if (isEmpty) throw new Error(`"${field.label}" is required.`);
  }
}

async function requireAdmin() {
  const admin = await getAdminUser();
  if (!admin) redirect("/account");
  return admin;
}

/** Public read — used by public pages to merge admin content into the static lists. No auth required. */
export async function listPublicAdminEntries(moduleId: string): Promise<{ slug: string; data: Record<string, unknown> }[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("admin_content")
    .select("slug, data")
    .eq("module_id", moduleId);

  if (error || !data) return [];
  return data as { slug: string; data: Record<string, unknown> }[];
}

export async function getPublicAdminEntryBySlug(moduleId: string, slug: string) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("admin_content")
    .select("slug, data")
    .eq("module_id", moduleId)
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data as { slug: string; data: Record<string, unknown> };
}

/** Admin-only: full rows, for the /admin list and edit pages. */
export async function listAdminEntries(moduleId: string): Promise<AdminContentRow[]> {
  await requireAdmin();
  const supabase = await getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("admin_content")
    .select("*")
    .eq("module_id", moduleId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as AdminContentRow[];
}

export async function getAdminEntryById(id: string): Promise<AdminContentRow | null> {
  await requireAdmin();
  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase.from("admin_content").select("*").eq("id", id).single();
  if (error || !data) return null;
  return data as AdminContentRow;
}

export async function createAdminEntry(moduleId: string, formData: FormData) {
  const admin = await requireAdmin();
  const adminModule = getAdminModule(moduleId);
  if (!adminModule) throw new Error("Unknown content module.");

  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Accounts aren't configured on this deployment.");

  const data = parseFormData(adminModule.fields, formData);
  validate(adminModule.fields, data);

  const slugSource = String(data[adminModule.slugSourceField] ?? "");
  const { error } = await supabase.from("admin_content").insert({
    module_id: moduleId,
    slug: slugify(slugSource),
    data,
    created_by: admin.id,
  });

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/${moduleId}`);
  revalidatePath(adminModule.publicListRoute);
  redirect(`/admin/${moduleId}`);
}

export async function updateAdminEntry(id: string, moduleId: string, formData: FormData) {
  await requireAdmin();
  const adminModule = getAdminModule(moduleId);
  if (!adminModule) throw new Error("Unknown content module.");

  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Accounts aren't configured on this deployment.");

  const data = parseFormData(adminModule.fields, formData);
  validate(adminModule.fields, data);

  const slugSource = String(data[adminModule.slugSourceField] ?? "");
  const { error } = await supabase
    .from("admin_content")
    .update({ slug: slugify(slugSource), data })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/${moduleId}`);
  revalidatePath(adminModule.publicListRoute);
  redirect(`/admin/${moduleId}`);
}

export async function deleteAdminEntry(id: string, moduleId: string) {
  await requireAdmin();
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Accounts aren't configured on this deployment.");

  const { error } = await supabase.from("admin_content").delete().eq("id", id);
  if (error) throw new Error(error.message);

  const adminModule = getAdminModule(moduleId);
  revalidatePath(`/admin/${moduleId}`);
  if (adminModule) revalidatePath(adminModule.publicListRoute);
}

export interface BulkImportResult {
  succeeded: number;
  failed: { row: number; message: string }[];
}

/** Reads an uploaded CSV file, parses + validates it against the module's
 *  field schema, and upserts every valid row — parse errors and database
 *  errors are reported together so the admin sees one combined result. */
export async function importAdminEntriesFromCsv(moduleId: string, formData: FormData): Promise<BulkImportResult> {
  const admin = await requireAdmin();
  const adminModule = getAdminModule(moduleId);
  if (!adminModule) throw new Error("Unknown content module.");

  const file = formData.get("file");
  if (!(file instanceof File)) throw new Error("No file was uploaded.");

  const text = await file.text();
  const { validRows, errors } = parseCsv(adminModule.fields, text);

  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Accounts aren't configured on this deployment.");

  if (validRows.length === 0) {
    return { succeeded: 0, failed: errors };
  }

  const { error } = await supabase.from("admin_content").upsert(
    validRows.map((data) => ({
      module_id: moduleId,
      slug: slugify(String(data[adminModule.slugSourceField] ?? "")),
      data,
      created_by: admin.id,
    })),
    { onConflict: "module_id,slug" }
  );

  if (error) {
    return {
      succeeded: 0,
      failed: [...errors, ...validRows.map((_, i) => ({ row: i + 1, message: error.message }))],
    };
  }

  revalidatePath(`/admin/${moduleId}`);
  revalidatePath(adminModule.publicListRoute);
  return { succeeded: validRows.length, failed: errors };
}
