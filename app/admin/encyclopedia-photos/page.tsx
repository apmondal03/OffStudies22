import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DISCOVERY_ENTRIES } from "@/lib/discovery/data";
import { listEntryImageOverrides } from "@/lib/admin/entryImages";
import { EncyclopediaPhotoGrid } from "@/components/admin/EncyclopediaPhotoGrid";

export default async function AdminEncyclopediaPhotosPage() {
  const overrides = await listEntryImageOverrides("encyclopedia");

  return (
    <div>
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted hover:text-ink mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        All content
      </Link>

      <h1 className="font-display text-3xl tracking-tight mb-2">Encyclopedia photos</h1>
      <p className="text-sm text-ink-muted mb-6">
        Add or replace the photo shown on any Encyclopedia entry — including the {DISCOVERY_ENTRIES.length}{" "}
        built-in ones, which can&apos;t be edited any other way here. Entries without a photo fall back to
        their emoji, as always.
      </p>

      <EncyclopediaPhotoGrid entries={DISCOVERY_ENTRIES} overrides={overrides} />
    </div>
  );
}
