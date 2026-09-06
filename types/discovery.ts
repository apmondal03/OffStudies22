/**
 * Data model for the Discovery encyclopedia section. One shared dataset
 * serves two audiences at different depths:
 * - Kids Mode (ages ~3-6) shows `simpleFact` — one short sentence, paired
 *   with `emoji`, through the same grid → sequential-player pattern used
 *   by First Words.
 * - Young Learners (ages ~7-12) shows the fuller `facts` array through the
 *   generic ContentModule system, registered with `track: "kids"`.
 *
 * All content here is original — general factual knowledge (a lion lives
 * in Africa, Mars is called the Red Planet) that belongs to no one, written
 * fresh for this product. Not sourced from, or checked against, any
 * specific encyclopedia.
 */

export type DiscoveryCategory =
  | "animals"
  | "space"
  | "dinosaurs"
  | "countries"
  | "human-body"
  | "ocean"
  | "weather"
  | "plants"
  | "inventions"
  | "history";

export interface DiscoveryEntry {
  id: string;
  slug: string;
  category: DiscoveryCategory;
  name: string;
  emoji: string;
  /** Optional — admin-added entries can attach a real photo. Falls back to
   *  the emoji badge treatment everywhere when not set, so the 150
   *  built-in entries (which don't have one) render exactly as before. */
  imageUrl?: string;
  /** One short sentence — Kids Mode. */
  simpleFact: string;
  /** 3-4 fuller facts — Young Learners. */
  facts: string[];
  funFact?: string;
}

export const DISCOVERY_CATEGORY_LABEL: Record<DiscoveryCategory, string> = {
  animals: "Animals & Nature",
  space: "Space & Planets",
  dinosaurs: "Dinosaurs",
  countries: "Countries & Geography",
  "human-body": "Human Body",
  ocean: "Ocean & Sea Life",
  weather: "Weather & Seasons",
  plants: "Plants & Growing Things",
  inventions: "Inventions & Technology",
  history: "History's Big Moments",
};

export const DISCOVERY_CATEGORY_EMOJI: Record<DiscoveryCategory, string> = {
  animals: "🦁",
  space: "🚀",
  dinosaurs: "🦕",
  countries: "🌍",
  "human-body": "🫀",
  ocean: "🐬",
  weather: "⛅",
  plants: "🌱",
  inventions: "💡",
  history: "🏛️",
};
