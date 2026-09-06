import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { getModuleStatusMap, setModuleStatus, getModuleSavedSlugs, toggleModuleSaved } from "@/lib/storage";
import { CONTENT_MODULES } from "@/lib/registry";
import { recordReview } from "@/lib/spacedRepetition";
import type { LearningStatus } from "@/types/dictionary";

/**
 * Sync is adult-track only, by construction: it only ever touches the
 * modules registered with track: "adult" (Vocabulary, Phrasal Verbs,
 * Grammar, Idioms, Prepositions, Encyclopedia). Kids Mode and Young
 * Learners storage (lib/kids/storage.ts) is never read or written here.
 *
 * Strategy: local-first, union merge. localStorage remains the instant,
 * offline-capable source of truth. On sign-in, remote progress is merged
 * additively into local (a remote "known"/"saved" state is adopted if
 * local doesn't already have one — local never gets overwritten or
 * cleared by a sync). Local state is then periodically pushed up in full.
 * This deliberately avoids a true conflict-resolution system (which would
 * need per-entry timestamps this app doesn't track today) in favor of a
 * strategy that can only ever add progress, never lose it — the safe
 * default for a learning app where "known" states should stick.
 */

const ADULT_MODULE_IDS = CONTENT_MODULES.filter((m) => m.track === "adult").map((m) => m.id);

interface ProgressRow {
  module_id: string;
  slug: string;
  status: string | null;
  saved: boolean;
}

export async function pullAndMergeProgress(userId: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;

  const { data, error } = await supabase
    .from("user_progress")
    .select("module_id, slug, status, saved")
    .eq("user_id", userId);

  if (error || !data) return;

  for (const row of data as ProgressRow[]) {
    if (!ADULT_MODULE_IDS.includes(row.module_id)) continue;

    const localStatusMap = getModuleStatusMap(row.module_id);
    if (!localStatusMap[row.slug] && (row.status === "known" || row.status === "learning")) {
      setModuleStatus(row.module_id, row.slug, row.status as LearningStatus);
      // Seed a fresh review schedule on this device too — the schedule
      // itself isn't synced (only the status label is), so without this a
      // status pulled in from another device would never be prioritized
      // for review here until the user touched it again locally.
      recordReview(row.module_id, row.slug, row.status as LearningStatus);
    }

    if (row.saved) {
      const localSaved = new Set(getModuleSavedSlugs(row.module_id));
      if (!localSaved.has(row.slug)) {
        toggleModuleSaved(row.module_id, row.slug);
      }
    }
  }
}

export async function pushAllProgress(userId: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;

  const rows: {
    user_id: string;
    module_id: string;
    slug: string;
    status: LearningStatus | null;
    saved: boolean;
  }[] = [];

  for (const moduleId of ADULT_MODULE_IDS) {
    const statusMap = getModuleStatusMap(moduleId);
    const savedSlugs = new Set(getModuleSavedSlugs(moduleId));
    const allSlugs = new Set([...Object.keys(statusMap), ...savedSlugs]);

    for (const slug of allSlugs) {
      rows.push({
        user_id: userId,
        module_id: moduleId,
        slug,
        status: statusMap[slug] ?? null,
        saved: savedSlugs.has(slug),
      });
    }
  }

  if (rows.length === 0) return;

  await supabase.from("user_progress").upsert(rows, { onConflict: "user_id,module_id,slug" });
}
