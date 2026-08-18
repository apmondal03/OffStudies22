import { EncyclopediaCard } from "@/components/dictionary/EncyclopediaCard";
import type { DiscoveryEntry } from "@/types/discovery";

export function EncyclopediaStreamCard({ entry }: { entry: DiscoveryEntry }) {
  return (
    <div className="rounded-3xl border border-border bg-surface p-8 sm:p-12 text-left">
      <EncyclopediaCard entry={entry} />
    </div>
  );
}
