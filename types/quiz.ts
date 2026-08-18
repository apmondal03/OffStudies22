/**
 * Data model for the Quiz section. Three modes, all built from the same
 * underlying question-generation pipeline:
 * - "random": questions drawn from all 6 adult modules mixed together
 * - "topic": questions from one selected module only
 * - "exam": a longer, fixed-composition test spanning every module
 *   proportionally, with a category breakdown at the end — the "model
 *   test" format.
 *
 * Every question is multiple-choice, generated locally from existing
 * content data (no network dependency, no separate quiz content to author
 * — the definitions/explanations/facts already written for every module
 * become both the correct answer and, for other entries, distractors).
 */

export type QuizMode = "random" | "topic" | "exam";

export interface QuizQuestion {
  id: string;
  moduleId: string;
  moduleLabel: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  sourceSlug: string;
  sourceHref: string;
}

export interface QuizAnswer {
  question: QuizQuestion;
  selected: string;
  correct: boolean;
}
