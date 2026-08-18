"use client";

import { useState } from "react";
import { Download, Upload, CheckCircle2, AlertTriangle } from "lucide-react";
import type { AdminModuleDef } from "@/types/adminContent";
import { importAdminEntriesFromCsv, type BulkImportResult } from "@/lib/admin/content";
import { generateCsvTemplate } from "@/lib/admin/csv";

export function CsvImportForm({ module }: { module: AdminModuleDef }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BulkImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function downloadTemplate() {
    const csv = generateCsvTemplate(module.fields);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${module.id}-template.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const formData = new FormData(e.currentTarget);
      const res = await importAdminEntriesFromCsv(module.id, formData);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="rounded-2xl border border-border bg-surface p-5 mb-6">
        <p className="text-sm font-medium mb-1">1. Get the template</p>
        <p className="text-sm text-ink-muted mb-3">
          One column per field. List fields (like &quot;facts&quot; or &quot;examples&quot;) use a
          pipe (<code className="font-mono">|</code>) to separate multiple items in one cell.
        </p>
        <button
          type="button"
          onClick={downloadTemplate}
          className="inline-flex items-center gap-1.5 rounded-full border border-border-strong px-4 py-2 text-sm hover:border-accent hover:text-accent"
        >
          <Download className="h-4 w-4" />
          Download {module.label} template
        </button>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-surface p-5">
        <p className="text-sm font-medium mb-3">2. Upload your filled-in CSV</p>
        <input
          type="file"
          name="file"
          accept=".csv,text/csv"
          required
          className="block w-full text-sm mb-4 file:mr-4 file:rounded-full file:border-0 file:bg-accent-soft file:px-4 file:py-2 file:text-sm file:font-medium file:text-accent-strong"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-contrast hover:bg-accent-strong disabled:opacity-60"
        >
          <Upload className="h-4 w-4" />
          {loading ? "Uploading…" : "Upload"}
        </button>
      </form>

      {error && (
        <div className="mt-5 rounded-xl border border-b2/40 bg-[color-mix(in_srgb,var(--b2)_8%,transparent)] px-4 py-3 text-sm text-b2">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-5 flex flex-col gap-3">
          {result.succeeded > 0 && (
            <div className="flex items-center gap-2 rounded-xl border border-accent/40 bg-accent-soft px-4 py-3 text-sm text-accent-strong">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {result.succeeded} {result.succeeded === 1 ? "entry" : "entries"} added successfully.
            </div>
          )}
          {result.failed.length > 0 && (
            <div className="rounded-xl border border-b2/40 bg-[color-mix(in_srgb,var(--b2)_8%,transparent)] px-4 py-3 text-sm text-b2">
              <p className="flex items-center gap-2 font-medium mb-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {result.failed.length} {result.failed.length === 1 ? "row" : "rows"} skipped
              </p>
              <ul className="space-y-1 pl-6 list-disc">
                {result.failed.map((f, i) => (
                  <li key={i}>
                    Row {f.row}: {f.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
