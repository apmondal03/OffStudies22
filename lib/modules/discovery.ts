import type { ContentModule } from "@/types/contentModule";
import type { DiscoveryEntry } from "@/types/discovery";
import type { DiscoveryFilter } from "@/lib/discovery/selection";
import { selectNextDiscoveryEntry, totalDiscoveryCount } from "@/lib/discovery/selection";
import { DiscoveryStreamCard } from "@/components/youngLearners/DiscoveryStreamCard";

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

export const discoveryModule: ContentModule<DiscoveryEntry, DiscoveryEntry, DiscoveryFilter> = {
  id: "discovery",
  label: "Discovery",
  track: "kids",
  listRoute: "/young-learners/practice",
  isNetworkDependent: false,
  filters: FILTERS,
  defaultFilter: "all",

  totalCount: () => totalDiscoveryCount(),

  selectNext: (ctx) =>
    selectNextDiscoveryEntry({
      moduleId: "discovery",
      filter: ctx.filter,
      savedSlugs: ctx.savedSlugs,
      learningSlugs: ctx.learningSlugs,
      recentSlugs: ctx.recentSlugs,
    }),

  resolveEntry: async (candidate) => candidate,

  getSlug: (item) => item.slug,

  StreamCard: DiscoveryStreamCard,
};
