import { DISCOVERY_CATEGORY_LABEL } from "@/types/discovery";
import type { DiscoveryEntry } from "@/types/discovery";

export function DiscoveryStreamCard({ entry }: { entry: DiscoveryEntry }) {
  return (
    <div className="rounded-3xl border border-[var(--young-border)] bg-[var(--young-surface)] p-8 sm:p-12 text-left">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-4xl">{entry.emoji}</span>
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--young-ink-muted)] font-medium">
            {DISCOVERY_CATEGORY_LABEL[entry.category]}
          </p>
          <h1 className="young-display text-3xl sm:text-4xl font-bold text-[var(--young-accent)]">
            {entry.name}
          </h1>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-[var(--young-accent-soft)] p-4">
        <ul className="space-y-2">
          {entry.facts.map((fact, i) => (
            <li key={i} className="flex gap-2 text-base text-[var(--young-ink)]">
              <span className="text-[var(--young-accent)]">•</span>
              {fact}
            </li>
          ))}
        </ul>
      </div>

      {entry.funFact && (
        <p className="mt-4 text-sm text-[var(--young-accent-3)]">
          <span className="font-semibold">Fun fact: </span>
          {entry.funFact}
        </p>
      )}
    </div>
  );
}
