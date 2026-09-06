import Link from "next/link";
import { ArrowUpRight, Compass, AlertTriangle } from "lucide-react";
import type { PrepositionEntry } from "@/types/preposition";
import { PREPOSITION_TYPE_LABEL, PREPOSITION_USAGE_LABEL } from "@/types/preposition";
import { ExampleList } from "@/components/ui/ExampleList";
import { CalloutBox } from "@/components/ui/CalloutBox";

export function PrepositionCard({
  entry,
  showLink = true,
}: {
  entry: PrepositionEntry;
  showLink?: boolean;
}) {
  return (
    <div>
      <div className="flex items-start gap-4">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-accent-soft">
          <Compass className="h-7 w-7 text-accent-strong" strokeWidth={1.75} />
        </span>
        <div className="pt-1">
          <p className="text-xs uppercase tracking-widest text-accent font-medium mb-1.5">
            {PREPOSITION_TYPE_LABEL[entry.type]}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl tracking-tight leading-tight">{entry.phrase}</h1>
        </div>
      </div>

      {entry.senses.length > 1 && (
        <div className="mt-6 flex flex-wrap gap-1.5">
          {entry.senses.map((sense) => (
            <span
              key={sense.id}
              className="rounded-md bg-surface-sunken px-2.5 py-1 text-xs font-mono uppercase tracking-wide text-ink-muted"
            >
              {PREPOSITION_USAGE_LABEL[sense.usage]}
            </span>
          ))}
        </div>
      )}

      <div className="mt-7 space-y-6">
        {entry.senses.map((sense, i) => (
          <div key={sense.id}>
            {entry.senses.length > 1 && (
              <p className="text-xs uppercase tracking-widest text-accent font-medium mb-1.5">
                {PREPOSITION_USAGE_LABEL[sense.usage]}
              </p>
            )}
            <p className="text-lg leading-relaxed">{sense.explanation}</p>
            <ExampleList examples={sense.examples} />
            {i < entry.senses.length - 1 && <div className="mt-6 border-t border-border" />}
          </div>
        ))}
      </div>

      {entry.commonMistakes && entry.commonMistakes.length > 0 && (
        <div className="mt-6">
          <CalloutBox icon={AlertTriangle} label="Common mistakes">
            <ul className="space-y-1.5">
              {entry.commonMistakes.map((mistake, i) => (
                <li key={i}>{mistake}</li>
              ))}
            </ul>
          </CalloutBox>
        </div>
      )}

      {showLink && (
        <Link
          href={`/prepositions/${entry.slug}`}
          className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline underline-offset-4"
        >
          See full entry
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

