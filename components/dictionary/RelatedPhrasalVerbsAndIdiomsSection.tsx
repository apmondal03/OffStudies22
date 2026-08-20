import Link from "next/link";
import { getRelatedPhrasalVerbs, getRelatedIdioms } from "@/lib/dictionary/wordCrossLinks";

export function RelatedPhrasalVerbsAndIdiomsSection({ word }: { word: string }) {
  const phrasalVerbs = getRelatedPhrasalVerbs(word);
  const idioms = getRelatedIdioms(word);

  if (phrasalVerbs.length === 0 && idioms.length === 0) return null;

  return (
    <section className="mt-10 border-t border-border pt-8 space-y-6">
      {phrasalVerbs.length > 0 && (
        <div>
          <h2 className="text-sm uppercase tracking-wide text-ink-faint mb-3">
            Phrasal verbs with &ldquo;{word}&rdquo;
          </h2>
          <div className="flex flex-wrap gap-2">
            {phrasalVerbs.map((p) => (
              <Link
                key={p.slug}
                href={`/phrasal-verbs/${p.slug}`}
                className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm hover:border-accent hover:text-accent transition-colors"
              >
                {p.phrase}
              </Link>
            ))}
          </div>
        </div>
      )}

      {idioms.length > 0 && (
        <div>
          <h2 className="text-sm uppercase tracking-wide text-ink-faint mb-3">
            Idioms with &ldquo;{word}&rdquo;
          </h2>
          <div className="flex flex-wrap gap-2">
            {idioms.map((i) => (
              <Link
                key={i.slug}
                href={`/idioms/${i.slug}`}
                className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm capitalize hover:border-accent hover:text-accent transition-colors"
              >
                {i.idiom}
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
