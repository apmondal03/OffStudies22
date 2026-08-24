import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles, Link2 } from "lucide-react";
import { DISCOVERY_CATEGORY_LABEL } from "@/types/discovery";
import type { DiscoveryEntry } from "@/types/discovery";
import { getRelatedVocabulary } from "@/lib/discovery/crossLinks";
import { CalloutBox } from "@/components/ui/CalloutBox";

export function EncyclopediaCard({
  entry,
  showLink = true,
}: {
  entry: DiscoveryEntry;
  showLink?: boolean;
}) {
  const relatedWords = getRelatedVocabulary(entry);

  return (
    <div>
      {entry.imageUrl ? (
        <div className="mb-5">
          <Image
            src={entry.imageUrl}
            alt={entry.name}
            width={640}
            height={220}
            unoptimized
            className="h-48 sm:h-56 w-full rounded-2xl object-cover"
          />
          <p className="mt-4 text-xs uppercase tracking-widest text-accent font-medium mb-1.5">
            {DISCOVERY_CATEGORY_LABEL[entry.category]}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl tracking-tight leading-tight">{entry.name}</h1>
        </div>
      ) : (
        <div className="flex items-start gap-4">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-4xl leading-none">
            {entry.emoji}
          </span>
          <div className="pt-1">
            <p className="text-xs uppercase tracking-widest text-accent font-medium mb-1.5">
              {DISCOVERY_CATEGORY_LABEL[entry.category]}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl tracking-tight leading-tight">{entry.name}</h1>
          </div>
        </div>
      )}

      <ul className="mt-7 space-y-4">
        {entry.facts.map((fact, i) => (
          <li key={i} className="flex gap-3.5 text-lg leading-relaxed">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft font-mono text-xs font-medium text-accent-strong">
              {i + 1}
            </span>
            <span>{fact}</span>
          </li>
        ))}
      </ul>

      {entry.funFact && (
        <div className="mt-6">
          <CalloutBox icon={Sparkles} label="Fun fact" tone="highlight">
            {entry.funFact}
          </CalloutBox>
        </div>
      )}

      {relatedWords.length > 0 && (
        <div className="mt-6">
          <p className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-ink-faint mb-2.5">
            <Link2 className="h-3.5 w-3.5" />
            Related words
          </p>
          <div className="flex flex-wrap gap-2">
            {relatedWords.map((w) => (
              <Link
                key={w.slug}
                href={`/word/${w.slug}`}
                className="rounded-full border border-border px-3 py-1 text-sm text-ink-muted hover:border-accent hover:text-accent transition-colors"
              >
                {w.word}
              </Link>
            ))}
          </div>
        </div>
      )}

      {showLink && (
        <Link
          href={`/encyclopedia/${entry.slug}`}
          className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline underline-offset-4"
        >
          See full entry
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
