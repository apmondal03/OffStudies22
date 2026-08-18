import Link from "next/link";
import { ArrowUpRight, PenLine, AlertTriangle } from "lucide-react";
import type { GrammarPoint } from "@/types/grammar";
import { GRAMMAR_CATEGORY_LABEL } from "@/types/grammar";
import { CefrBadge } from "@/components/ui/CefrBadge";
import { ExampleList } from "@/components/ui/ExampleList";
import { CalloutBox } from "@/components/ui/CalloutBox";

export function GrammarCard({
  entry,
  showLink = true,
}: {
  entry: GrammarPoint;
  showLink?: boolean;
}) {
  return (
    <div>
      <div className="flex items-start gap-4">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-accent-soft">
          <PenLine className="h-7 w-7 text-accent-strong" strokeWidth={1.75} />
        </span>
        <div className="flex-1 flex flex-wrap items-start justify-between gap-3 pt-1">
          <div>
            <p className="text-xs uppercase tracking-widest text-accent font-medium mb-1.5">
              {GRAMMAR_CATEGORY_LABEL[entry.category]}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl tracking-tight leading-tight">{entry.title}</h1>
          </div>
          <CefrBadge level={entry.cefrLevel} full />
        </div>
      </div>

      <p className="mt-7 text-lg leading-relaxed">{entry.explanation}</p>

      {entry.structure && (
        <div className="mt-4 rounded-xl bg-surface-sunken px-4 py-3">
          <p className="text-xs uppercase tracking-widest text-ink-faint mb-1">Structure</p>
          <p className="font-mono text-sm">{entry.structure}</p>
        </div>
      )}

      <div className="mt-5">
        <p className="text-xs uppercase tracking-widest text-ink-faint mb-2">Examples</p>
        <ExampleList examples={entry.examples} />
      </div>

      {entry.signalWords && entry.signalWords.length > 0 && (
        <p className="mt-4 text-sm text-ink-muted">
          <span className="text-ink-faint">Signal words: </span>
          {entry.signalWords.join(" · ")}
        </p>
      )}

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
          href={`/grammar/${entry.slug}`}
          className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline underline-offset-4"
        >
          See full entry
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

