import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCachedWordStats } from "@/lib/admin/dictionaryCacheAdmin";
import { DictionaryCacheExport } from "@/components/admin/DictionaryCacheExport";

export default async function AdminDictionaryCachePage() {
  const stats = await getCachedWordStats();

  return (
    <div>
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted hover:text-ink mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        All content
      </Link>

      <h1 className="font-display text-3xl tracking-tight mb-2">Cached dictionary words</h1>
      <p className="text-sm text-ink-muted mb-6">
        Every word a visitor has looked up gets saved here automatically, so the next lookup for
        that word reads instantly from our own database instead of the external dictionary API.
        Currently <span className="font-medium text-ink">{stats.total.toLocaleString()}</span>{" "}
        {stats.total === 1 ? "word" : "words"} cached.
      </p>

      <DictionaryCacheExport />
    </div>
  );
}
