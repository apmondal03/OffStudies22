import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAdminModule } from "@/lib/admin/registry";
import { getAdminEntryById, updateAdminEntry } from "@/lib/admin/content";
import { GenericEntryForm } from "@/components/admin/GenericEntryForm";

export default async function AdminEditEntryPage({
  params,
}: {
  params: Promise<{ moduleId: string; id: string }>;
}) {
  const { moduleId, id } = await params;
  const adminModule = getAdminModule(moduleId);
  if (!adminModule) notFound();

  const entry = await getAdminEntryById(id);
  if (!entry || entry.module_id !== moduleId) notFound();

  const title = String(entry.data[adminModule.slugSourceField] ?? entry.slug);

  return (
    <div>
      <Link
        href={`/admin/${moduleId}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted hover:text-ink mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        {adminModule.label}
      </Link>
      <h1 className="font-display text-3xl tracking-tight mb-6">Edit &quot;{title}&quot;</h1>
      <GenericEntryForm
        fields={adminModule.fields}
        action={updateAdminEntry.bind(null, id, moduleId)}
        submitLabel="Save changes"
        initial={entry.data}
      />
    </div>
  );
}
