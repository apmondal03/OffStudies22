import type { AdminFieldDef } from "@/types/adminContent";

/**
 * Reuses the same generic CSV field-schema type every other admin CSV
 * import uses (`types/adminContent.ts`), even though "own dictionary"
 * words don't live in the shared `admin_content` table the rest of that
 * system writes to — `generateCsvTemplate`/`parseCsv` are pure,
 * schema-driven functions with no dependency on that table at all, so
 * reusing them here means the same template format, the same list-field
 * pipe-delimiter convention, and the same per-row validation as
 * everywhere else, without duplicating any of that logic.
 *
 * Kept in its own plain file, not inside `ownDictionaryAdmin.ts`: that
 * file is marked `"use server"`, and Next.js requires every export from
 * such a file to be an async function — a plain array constant like this
 * one isn't allowed there at all and fails the build if placed there.
 */
export const OWN_WORD_CSV_FIELDS: AdminFieldDef[] = [
  { key: "word", label: "Word", type: "text", required: true, placeholder: "marine" },
  { key: "phoneticUS", label: "US pronunciation (IPA)", type: "text", help: "Optional, e.g. /məˈriːn/" },
  { key: "phoneticUK", label: "UK pronunciation (IPA)", type: "text", help: "Optional, e.g. /məˈriːn/" },
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
  { key: "simpleDefinition", label: "Simple definition", type: "text", help: "Optional." },
  { key: "examples", label: "Example sentences", type: "list", required: true, help: "One per line." },
  { key: "synonyms", label: "Synonyms", type: "list", help: "One per line, optional." },
];
