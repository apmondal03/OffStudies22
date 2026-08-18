import Link from "next/link";
import { Trophy, RotateCcw, ArrowUpRight } from "lucide-react";
import type { QuizAnswer } from "@/types/quiz";

function scoreMessage(pct: number): string {
  if (pct >= 90) return "Outstanding!";
  if (pct >= 75) return "Great work!";
  if (pct >= 50) return "Good effort — keep practicing.";
  return "Keep going — review and try again.";
}

export function QuizResults({
  answers,
  onRetry,
}: {
  answers: QuizAnswer[];
  onRetry: () => void;
}) {
  const total = answers.length;
  const correct = answers.filter((a) => a.correct).length;
  const pct = total ? Math.round((correct / total) * 100) : 0;

  const byModule = new Map<string, { label: string; correct: number; total: number }>();
  for (const a of answers) {
    const existing = byModule.get(a.question.moduleId) ?? {
      label: a.question.moduleLabel,
      correct: 0,
      total: 0,
    };
    existing.total += 1;
    if (a.correct) existing.correct += 1;
    byModule.set(a.question.moduleId, existing);
  }

  const missed = answers.filter((a) => !a.correct);

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10 sm:py-16">
      <div className="rounded-3xl border border-border bg-surface p-8 sm:p-12 text-center">
        <Trophy className="mx-auto h-10 w-10 text-accent mb-4" strokeWidth={1.5} />
        <p className="font-display text-5xl tracking-tight mb-1">{pct}%</p>
        <p className="text-ink-muted mb-1">
          {correct} of {total} correct
        </p>
        <p className="text-lg font-medium mt-3">{scoreMessage(pct)}</p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-contrast hover:bg-accent-strong"
        >
          <RotateCcw className="h-4 w-4" />
          Take another quiz
        </button>
      </div>

      {byModule.size > 1 && (
        <div className="mt-8">
          <h2 className="text-sm uppercase tracking-wide text-ink-faint mb-3">By category</h2>
          <div className="space-y-3">
            {Array.from(byModule.values()).map((m) => {
              const modulePct = Math.round((m.correct / m.total) * 100);
              return (
                <div key={m.label} className="rounded-xl border border-border bg-surface px-4 py-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium">{m.label}</span>
                    <span className="text-sm text-ink-muted">
                      {m.correct}/{m.total}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${modulePct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {missed.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm uppercase tracking-wide text-ink-faint mb-3">
            Review what you missed ({missed.length})
          </h2>
          <ul className="space-y-2">
            {missed.map((a) => (
              <li key={a.question.id}>
                <Link
                  href={a.question.sourceHref}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3 hover:border-accent transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium">{a.question.prompt}</p>
                    <p className="text-xs text-ink-muted mt-0.5">{a.question.correctAnswer}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
