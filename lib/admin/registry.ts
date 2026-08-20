import type { AdminModuleDef } from "@/types/adminContent";
import { DISCOVERY_CATEGORY_LABEL } from "@/types/discovery";
import { GRAMMAR_CATEGORY_LABEL } from "@/types/grammar";
import { IDIOM_CATEGORY_LABEL } from "@/types/idiom";
import type { DiscoveryCategory } from "@/types/discovery";
import type { GrammarCategory } from "@/types/grammar";
import type { IdiomCategory } from "@/types/idiom";

function toOptions<T extends string>(labels: Record<T, string>) {
  return Object.entries(labels).map(([value, label]) => ({ value, label: label as string }));
}

/**
 * Every module below has a flat field shape (no nested arrays-of-objects).
 * That's a deliberate scope boundary, not an oversight: Prepositions
 * (multi-sense entries), Vocabulary, and Phrasal Verbs (both with a
 * `senses[]` array of {meaning, examples, ...} sub-objects) need a field
 * type this schema doesn't support yet — a "list of objects" / repeatable
 * sub-form field. Adding that is the next real extension to this system,
 * not a config-only change like adding one of these three was.
 */
/**
 * Vocabulary, Phrasal Verbs, and Prepositions are here too, at a
 * deliberately simplified shape: their real types support MULTIPLE senses/
 * definitions per entry (a word can have several meanings; "in" has several
 * usage patterns), but this form system only supports flat fields today —
 * no repeatable sub-form yet. Admin-added entries here get exactly one
 * sense/definition. That covers the realistic common case (adding a new
 * word or phrase with its main meaning) without needing a bigger form-engine
 * change first; multi-sense entries are still best added via code for now.
 */
