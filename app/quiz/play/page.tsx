"use client";

import { useState, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import type { QuizQuestion } from "@/types/quiz";
import { generateRandomQuiz, generateTopicQuiz, generateExamQuiz } from "@/lib/quiz/generateQuestions";
import { QuizPlayer } from "@/components/quiz/QuizPlayer";

function buildQuestions(mode: string | null, moduleId: string | null): QuizQuestion[] {
  if (mode === "topic" && moduleId) return generateTopicQuiz(moduleId, 10);
  if (mode === "exam") return generateExamQuiz(4);
  return generateRandomQuiz(10);
}

function QuizPlayPageInner() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const moduleId = searchParams.get("module");

  const [questions, setQuestions] = useState<QuizQuestion[]>(() => buildQuestions(mode, moduleId));
  const [sessionKey, setSessionKey] = useState(0);

  const handleRestart = useCallback(() => {
    setQuestions(buildQuestions(mode, moduleId));
    setSessionKey((k) => k + 1);
  }, [mode, moduleId]);

  return <QuizPlayer key={sessionKey} questions={questions} onRestart={handleRestart} />;
}

export default function QuizPlayPage() {
  return (
    <Suspense fallback={null}>
      <QuizPlayPageInner />
    </Suspense>
  );
}
