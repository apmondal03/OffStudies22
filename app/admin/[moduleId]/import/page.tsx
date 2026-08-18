import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAdminModule } from "@/lib/admin/registry";
import { CsvImportForm } from "@/components/admin/CsvImportForm";

export default async function AdminCsvImportPage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const adminModule = getAdminModule(moduleId);
  if (!adminModule) notFound();

  return (
    <div>
      <Link
        href={`/admin/${moduleId}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted hover:text-ink mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        {adminModule.label}
      </Link>
      <h1 className="font-display text-3xl tracking-tight mb-2">Import {adminModule.label}</h1>
      <p className="text-ink-muted mb-6">
        Add several entries at once from a spreadsheet. Re-uploading a file updates any rows
        that share the same name/title with an existing entry, rather than creating duplicates.
      </p>
      <CsvImportForm module={adminModule} />
    </div>
  );
}
