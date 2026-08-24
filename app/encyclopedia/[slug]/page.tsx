import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDiscoveryBySlug } from "@/lib/discovery/selection";
import { getPublicAdminEntryBySlug } from "@/lib/admin/content";
import { getEntryImageOverride } from "@/lib/admin/entryImages";
import { toDiscoveryEntry } from "@/lib/admin/mappers";
import { DISCOVERY_CATEGORY_LABEL } from "@/types/discovery";
import { EncyclopediaCard } from "@/components/dictionary/EncyclopediaCard";
import { ModuleActionBar } from "@/components/ui/ModuleActionBar";
import { encyclopediaModule } from "@/lib/modules/encyclopedia";

// The static list is checked first (fast, no network) — the database is
// only consulted as a fallback for slugs that aren't in the built-in set,
// i.e. entries added through /admin/encyclopedia. Either way, if the
// resolved entry doesn't already have its own image (built-in entries
// never do; admin-added ones manage their own via the regular edit form),
// check for a photo attached separately through /admin/encyclopedia-photos
// — the only way to add a photo to a built-in entry at all.
async function findEntry(slug: string) {
  const staticEntry = getDiscoveryBySlug(slug);
  let entry = staticEntry;

  if (!entry) {
    const row = await getPublicAdminEntryBySlug("encyclopedia", slug);
    entry = row ? toDiscoveryEntry(row) : undefined;
  }
  if (!entry) return null;

  if (!entry.imageUrl) {
    const override = await getEntryImageOverride("encyclopedia", slug);
    if (override) return { ...entry, imageUrl: override };
  }

  return entry;
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
