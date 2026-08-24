import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getDiscoveryBySlug } from "@/lib/discovery/selection";
import { getEntryImageOverride } from "@/lib/admin/entryImages";
import { EntryPhotoForm } from "@/components/admin/EntryPhotoForm";

export default async function AdminEncyclopediaPhotoEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getDiscoveryBySlug(slug);
  if (!entry) notFound();

  const currentImage = await getEntryImageOverride("encyclopedia", slug);

  return (
    <div>
      <Link
        href="/admin/encyclopedia-photos"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted hover:text-ink mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Encyclopedia photos
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{entry.emoji}</span>
        <h1 className="font-display text-3xl tracking-tight">{entry.name}</h1>
      </div>

      <EntryPhotoForm moduleId="encyclopedia" slug={slug} currentImage={currentImage} />
    </div>
  );
}
