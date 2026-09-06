import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complete Dictionary",
  description: "Every word looked up on this site, saved automatically and growing over time.",
};

export default function DictionaryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