export const ADMIN_MODULES: AdminModuleDef[] = [
  {
    id: "encyclopedia",
    label: "Encyclopedia",
    publicListRoute: "/encyclopedia",
    slugSourceField: "name",
    fields: [
      { key: "name", label: "Name", type: "text", required: true, placeholder: "Blue Whale" },
      {
        key: "category",
        label: "Category",
        type: "select",
        required: true,
        options: toOptions<DiscoveryCategory>(DISCOVERY_CATEGORY_LABEL),
      },
      { key: "emoji", label: "Emoji", type: "emoji", placeholder: "🐋" },
      {
        key: "image",
        label: "Photo",
        type: "image",
        help: "Optional — shown larger on the article page instead of the emoji. A square or landscape photo works best.",
      },
      {
        key: "simpleFact",
        label: "Simple fact",
        type: "text",
        required: true,
        help: "One short sentence.",
        placeholder: "The blue whale is the largest animal to have ever lived.",
      },
      {
        key: "facts",
        label: "Facts",
        type: "list",
        required: true,
        help: "One per line, at least one required.",
      },
      { key: "funFact", label: "Fun fact", type: "text", help: "Optional, shown in a highlighted box." },
    ],
  },
  {
    id: "grammar",
    label: "Grammar",
    publicListRoute: "/grammar",
    slugSourceField: "title",
    fields: [
      { key: "title", label: "Title", type: "text", required: true, placeholder: "Present Simple" },
      {
        key: "category",
        label: "Category",
        type: "select",
        required: true,
        options: toOptions<GrammarCategory>(GRAMMAR_CATEGORY_LABEL),
      },
      {
        key: "cefrLevel",
        label: "CEFR level",
        type: "select",
        required: true,
        options: ["A1", "A2", "B1", "B2", "C1", "C2"].map((v) => ({ value: v, label: v })),
      },
      { key: "explanation", label: "Explanation", type: "textarea", required: true },
      { key: "structure", label: "Structure", type: "text", help: "Optional short formula." },
      { key: "examples", label: "Examples", type: "list", required: true, help: "One per line." },
      { key: "commonMistakes", label: "Common mistakes", type: "list", help: "One per line, optional." },
    ],
  },
  {
    id: "idioms",
    label: "Idioms",
    publicListRoute: "/idioms",
    slugSourceField: "idiom",
    fields: [
      { key: "idiom", label: "Idiom", type: "text", required: true, placeholder: "break the ice" },
      {
        key: "category",
        label: "Category",
        type: "select",
        required: true,
        options: toOptions<IdiomCategory>(IDIOM_CATEGORY_LABEL),
      },
      {
        key: "register",
        label: "Register",
        type: "select",
        required: true,
        options: [
          { value: "informal", label: "Informal" },
          { value: "neutral", label: "Neutral" },
          { value: "formal", label: "Formal" },
        ],
      },
      { key: "meaning", label: "Meaning", type: "textarea", required: true },
      { key: "simpleDefinition", label: "Simple definition", type: "text", required: true },
      { key: "examples", label: "Examples", type: "list", required: true, help: "One per line." },
      { key: "literalNote", label: "Literal note", type: "text", help: "Optional." },
    ],
  },
  {
    id: "vocabulary",
    label: "Vocabulary",
    publicListRoute: "/explore",
    slugSourceField: "word",
    fields: [
      { key: "word", label: "Word", type: "text", required: true, placeholder: "serendipity" },
      {
        key: "partOfSpeech",
        label: "Part of speech",
        type: "select",
        required: true,
        options: [
          "noun", "verb", "adjective", "adverb", "preposition", "conjunction",
          "pronoun", "determiner", "exclamation", "number", "modal verb",
          "auxiliary verb", "article", "particle",
        ].map((v) => ({ value: v, label: v })),
      },
      {
        key: "cefrLevel",
        label: "CEFR level",
        type: "select",
        required: true,
        options: ["A1", "A2", "B1", "B2", "C1", "C2"].map((v) => ({ value: v, label: v })),
      },
      { key: "meaning", label: "Full definition", type: "textarea", required: true },
      { key: "simpleDefinition", label: "Simple definition", type: "text", help: "A plainer rephrasing, optional." },
      { key: "examples", label: "Example sentences", type: "list", required: true, help: "One per line." },
      { key: "synonyms", label: "Synonyms", type: "list", help: "One per line, optional." },
    ],
  },
  {
    id: "phrasal-verbs",
    label: "Phrasal Verbs",
    publicListRoute: "/phrasal-verbs",
    slugSourceField: "phrase",
    fields: [
      { key: "phrase", label: "Phrase", type: "text", required: true, placeholder: "give up" },
      { key: "baseVerb", label: "Base verb", type: "text", required: true, placeholder: "give" },
      { key: "particles", label: "Particles", type: "list", required: true, help: "Usually one line, e.g. \"up\"." },
      {
        key: "separable",
        label: "Separable?",
        type: "select",
        required: true,
        help: "Can the object go between the verb and particle (\"turn it off\")?",
        options: [{ value: "true", label: "Yes — separable" }, { value: "false", label: "No — inseparable" }],
      },
      {
        key: "transitive",
        label: "Takes an object?",
        type: "select",
        required: true,
        options: [{ value: "true", label: "Yes — transitive" }, { value: "false", label: "No — intransitive" }],
      },
      {
        key: "formality",
        label: "Formality",
        type: "select",
        required: true,
        options: [
          { value: "informal", label: "Informal" },
          { value: "neutral", label: "Neutral" },
          { value: "formal", label: "Formal" },
        ],
      },
      { key: "meaning", label: "Meaning", type: "textarea", required: true },
      { key: "simpleDefinition", label: "Simple definition", type: "text", required: true },
      { key: "examples", label: "Examples", type: "list", required: true, help: "One per line." },
    ],
  },
  {
    id: "prepositions",
    label: "Prepositions",
    publicListRoute: "/prepositions",
    slugSourceField: "phrase",
    fields: [
      { key: "phrase", label: "Phrase", type: "text", required: true, placeholder: "afraid of" },
      {
        key: "type",
        label: "Type",
        type: "select",
        required: true,
        options: [
          { value: "core", label: "Core Preposition" },
          { value: "adjective-preposition", label: "Adjective + Preposition" },
          { value: "noun-preposition", label: "Noun + Preposition" },
        ],
      },
      {
        key: "usage",
        label: "Usage",
        type: "select",
        required: true,
        options: [
          { value: "time", label: "Time" },
          { value: "place", label: "Place" },
          { value: "movement", label: "Movement" },
          { value: "manner", label: "Manner / Method" },
          { value: "other", label: "Other" },
        ],
      },
      { key: "explanation", label: "Explanation", type: "textarea", required: true },
      { key: "examples", label: "Examples", type: "list", required: true, help: "One per line." },
    ],
  },
];

export function getAdminModule(id: string): AdminModuleDef | undefined {
  return ADMIN_MODULES.find((m) => m.id === id);
}
