import { DISCOVERY_ENTRIES } from "@/lib/discovery/data";
import type { DiscoveryEntry, DiscoveryCategory } from "@/types/discovery";
import { pickWithSpacedRepetition } from "@/lib/spacedRepetition";

export type DiscoveryFilter = "all" | DiscoveryCategory | "saved" | "learning";

export interface DiscoverySelectionContext {
  /** The calling module's own id ("discovery" for Young Learners, "encyclopedia"
   *  for the adult track) — this dataset is shared, but each module gets its
   *  own independent spaced-repetition schedule, keyed by this. */
  moduleId: string;
  filter: DiscoveryFilter;
  savedSlugs: Set<string>;
  learningSlugs: Set<string>;
  recentSlugs: string[];
}

function pool(ctx: DiscoverySelectionContext): DiscoveryEntry[] {
  switch (ctx.filter) {
    case "animals":
    case "space":
    case "dinosaurs":
    case "countries":
    case "human-body":
    case "ocean":
    case "weather":
    case "plants":
    case "inventions":
    case "history":
      return DISCOVERY_ENTRIES.filter((e) => e.category === ctx.filter);
    case "saved":
      return DISCOVERY_ENTRIES.filter((e) => ctx.savedSlugs.has(e.slug));
    case "learning":
      return DISCOVERY_ENTRIES.filter((e) => ctx.learningSlugs.has(e.slug));
    case "all":
    default:
      return DISCOVERY_ENTRIES;
  }
}

export function selectNextDiscoveryEntry(ctx: DiscoverySelectionContext): DiscoveryEntry | null {
  const candidates = pool(ctx);
  return pickWithSpacedRepetition(ctx.moduleId, candidates, (e) => e.slug, ctx.recentSlugs);
}

export function getDiscoveryBySlug(slug: string): DiscoveryEntry | undefined {
  return DISCOVERY_ENTRIES.find((e) => e.slug === slug);
}

export function totalDiscoveryCount(): number {
  return DISCOVERY_ENTRIES.length;
}

export function getDiscoveryByCategory(category: DiscoveryCategory): DiscoveryEntry[] {
  return DISCOVERY_ENTRIES.filter((e) => e.category === category);
}
