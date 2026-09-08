import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { OwnWordForm } from "@/components/admin/OwnWordForm";

export default function AdminAddWordPage() {
  return (
    <div>
      <Link
        href="/admin/dictionary-words"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted hover:text-ink mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Our own dictionary
      </Link>
      <h1 className="font-display text-3xl tracking-tight mb-6">Add a word</h1>
      <OwnWordForm />
    </div>
  );
}
