"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shuffle, BookOpenCheck, GraduationCap } from "lucide-react";
import { QUIZ_MODULE_IDS, QUIZ_MODULE_LABEL } from "@/lib/quiz/generateQuestions";

export default function QuizPage() {
  const router = useRouter();
  const [topicModule, setTopicModule] = useState(QUIZ_MODULE_IDS[0]);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-14">
      <p className="text-xs uppercase tracking-widest text-accent font-medium mb-2">Quiz</p>
      <h1 className="font-display text-4xl sm:text-5xl tracking-tight mb-3">Test your knowledge</h1>
      <p className="text-ink-muted max-w-xl mb-10">
        Every question is generated from content already in Lexicon — pick a mode to start.
      </p>

      <div className="grid sm:grid-cols-3 gap-5">
        <Link
          href="/quiz/play?mode=random"
          className="group flex flex-col gap-3 rounded-2xl border border-border bg-surface p-6 hover:border-accent transition-colors"
        >
          <Shuffle className="h-7 w-7 text-accent" strokeWidth={1.5} />
          <div>
            <h2 className="font-display text-xl mb-1 group-hover:text-accent transition-colors">Random Mix</h2>
            <p className="text-sm text-ink-muted">
              10 questions pulled from everything — vocabulary, phrasal verbs, grammar, idioms,
              prepositions, and the encyclopedia.
            </p>
          </div>
        </Link>

        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-6">
          <BookOpenCheck className="h-7 w-7 text-accent" strokeWidth={1.5} />
          <div>
            <h2 className="font-display text-xl mb-1">Topic Quiz</h2>
            <p className="text-sm text-ink-muted mb-3">10 questions from one area you pick.</p>
          </div>
          <select
            value={topicModule}
            onChange={(e) => setTopicModule(e.target.value)}
            className="rounded-xl border border-border-strong bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
          >
            {QUIZ_MODULE_IDS.map((id) => (
              <option key={id} value={id}>
                {QUIZ_MODULE_LABEL[id]}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => router.push(`/quiz/play?mode=topic&module=${topicModule}`)}
            className="mt-1 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-contrast hover:bg-accent-strong"
          >
            Start
          </button>
        </div>

        <Link
          href="/quiz/play?mode=exam"
          className="group flex flex-col gap-3 rounded-2xl border border-border bg-surface p-6 hover:border-accent transition-colors"
        >
          <GraduationCap className="h-7 w-7 text-accent" strokeWidth={1.5} />
          <div>
            <h2 className="font-display text-xl mb-1 group-hover:text-accent transition-colors">Model Test</h2>
            <p className="text-sm text-ink-muted">
              A longer, comprehensive test spanning every area evenly, with a full score
              breakdown at the end — like a mock exam.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
