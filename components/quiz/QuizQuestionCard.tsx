"use client";

import { Check, X } from "lucide-react";
import type { QuizQuestion } from "@/types/quiz";

export function QuizQuestionCard({
  question,
  selected,
  onSelect,
}: {
  question: QuizQuestion;
  selected: string | null;
  onSelect: (option: string) => void;
}) {
  const answered = selected !== null;

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 sm:p-10">
      <p className="text-xs uppercase tracking-widest text-accent font-medium mb-3">
        {question.moduleLabel}
      </p>
      <h2 className="font-display text-2xl sm:text-3xl tracking-tight leading-snug mb-6">
        {question.prompt}
      </h2>

      <div className="flex flex-col gap-2.5">
        {question.options.map((option) => {
          const isCorrect = option === question.correctAnswer;
          const isSelected = option === selected;

          let style = "border-border hover:border-accent hover:bg-accent-soft/40";
          if (answered && isCorrect) {
            style = "border-accent bg-accent-soft text-accent-strong";
          } else if (answered && isSelected && !isCorrect) {
            style = "border-b2 bg-[color-mix(in_srgb,var(--b2)_10%,transparent)] text-b2";
          } else if (answered) {
            style = "border-border opacity-60";
          }

          return (
            <button
              key={option}
              type="button"
              disabled={answered}
              onClick={() => onSelect(option)}
              className={`flex items-start gap-2.5 rounded-2xl border px-4 py-3.5 text-left text-base transition-colors disabled:cursor-default ${style}`}
            >
              <span className="flex-1">{option}</span>
              {answered && isCorrect && <Check className="h-5 w-5 shrink-0 text-accent" />}
              {answered && isSelected && !isCorrect && <X className="h-5 w-5 shrink-0 text-b2" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
