import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiz",
  description: "Test your knowledge across vocabulary, phrasal verbs, grammar, idioms, prepositions, and the encyclopedia.",
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return children;
}
