import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus, Pencil, ArrowLeft, FileUp } from "lucide-react";
import { getAdminModule } from "@/lib/admin/registry";
import { listAdminEntries, deleteAdminEntry } from "@/lib/admin/content";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";

export default async function AdminModuleListPage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const adminModule = getAdminModule(moduleId);
  if (!adminModule) notFound();

  const entries = await listAdminEntries(moduleId);

  return (
    <div>
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted hover:text-ink mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        All content
      </Link>

      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl tracking-tight">{adminModule.label}</h1>
          <p className="text-sm text-ink-muted mt-1">
            {entries.length} {entries.length === 1 ? "entry" : "entries"} added here
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/admin/${moduleId}/new`}
            className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-contrast hover:bg-accent-strong"
          >
            <Plus className="h-4 w-4" />
            Add entry
          </Link>
          <Link
            href={`/admin/${moduleId}/import`}
            className="inline-flex items-center gap-1.5 rounded-full border border-border-strong px-5 py-2.5 text-sm font-medium hover:border-accent hover:text-accent"
          >
            <FileUp className="h-4 w-4" />
            Import CSV
          </Link>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-strong bg-surface p-10 text-center text-ink-muted">
          No entries added yet. Click &quot;Add entry&quot; to create the first one.
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {entries.map((entry) => {
            const title = String(entry.data[adminModule.slugSourceField] ?? entry.slug);
            return (
              <li
                key={entry.id}
                className="flex items-center gap-4 rounded-2xl border border-border bg-surface px-4 py-3.5"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-display text-lg leading-tight truncate">{title}</p>
                  <p className="text-xs text-ink-faint font-mono">{entry.slug}</p>
                </div>
                <Link
                  href={`/admin/${moduleId}/${entry.id}/edit`}
                  aria-label={`Edit ${title}`}
                  className="rounded-full p-2 text-ink-muted hover:text-accent hover:bg-accent-soft transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <form action={deleteAdminEntry.bind(null, entry.id, moduleId)}>
                  <AdminDeleteButton label={title} />
                </form>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
