import Link from "next/link";
import { ArrowLeft, Plus, PenLine, FileUp } from "lucide-react";
import { listOwnWords } from "@/lib/admin/ownDictionaryAdmin";

export default async function AdminDictionaryWordsPage() {
  const words = await listOwnWords();

  return (
    <div>
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted hover:text-ink mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        All content
      </Link>

      <div className="flex items-center justify-between gap-4 mb-2">
        <h1 className="font-display text-3xl tracking-tight">Our own dictionary</h1>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/admin/dictionary-words/add"
            className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-contrast hover:bg-accent-strong"
          >
            <Plus className="h-4 w-4" />
            Add word
          </Link>
          <Link
            href="/admin/dictionary-words/import"
            className="inline-flex items-center gap-1.5 rounded-full border border-border-strong px-5 py-2.5 text-sm font-medium hover:border-accent hover:text-accent"
          >
            <FileUp className="h-4 w-4" />
            Import CSV
          </Link>
        </div>
      </div>
      <p className="text-sm text-ink-muted mb-6">
        Hand-written entries, permanent and never overwritten by a live dictionary lookup — the
        same words page and Complete Dictionary listing everything else uses, just content we own
        outright instead of fetching live. Currently {words.length} {words.length === 1 ? "word" : "words"}.
      </p>

      {words.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-strong bg-surface p-10 text-center text-ink-muted">
          No words written yet. Click &quot;Add word&quot; to write the first one — or edit any
          already-cached word below to convert it into a permanent, hand-written entry.
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {words.map((row) => (
            <li
              key={row.slug}
              className="flex items-center gap-4 rounded-2xl border border-border bg-surface px-4 py-3.5"
            >
              <div className="flex-1 min-w-0">
                <p className="font-display text-lg leading-tight truncate">{row.word}</p>
                <p className="text-xs text-ink-faint">
                  {row.data.partOfSpeech} · {row.data.cefrLevel}
                </p>
              </div>
              <Link
                href={`/admin/dictionary-words/${row.slug}`}
                aria-label={`Edit ${row.word}`}
                className="rounded-full p-2 text-ink-muted hover:text-accent hover:bg-accent-soft transition-colors"
              >
                <PenLine className="h-4 w-4" />
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 pt-6 border-t border-border">
        <p className="text-sm text-ink-muted">
          Want to turn an already-cached word (fetched live at some point) into a permanent,
          hand-written one instead? Go directly to{" "}
          <code className="font-mono text-xs bg-surface-sunken rounded px-1.5 py-0.5">
            /admin/dictionary-words/that-word
          </code>{" "}
          — editing any word&apos;s slug this way loads its current content as a starting point
          and saves your version as the permanent one going forward.
        </p>
      </div>
    </div>
  );
}
