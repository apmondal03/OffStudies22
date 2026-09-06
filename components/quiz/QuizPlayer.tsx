"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import type { QuizQuestion, QuizAnswer } from "@/types/quiz";
import { QuizQuestionCard } from "@/components/quiz/QuizQuestionCard";
import { QuizResults } from "@/components/quiz/QuizResults";

export function QuizPlayer({ questions, onRestart }: { questions: QuizQuestion[]; onRestart: () => void }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);

  if (questions.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="font-display text-2xl tracking-tight mb-3">Not enough content for this quiz yet.</p>
        <Link href="/quiz" className="text-accent font-medium hover:underline">
          ← Back to quiz options
        </Link>
      </div>
    );
  }

  if (index >= questions.length) {
    return <QuizResults answers={answers} onRetry={onRestart} />;
  }

  const question = questions[index];

  function handleSelect(option: string) {
    if (selected !== null) return;
    setSelected(option);
    setAnswers((prev) => [...prev, { question, selected: option, correct: option === question.correctAnswer }]);
  }

  function handleNext() {
    setSelected(null);
    setIndex((i) => i + 1);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/quiz"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Exit quiz
        </Link>
        <span className="font-mono text-sm text-ink-faint">
          {index + 1} / {questions.length}
        </span>
      </div>

      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken">
        <div
          className="h-full rounded-full bg-accent transition-all duration-300"
          style={{ width: `${((index + (selected ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      <div key={question.id} className="animate-word-enter">
        <QuizQuestionCard question={question} selected={selected} onSelect={handleSelect} />
      </div>

      {selected !== null && (
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-1.5 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-contrast hover:bg-accent-strong"
          >
            {index + 1 === questions.length ? "See results" : "Next question"}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
