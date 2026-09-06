import Link from "next/link";
import { ArrowUpRight, MessageCircleQuestion } from "lucide-react";
import type { IdiomEntry, IdiomRegister } from "@/types/idiom";
import { IDIOM_CATEGORY_LABEL } from "@/types/idiom";
import { ExampleList } from "@/components/ui/ExampleList";

const REGISTER_LABEL: Record<IdiomRegister, string> = {
  informal: "Informal",
  neutral: "Neutral",
  formal: "Formal",
};

export function IdiomCard({
  entry,
  showLink = true,
}: {
  entry: IdiomEntry;
  showLink?: boolean;
}) {
  return (
    <div>
      <div className="flex items-start gap-4">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-accent-soft">
          <MessageCircleQuestion className="h-7 w-7 text-accent-strong" strokeWidth={1.75} />
        </span>
        <div className="pt-1">
          <p className="text-xs uppercase tracking-widest text-accent font-medium mb-1.5">
            {IDIOM_CATEGORY_LABEL[entry.category]} · {REGISTER_LABEL[entry.register]}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl tracking-tight leading-tight capitalize">
            {entry.idiom}
          </h1>
        </div>
      </div>

      <p className="mt-7 text-lg leading-relaxed">{entry.simpleDefinition}</p>
      {entry.meaning !== entry.simpleDefinition && (
        <p className="mt-2 text-sm text-ink-muted">{entry.meaning}</p>
      )}

      {entry.literalNote && (
        <p className="mt-3 text-sm text-ink-faint italic">{entry.literalNote}</p>
      )}

      <div className="mt-5">
        <p className="text-xs uppercase tracking-widest text-ink-faint mb-2">Examples</p>
        <ExampleList examples={entry.examples} />
      </div>

      {entry.synonyms && entry.synonyms.length > 0 && (
        <p className="mt-4 text-sm text-ink-muted">
          <span className="text-ink-faint">Similar to: </span>
          {entry.synonyms.join(" · ")}
        </p>
      )}

      {showLink && (
        <Link
          href={`/idioms/${entry.slug}`}
          className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline underline-offset-4"
        >
          See full entry
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

