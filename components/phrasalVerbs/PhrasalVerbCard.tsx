import Link from "next/link";
import { ArrowUpRight, ArrowRightLeft } from "lucide-react";
import type { PhrasalVerbEntry, Formality } from "@/types/phrasalVerb";
import { ExampleList } from "@/components/ui/ExampleList";

const FORMALITY_LABEL: Record<Formality, string> = {
  informal: "Informal",
  neutral: "Neutral",
  formal: "Formal",
};

export function PhrasalVerbCard({
  entry,
  showLink = true,
}: {
  entry: PhrasalVerbEntry;
  showLink?: boolean;
}) {
  return (
    <div>
      <div className="flex items-start gap-4">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-accent-soft">
          <ArrowRightLeft className="h-7 w-7 text-accent-strong" strokeWidth={1.75} />
        </span>
        <div className="pt-1">
          <p className="text-xs uppercase tracking-widest text-accent font-medium mb-1.5">
            {FORMALITY_LABEL[entry.formality]}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl tracking-tight leading-tight">{entry.phrase}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-mono text-ink-muted">
              {entry.separable ? "Separable" : "Inseparable"}
            </span>
            {!entry.transitive && (
              <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-mono text-ink-muted">
                Intransitive
              </span>
            )}
          </div>
        </div>
      </div>

      {entry.senses.length > 1 && entry.senses.some((s) => s.signpost) && (
        <div className="mt-6 flex flex-wrap gap-1.5">
          {entry.senses.map((sense, i) => (
            <span
              key={sense.id}
              className="rounded-md bg-surface-sunken px-2.5 py-1 text-xs font-mono uppercase tracking-wide text-ink-muted"
            >
              {sense.signpost ?? `Sense ${i + 1}`}
            </span>
          ))}
        </div>
      )}

      <div className="mt-7 space-y-6">
        {entry.senses.map((sense, i) => (
          <div key={sense.id}>
            {entry.senses.length > 1 && (
              <p className="text-xs uppercase tracking-widest text-accent font-medium mb-1.5">
                {sense.signpost ?? `Sense ${i + 1}`}
              </p>
            )}
            <p className="text-lg leading-relaxed">{sense.simpleDefinition}</p>
            <ExampleList examples={sense.examples} />
            {sense.synonyms && sense.synonyms.length > 0 && (
              <p className="mt-2 text-sm text-ink-muted">
                <span className="text-ink-faint">Similar to: </span>
                {sense.synonyms.join(" · ")}
              </p>
            )}
          </div>
        ))}
      </div>

      {showLink && (
        <Link
          href={`/phrasal-verbs/${entry.slug}`}
          className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline underline-offset-4"
        >
          See full entry
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

