import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAdminModule } from "@/lib/admin/registry";
import { createAdminEntry } from "@/lib/admin/content";
import { GenericEntryForm } from "@/components/admin/GenericEntryForm";

export default async function AdminNewEntryPage({
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
      <h1 className="font-display text-3xl tracking-tight mb-6">Add a {adminModule.label.toLowerCase()} entry</h1>
      <GenericEntryForm
        fields={adminModule.fields}
        action={createAdminEntry.bind(null, moduleId)}
        submitLabel="Add entry"
      />
    </div>
  );
}
