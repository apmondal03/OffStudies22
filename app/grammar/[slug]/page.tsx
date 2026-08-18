import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGrammarPointBySlug } from "@/lib/grammar/selection";
import { getPublicAdminEntryBySlug } from "@/lib/admin/content";
import { toGrammarPoint } from "@/lib/admin/mappers";
import { GrammarCard } from "@/components/grammar/GrammarCard";
import { ModuleActionBar } from "@/components/ui/ModuleActionBar";
import { grammarModule } from "@/lib/modules/grammar";

async function findEntry(slug: string) {
  const staticEntry = getGrammarPointBySlug(slug);
  if (staticEntry) return staticEntry;
  const row = await getPublicAdminEntryBySlug("grammar", slug);
  return row ? toGrammarPoint(row) : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = await findEntry(slug);
  if (!entry) return { title: "Grammar — Not Found" };

  return {
    title: `${entry.title} — English Grammar`,
    description: `Learn ${entry.title.toLowerCase()}: rules, structure, and examples for English learners.`,
  };
}

export default async function GrammarDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await findEntry(slug);

  if (!entry) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-16">
      <nav className="mb-8 text-sm text-ink-faint" aria-label="Breadcrumb">
        <Link href="/grammar" className="hover:text-ink">Grammar</Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink">{entry.title}</span>
      </nav>

      <div className="mb-6">
        <ModuleActionBar moduleId={grammarModule.id} totalCount={grammarModule.totalCount()} slug={entry.slug} />
      </div>

      <GrammarCard entry={entry} showLink={false} />
    </div>
  );
}
