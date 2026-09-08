"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveOwnWord, type OwnWordInput } from "@/lib/admin/ownDictionaryAdmin";
import type { PartOfSpeech, CEFRLevel } from "@/types/dictionary";

const PARTS_OF_SPEECH: PartOfSpeech[] = [
  "noun", "verb", "adjective", "adverb", "preposition", "conjunction",
  "pronoun", "determiner", "exclamation", "number", "modal verb",
  "auxiliary verb", "article", "particle",
];
const CEFR_LEVELS: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export function OwnWordForm({ initial }: { initial?: Partial<OwnWordInput> }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const input: OwnWordInput = {
      word: String(formData.get("word") ?? ""),
      phoneticUS: String(formData.get("phoneticUS") ?? ""),
      phoneticUK: String(formData.get("phoneticUK") ?? ""),
      partOfSpeech: String(formData.get("partOfSpeech") ?? "noun") as PartOfSpeech,
      cefrLevel: String(formData.get("cefrLevel") ?? "A1") as CEFRLevel,
      meaning: String(formData.get("meaning") ?? ""),
      simpleDefinition: String(formData.get("simpleDefinition") ?? ""),
      examples: String(formData.get("examples") ?? "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      synonyms: String(formData.get("synonyms") ?? "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      await saveOwnWord(input);
      router.push("/admin/dictionary-words");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-xl">
      {error && (
        <div className="rounded-xl border border-b2/40 bg-[color-mix(in_srgb,var(--b2)_8%,transparent)] px-4 py-3 text-sm text-b2">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="word" className="block text-sm font-medium mb-1.5">
          Word
        </label>
        <input
          id="word"
          name="word"
          required
          defaultValue={initial?.word}
          placeholder="marine"
          className="w-full rounded-xl border border-border-strong bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="phoneticUS" className="block text-sm font-medium mb-1.5">
            US pronunciation <span className="text-ink-faint font-normal">— IPA, optional</span>
          </label>
          <input
            id="phoneticUS"
            name="phoneticUS"
            defaultValue={initial?.phoneticUS}
            placeholder="/məˈriːn/"
            className="w-full rounded-xl border border-border-strong bg-surface px-4 py-2.5 text-sm font-mono outline-none focus:border-accent"
          />
        </div>
        <div>
          <label htmlFor="phoneticUK" className="block text-sm font-medium mb-1.5">
            UK pronunciation <span className="text-ink-faint font-normal">— IPA, optional</span>
          </label>
          <input
            id="phoneticUK"
            name="phoneticUK"
            defaultValue={initial?.phoneticUK}
            placeholder="/məˈriːn/"
            className="w-full rounded-xl border border-border-strong bg-surface px-4 py-2.5 text-sm font-mono outline-none focus:border-accent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="partOfSpeech" className="block text-sm font-medium mb-1.5">
            Part of speech
          </label>
          <select
            id="partOfSpeech"
            name="partOfSpeech"
            defaultValue={initial?.partOfSpeech ?? "noun"}
            className="w-full rounded-xl border border-border-strong bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
          >
            {PARTS_OF_SPEECH.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="cefrLevel" className="block text-sm font-medium mb-1.5">
            CEFR level
          </label>
          <select
            id="cefrLevel"
            name="cefrLevel"
            defaultValue={initial?.cefrLevel ?? "B1"}
            className="w-full rounded-xl border border-border-strong bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
          >
            {CEFR_LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="meaning" className="block text-sm font-medium mb-1.5">
          Full definition
        </label>
        <textarea
          id="meaning"
          name="meaning"
          required
          rows={3}
          defaultValue={initial?.meaning}
          className="w-full rounded-xl border border-border-strong bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
        />
      </div>

      <div>
        <label htmlFor="simpleDefinition" className="block text-sm font-medium mb-1.5">
          Simple definition <span className="text-ink-faint font-normal">— a plainer rephrasing for learners</span>
        </label>
        <input
          id="simpleDefinition"
          name="simpleDefinition"
          defaultValue={initial?.simpleDefinition}
          className="w-full rounded-xl border border-border-strong bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
        />
      </div>

      <div>
        <label htmlFor="examples" className="block text-sm font-medium mb-1.5">
          Example sentences <span className="text-ink-faint font-normal">— one per line</span>
        </label>
        <textarea
          id="examples"
          name="examples"
          required
          rows={4}
          defaultValue={initial?.examples?.join("\n")}
          className="w-full rounded-xl border border-border-strong bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent font-mono"
        />
      </div>

      <div>
        <label htmlFor="synonyms" className="block text-sm font-medium mb-1.5">
          Synonyms <span className="text-ink-faint font-normal">— one per line, optional</span>
        </label>
        <textarea
          id="synonyms"
          name="synonyms"
          rows={3}
          defaultValue={initial?.synonyms?.join("\n")}
          className="w-full rounded-xl border border-border-strong bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent font-mono"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="self-start rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-contrast hover:bg-accent-strong disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save word"}
      </button>
    </form>
  );
}
