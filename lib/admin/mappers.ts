import type { DiscoveryEntry, DiscoveryCategory } from "@/types/discovery";
import type { GrammarPoint, GrammarCategory } from "@/types/grammar";
import type { CEFRLevel, WordEntry, PartOfSpeech } from "@/types/dictionary";
import type { IdiomEntry, IdiomCategory, IdiomRegister } from "@/types/idiom";
import type { PhrasalVerbEntry, Formality } from "@/types/phrasalVerb";
import type { PrepositionEntry, PrepositionType, PrepositionUsage } from "@/types/preposition";

type RawEntry = { slug: string; data: Record<string, unknown> };

function str(data: Record<string, unknown>, key: string): string {
  return typeof data[key] === "string" ? (data[key] as string) : "";
}

function list(data: Record<string, unknown>, key: string): string[] {
  return Array.isArray(data[key]) ? (data[key] as string[]) : [];
}

export function toDiscoveryEntry(row: RawEntry): DiscoveryEntry {
  return {
    id: row.slug,
    slug: row.slug,
    category: str(row.data, "category") as DiscoveryCategory,
    name: str(row.data, "name"),
    emoji: str(row.data, "emoji") || "📚",
    simpleFact: str(row.data, "simpleFact"),
    facts: list(row.data, "facts"),
    funFact: str(row.data, "funFact") || undefined,
  };
}

export function toGrammarPoint(row: RawEntry): GrammarPoint {
  return {
    id: row.slug,
    slug: row.slug,
    title: str(row.data, "title"),
    category: str(row.data, "category") as GrammarCategory,
    cefrLevel: (str(row.data, "cefrLevel") || "A1") as CEFRLevel,
    explanation: str(row.data, "explanation"),
    structure: str(row.data, "structure") || undefined,
    examples: list(row.data, "examples"),
    commonMistakes: list(row.data, "commonMistakes"),
  };
}

export function toIdiomEntry(row: RawEntry): IdiomEntry {
  return {
    id: row.slug,
    slug: row.slug,
    idiom: str(row.data, "idiom"),
    category: str(row.data, "category") as IdiomCategory,
    register: (str(row.data, "register") || "neutral") as IdiomRegister,
    meaning: str(row.data, "meaning"),
    simpleDefinition: str(row.data, "simpleDefinition"),
    examples: list(row.data, "examples"),
    literalNote: str(row.data, "literalNote") || undefined,
  };
}

export function toWordEntry(row: RawEntry): WordEntry {
  const meaning = str(row.data, "meaning");
  const simpleDefinition = str(row.data, "simpleDefinition");
  const partOfSpeech = (str(row.data, "partOfSpeech") || "noun") as PartOfSpeech;
  return {
    id: row.slug,
    word: str(row.data, "word"),
    slug: row.slug,
    partOfSpeech,
    cefrLevel: (str(row.data, "cefrLevel") || "A1") as CEFRLevel,
    definitions: [
      {
        id: `${row.slug}-1`,
        partOfSpeech,
        meaning,
        simpleDefinition: simpleDefinition || undefined,
        examples: list(row.data, "examples"),
        synonyms: list(row.data, "synonyms"),
      },
    ],
  };
}

export function toPhrasalVerbEntry(row: RawEntry): PhrasalVerbEntry {
  return {
    id: row.slug,
    slug: row.slug,
    phrase: str(row.data, "phrase"),
    baseVerb: str(row.data, "baseVerb"),
    particles: list(row.data, "particles"),
    separable: str(row.data, "separable") === "true",
    transitive: str(row.data, "transitive") === "true",
    formality: (str(row.data, "formality") || "neutral") as Formality,
    senses: [
      {
        id: `${row.slug}-1`,
        meaning: str(row.data, "meaning"),
        simpleDefinition: str(row.data, "simpleDefinition"),
        examples: list(row.data, "examples"),
      },
    ],
  };
}

export function toPrepositionEntry(row: RawEntry): PrepositionEntry {
  return {
    id: row.slug,
    slug: row.slug,
    phrase: str(row.data, "phrase"),
    type: (str(row.data, "type") || "core") as PrepositionType,
    senses: [
      {
        id: `${row.slug}-1`,
        usage: (str(row.data, "usage") || "other") as PrepositionUsage,
        explanation: str(row.data, "explanation"),
        examples: list(row.data, "examples"),
      },
    ],
  };
}
