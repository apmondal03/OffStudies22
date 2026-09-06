import Link from "next/link";

function slugifyWord(word: string): string {
  return word.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function LinkablePills({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Link
          key={item}
          href={`/word/${slugifyWord(item)}`}
          className="rounded-full border border-border bg-surface-sunken px-3 py-1 text-sm text-ink-muted hover:border-accent hover:text-accent transition-colors"
        >
          {item}
        </Link>
      ))}
    </div>
  );
}
