"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useModuleProgress } from "@/hooks/useModuleProgress";
import { youngSightWordsModule } from "@/lib/modules/youngSightWords";
import { youngGrammarModule } from "@/lib/modules/youngGrammar";
import { discoveryModule } from "@/lib/modules/discovery";

const READY_THRESHOLD_PCT = 60;

export function YoungTransitionPrompt() {
  const [mounted, setMounted] = useState(false);
  const sightWords = useModuleProgress(youngSightWordsModule.id, youngSightWordsModule.totalCount());
  const grammar = useModuleProgress(youngGrammarModule.id, youngGrammarModule.totalCount());
  const discovery = useModuleProgress(discoveryModule.id, discoveryModule.totalCount());

  useEffect(() => setMounted(true), []);

  if (!mounted || !sightWords.hydrated || !grammar.hydrated || !discovery.hydrated) return null;

  const totalKnown = sightWords.progress.known + grammar.progress.known + discovery.progress.known;
  const totalItems = sightWords.progress.total + grammar.progress.total + discovery.progress.total;
  const pct = totalItems ? Math.round((totalKnown / totalItems) * 100) : 0;

  if (pct < READY_THRESHOLD_PCT) return null;

  return (
    <div className="mb-10 flex items-center gap-4 rounded-2xl border border-[var(--young-accent)] bg-[var(--young-accent-soft)] p-5 text-left">
      <Sparkles className="h-8 w-8 shrink-0 text-[var(--young-accent)]" />
      <div className="flex-1">
        <p className="font-semibold text-[var(--young-ink)]">
          You know {pct}% of this already — ready for more?
        </p>
        <p className="text-sm text-[var(--young-ink-muted)]">
          The full app has vocabulary, phrasal verbs, idioms, and an encyclopedia with even
          more depth.
        </p>
      </div>
      <Link
        href="/stream"
        className="shrink-0 rounded-full bg-[var(--young-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--young-accent-contrast)] hover:opacity-90 transition-opacity"
      >
        Try the full app
      </Link>
    </div>
  );
}
