import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { OwnWordCsvImportForm } from "@/components/admin/OwnWordCsvImportForm";

export default function AdminImportWordsPage() {
  return (
    <div>
      <Link
        href="/admin/dictionary-words"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted hover:text-ink mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Our own dictionary
      </Link>
      <h1 className="font-display text-3xl tracking-tight mb-2">Import words</h1>
      <p className="text-ink-muted mb-6">
        Add several hand-written words at once. Every word is saved as permanent, own-authored
        content — never refreshed or overwritten by a live lookup, same as adding one at a time.
        Re-uploading a file updates any word that shares a spelling with one already saved, rather
        than creating a duplicate.
      </p>
      <OwnWordCsvImportForm />
    </div>
  );
}
