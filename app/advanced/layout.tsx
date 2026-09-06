import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Advanced 1500",
  description: "C1 and C2 vocabulary for advanced English learners, beyond the Core 3000 essentials.",
};

export default function AdvancedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
