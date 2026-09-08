"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase/serverClient";
import { getAdminUser } from "@/lib/admin/auth";
import { saveOwnWordEntry, type CachedWordRow } from "@/lib/dictionary/wordCache";
import { parseCsv } from "@/lib/admin/csv";
import { OWN_WORD_CSV_FIELDS } from "@/lib/admin/ownWordFields";
import type { WordEntry, PartOfSpeech, CEFRLevel } from "@/types/dictionary";

function slugify(word: string): string {
  return word.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export interface OwnWordImportResult {
  succeeded: number;
  failed: { row: number; message: string }[];
}

export async function importOwnWordsFromCsv(formData: FormData): Promise<OwnWordImportResult> {
  const admin = await getAdminUser();
  if (!admin) throw new Error("Not authorized.");

  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error("Accounts aren't configured on this deployment.");

  const file = formData.get("file");
  if (!(file instanceof File)) throw new Error("No file was uploaded.");

  const text = await file.text();
  const { validRows, errors } = parseCsv(OWN_WORD_CSV_FIELDS, text);

  const failed: { row: number; message: string }[] = [...errors];
  let succeeded = 0;

  for (let i = 0; i < validRows.length; i++) {
    const row = validRows[i];
    try {
      const word = String(row.word ?? "").trim();
      const meaning = String(row.meaning ?? "").trim();
      const examples = Array.isArray(row.examples) ? (row.examples as string[]) : [];
      if (!word || !meaning || examples.length === 0) {
        throw new Error("Missing a required field.");
      }

      const slug = slugify(word);
      const entry: WordEntry = {
        id: slug,
        word,
        slug,
        phoneticUS: String(row.phoneticUS ?? "").trim() || undefined,
        phoneticUK: String(row.phoneticUK ?? "").trim() || undefined,
        partOfSpeech: (row.partOfSpeech as PartOfSpeech) || "noun",
        cefrLevel: (row.cefrLevel as CEFRLevel) || "B1",
        definitions: [
          {
            id: `${slug}-1`,
            partOfSpeech: (row.partOfSpeech as PartOfSpeech) || "noun",
            meaning,
            simpleDefinition: String(row.simpleDefinition ?? "").trim() || undefined,
            examples,
            synonyms: Array.isArray(row.synonyms) && row.synonyms.length > 0 ? (row.synonyms as string[]) : undefined,
          },
        ],
      };

      await saveOwnWordEntry(slug, word, entry);
      succeeded++;
    } catch (err) {
      failed.push({
        row: i + 2,
        message: err instanceof Error ? err.message : "Something went wrong saving this row.",
      });
    }
  }

  if (succeeded > 0) {
    revalidatePath("/admin/dictionary-words");
    revalidatePath("/dictionary");
  }

  return { succeeded, failed };
}

export interface OwnWordInput {
  word: string;
  phoneticUS: string;
  phoneticUK: string;
  partOfSpeech: PartOfSpeech;
  cefrLevel: CEFRLevel;
  meaning: string;
  simpleDefinition: string;
  examples: string[];
  synonyms: string[];
}

/** Never throws — used directly from a Server Component render. */
export async function listOwnWords(): Promise<CachedWordRow[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return [];

  const admin = await getAdminUser();
  if (!admin) return [];

  const { data, error } = await supabase
    .from("cached_words")
    .select("*")
    .eq("source", "own")
    .order("word");

  if (error || !data) return [];
  return data as CachedWordRow[];
}

export async function getWordForEdit(slug: string): Promise<CachedWordRow | null> {
  const admin = await getAdminUser();
  if (!admin) return null;

  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase.from("cached_words").select("*").eq("slug", slug).single();
  if (error || !data) return null;
  return data as CachedWordRow;
}

export async function saveOwnWord(input: OwnWordInput): Promise<void> {
  const admin = await getAdminUser();
  if (!admin) throw new Error("Not authorized.");

  if (!input.word.trim()) throw new Error('"Word" is required.');
  if (!input.meaning.trim()) throw new Error('"Meaning" is required.');
  if (input.examples.length === 0) throw new Error("At least one example is required.");

  const slug = slugify(input.word);
  const entry: WordEntry = {
    id: slug,
    word: input.word.trim(),
    slug,
    phoneticUS: input.phoneticUS.trim() || undefined,
    phoneticUK: input.phoneticUK.trim() || undefined,
    partOfSpeech: input.partOfSpeech,
    cefrLevel: input.cefrLevel,
    definitions: [
      {
        id: `${slug}-1`,
        partOfSpeech: input.partOfSpeech,
        meaning: input.meaning.trim(),
        simpleDefinition: input.simpleDefinition.trim() || undefined,
        examples: input.examples,
        synonyms: input.synonyms.length > 0 ? input.synonyms : undefined,
      },
    ],
  };

  await saveOwnWordEntry(slug, entry.word, entry);

  revalidatePath("/admin/dictionary-words");
  revalidatePath("/dictionary");
  revalidatePath(`/word/${slug}`);
}
