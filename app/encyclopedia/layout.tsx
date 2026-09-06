import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Encyclopedia",
  description: "Explore facts about animals, space, history, science, and more — cross-linked with vocabulary you're learning.",
};

export default function EncyclopediaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
