import Link from "next/link";
import { Layers } from "lucide-react";
import { ADMIN_MODULES } from "@/lib/admin/registry";
import { isRegistrationEnabled } from "@/lib/admin/settings";
import { RegistrationToggle } from "@/components/admin/RegistrationToggle";

export default async function AdminDashboardPage() {
  const registrationEnabled = await isRegistrationEnabled();

  return (
    <div>
      <h1 className="font-display text-3xl tracking-tight mb-2">Content</h1>
      <p className="text-ink-muted mb-8">
        Entries you add here appear on the live site alongside the built-in content.
      </p>

      <div className="flex flex-col gap-3">
        {ADMIN_MODULES.map((module) => (
          <Link
            key={module.id}
            href={`/admin/${module.id}`}
            className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 hover:border-accent transition-colors"
          >
            <Layers className="h-6 w-6 text-accent shrink-0" strokeWidth={1.75} />
            <div>
              <p className="font-display text-lg">{module.label}</p>
              <p className="text-sm text-ink-muted">
                Add, edit, or remove {module.label.toLowerCase()} entries.
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-border">
        <p className="text-xs uppercase tracking-widest text-ink-faint font-medium mb-3">
          Settings
        </p>
        <RegistrationToggle initialEnabled={registrationEnabled} />
      </div>

      <div className="mt-8 pt-6 border-t border-border">
        <p className="text-xs uppercase tracking-widest text-ink-faint font-medium mb-2">
          A note on Vocabulary, Phrasal Verbs, and Prepositions
        </p>
        <p className="text-sm text-ink-faint">
          Their real content supports multiple senses/definitions per entry — an admin-added
          entry here gets exactly one. That covers adding a new word or phrase with its main
          meaning; entries needing several senses are still best added via code for now.
        </p>
      </div>
    </div>
  );
}
