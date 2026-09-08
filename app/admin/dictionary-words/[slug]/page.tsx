import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAdminUser } from "@/lib/admin/auth";
import { getWordForEdit } from "@/lib/admin/ownDictionaryAdmin";
import { OwnWordForm } from "@/components/admin/OwnWordForm";

export default async function AdminEditWordPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const admin = await getAdminUser();
  if (!admin) redirect("/admin-login");

  const { slug } = await params;
  const row = await getWordForEdit(slug);

  const initial = row
    ? {
        word: row.word,
        phoneticUS: row.data.phoneticUS ?? "",
        phoneticUK: row.data.phoneticUK ?? "",
        partOfSpeech: row.data.partOfSpeech,
        cefrLevel: row.data.cefrLevel,
        meaning: row.data.definitions?.[0]?.meaning ?? "",
        simpleDefinition: row.data.definitions?.[0]?.simpleDefinition ?? "",
        examples: row.data.definitions?.[0]?.examples ?? [],
        synonyms: row.data.definitions?.[0]?.synonyms ?? [],
      }
    : { word: slug.replace(/-/g, " ") };

  return (
    <div>
      <Link
        href="/admin/dictionary-words"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted hover:text-ink mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Our own dictionary
      </Link>
      <h1 className="font-display text-3xl tracking-tight mb-2">
        {row?.source === "own" ? `Edit "${row.word}"` : `Write "${initial.word}"`}
      </h1>
      {row && row.source !== "own" && (
        <p className="text-sm text-ink-muted mb-6">
          This word is currently shown from a live dictionary lookup — the content below is
          loaded from that as a starting point. Saving will make it permanent and hand-owned
          going forward, never refreshed from the live source again.
        </p>
      )}
      <OwnWordForm initial={initial} />
    </div>
  );
}
