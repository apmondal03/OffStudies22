"use client";

import { useState } from "react";
import { Download, AlertTriangle } from "lucide-react";
import { getAllCachedWords } from "@/lib/admin/dictionaryCacheAdmin";
import type { CachedWordRow } from "@/lib/dictionary/wordCache";

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function toCsv(rows: CachedWordRow[]): string {
  const header = [
    "word",
    "partOfSpeech",
    "cefrLevel",
    "meaning",
    "simpleDefinition",
    "examples",
    "synonyms",
    "antonyms",
    "source",
    "fetchedAt",
  ];
  const lines = [header.join(",")];

  for (const row of rows) {
    const defs = row.data.definitions ?? [];
    const iterable = defs.length > 0 ? defs : [null];

    for (const def of iterable) {
      const cell = (v: string) => `"${(v ?? "").replace(/"/g, '""')}"`;
      lines.push(
        [
          cell(row.word),
          cell(def?.partOfSpeech ?? row.data.partOfSpeech ?? ""),
          cell(row.data.cefrLevel ?? ""),
          cell(def?.meaning ?? ""),
          cell(def?.simpleDefinition ?? ""),
          cell((def?.examples ?? []).join("|")),
          cell((def?.synonyms ?? []).join("|")),
          cell((def?.antonyms ?? []).join("|")),
          cell(row.source),
          cell(row.fetched_at),
        ].join(",")
      );
    }
  }

  return lines.join("\n");
}

export function DictionaryCacheExport() {
  const [loading, setLoading] = useState<"json" | "csv" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload(format: "json" | "csv") {
    setLoading(format);
    setError(null);
    try {
      const rows = await getAllCachedWords();
      if (rows.length === 0) {
        setError("No cached words yet — nothing to download.");
        return;
      }
      const date = new Date().toISOString().split("T")[0];
      if (format === "json") {
        downloadBlob(JSON.stringify(rows, null, 2), `cached-dictionary-${date}.json`, "application/json");
      } else {
        downloadBlob(toCsv(rows), `cached-dictionary-${date}.csv`, "text/csv");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => handleDownload("json")}
          disabled={loading !== null}
          className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-contrast hover:bg-accent-strong disabled:opacity-60"
        >
          <Download className="h-4 w-4" />
          {loading === "json" ? "Preparing…" : "Download JSON"}
        </button>
        <button
          type="button"
          onClick={() => handleDownload("csv")}
          disabled={loading !== null}
          className="inline-flex items-center gap-1.5 rounded-full border border-border-strong px-5 py-2.5 text-sm font-medium hover:border-accent hover:text-accent disabled:opacity-60"
        >
          <Download className="h-4 w-4" />
          {loading === "csv" ? "Preparing…" : "Download CSV"}
        </button>
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-b2/40 bg-[color-mix(in_srgb,var(--b2)_8%,transparent)] px-3.5 py-2.5 text-sm text-b2">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <p className="mt-4 text-xs text-ink-faint">
        JSON keeps the full structure (every definition, example, and synonym exactly as stored).
        CSV is easier to open in a spreadsheet, with one row per sense of a word.
      </p>
    </div>
  );
}
