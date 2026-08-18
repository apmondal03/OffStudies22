import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDiscoveryBySlug } from "@/lib/discovery/selection";
import { getPublicAdminEntryBySlug } from "@/lib/admin/content";
import { toDiscoveryEntry } from "@/lib/admin/mappers";
import { DISCOVERY_CATEGORY_LABEL } from "@/types/discovery";
import { EncyclopediaCard } from "@/components/dictionary/EncyclopediaCard";
import { ModuleActionBar } from "@/components/ui/ModuleActionBar";
import { encyclopediaModule } from "@/lib/modules/encyclopedia";

// The static list is checked first (fast, no network) — the database is
// only consulted as a fallback for slugs that aren't in the built-in set,
// i.e. entries added through /admin/encyclopedia.
async function findEntry(slug: string) {
  const staticEntry = getDiscoveryBySlug(slug);
  if (staticEntry) return staticEntry;
  const row = await getPublicAdminEntryBySlug("encyclopedia", slug);
  return row ? toDiscoveryEntry(row) : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = await findEntry(slug);
  if (!entry) return { title: "Encyclopedia — Not Found" };

  return {
    title: `${entry.name} — Encyclopedia`,
    description: entry.simpleFact,
  };
}

export default async function EncyclopediaDetailPage({
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
        <Link href="/encyclopedia" className="hover:text-ink">Encyclopedia</Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink">{DISCOVERY_CATEGORY_LABEL[entry.category]}</span>
        <span className="mx-1.5">/</span>
        <span className="text-ink">{entry.name}</span>
      </nav>

      <div className="mb-6">
        <ModuleActionBar
          moduleId={encyclopediaModule.id}
          totalCount={encyclopediaModule.totalCount()}
          slug={entry.slug}
        />
      </div>

      <EncyclopediaCard entry={entry} showLink={false} />
    </div>
  );
}
