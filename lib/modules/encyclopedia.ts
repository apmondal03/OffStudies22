import type { ContentModule } from "@/types/contentModule";
import type { DiscoveryEntry } from "@/types/discovery";
import type { DiscoveryFilter } from "@/lib/discovery/selection";
import { selectNextDiscoveryEntry, totalDiscoveryCount } from "@/lib/discovery/selection";
import { EncyclopediaStreamCard } from "@/components/dictionary/EncyclopediaStreamCard";

const FILTERS: { value: DiscoveryFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "animals", label: "Animals" },
  { value: "space", label: "Space" },
  { value: "dinosaurs", label: "Dinosaurs" },
  { value: "countries", label: "Countries" },
  { value: "human-body", label: "Human Body" },
  { value: "ocean", label: "Ocean" },
  { value: "weather", label: "Weather" },
  { value: "plants", label: "Plants" },
  { value: "inventions", label: "Inventions" },
  { value: "history", label: "History" },
  { value: "saved", label: "Saved" },
  { value: "learning", label: "Learning" },
];

/**
 * The adult-track counterpart to the Kids Mode `discoveryModule` — same
 * underlying `DISCOVERY_ENTRIES` dataset, shown at full depth (all facts +
 * fun fact + cross-linked vocabulary) rather than the simplified or
 * mid-depth versions. Proves the "one dataset, every audience" model across
 * all three tracks, not just two.
 */
export const encyclopediaModule: ContentModule<DiscoveryEntry, DiscoveryEntry, DiscoveryFilter> = {
  id: "encyclopedia",
  label: "Encyclopedia",
  track: "adult",
  listRoute: "/encyclopedia",
  isNetworkDependent: false,
  filters: FILTERS,
  defaultFilter: "all",

  totalCount: () => totalDiscoveryCount(),

  selectNext: (ctx) =>
    selectNextDiscoveryEntry({
      moduleId: "encyclopedia",
      filter: ctx.filter,
      savedSlugs: ctx.savedSlugs,
      learningSlugs: ctx.learningSlugs,
      recentSlugs: ctx.recentSlugs,
    }),

  resolveEntry: async (candidate) => candidate,

  getSlug: (item) => item.slug,

  StreamCard: EncyclopediaStreamCard,
};
