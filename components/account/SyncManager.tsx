"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { pullAndMergeProgress, pushAllProgress } from "@/lib/sync/progressSync";

const PUSH_INTERVAL_MS = 30_000;

/**
 * Renders nothing — mounted once in the root layout to run sync in the
 * background. Belt-and-suspenders scoping to the adult track: even though
 * lib/sync/progressSync.ts already only ever touches adult-track module
 * IDs, this component additionally refuses to run at all on /kids or
 * /young-learners routes, so there are two independent reasons the
 * children's tracks never interact with the account system.
 */
export function SyncManager() {
  const pathname = usePathname();
  const { user, isConfigured } = useAuth();
  const hasPulledRef = useRef(false);

  const isChildrenRoute = pathname?.startsWith("/kids") || pathname?.startsWith("/young-learners");

  useEffect(() => {
    if (isChildrenRoute || !isConfigured || !user) {
      hasPulledRef.current = false;
      return;
    }

    if (!hasPulledRef.current) {
      hasPulledRef.current = true;
      pullAndMergeProgress(user.id).then(() => pushAllProgress(user.id));
    }

    const interval = setInterval(() => pushAllProgress(user.id), PUSH_INTERVAL_MS);

    function handleVisibility() {
      if (document.visibilityState === "hidden" && user) {
        pushAllProgress(user.id);
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [user, isConfigured, isChildrenRoute]);

  return null;
}
