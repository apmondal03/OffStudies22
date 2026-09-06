import type { LearningStatus } from "@/types/dictionary";

/**
 * A lightweight spaced-repetition layer sitting on top of the existing
 * save/know/learning model — no new UI, no new user action. The signal
 * this needs already exists: marking something "Learning" or "Known" is
 * exactly the review event a scheduler needs to react to.
 *
 * Deliberately NOT a full SM-2/Anki-style algorithm (which needs a
 * 4-point quality rating per review) — this app's interaction model is a
 * 3-state toggle, so the scheduler works with what's already there:
 * geometric interval growth, capped, keyed by module + slug.
 */

interface ScheduleEntry {
  dueAt: number; // epoch ms
  interval: number; // days
}

type ModuleSchedule = Record<string, ScheduleEntry>;

const DAY_MS = 24 * 60 * 60 * 1000;
const LEARNING_START_INTERVAL_DAYS = 1;
const LEARNING_GROWTH = 2.2;
const KNOWN_START_INTERVAL_DAYS = 4;
const KNOWN_GROWTH = 3;
const MAX_INTERVAL_DAYS = 180;

function scheduleKey(moduleId: string): string {
  return `vocab:${moduleId}:schedule`;
}

function readSchedule(moduleId: string): ModuleSchedule {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(scheduleKey(moduleId));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeSchedule(moduleId: string, schedule: ModuleSchedule) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(scheduleKey(moduleId), JSON.stringify(schedule));
  } catch {
    // localStorage can throw in private browsing / when full — fail silently.
  }
}

/** Called whenever a status changes — updates that entry's review schedule. */
export function recordReview(moduleId: string, slug: string, status: LearningStatus | null): void {
  const schedule = readSchedule(moduleId);

  if (status === null) {
    delete schedule[slug];
  } else if (status === "learning") {
    const prev = schedule[slug];
    const interval = prev ? Math.min(prev.interval * LEARNING_GROWTH, MAX_INTERVAL_DAYS) : LEARNING_START_INTERVAL_DAYS;
    schedule[slug] = { interval, dueAt: Date.now() + interval * DAY_MS };
  } else if (status === "known") {
    const prev = schedule[slug];
    const interval = prev ? Math.min(prev.interval * KNOWN_GROWTH, MAX_INTERVAL_DAYS) : KNOWN_START_INTERVAL_DAYS;
    schedule[slug] = { interval, dueAt: Date.now() + interval * DAY_MS };
  }

  writeSchedule(moduleId, schedule);
}

export function isDue(moduleId: string, slug: string): boolean {
  const entry = readSchedule(moduleId)[slug];
  return Boolean(entry && entry.dueAt <= Date.now());
}

/**
 * The shared tail logic for every module's selectNext: filter out
 * recently-shown items (existing behavior, unchanged), then prefer items
 * due for review; fall back to the existing random-among-remaining-pool
 * behavior when nothing is due. This is the ONLY thing that changes in
 * each module's selection function — the pool-building logic (CEFR level,
 * category, saved/learning filters) stays exactly as it was.
 */
export function pickWithSpacedRepetition<T>(
  moduleId: string,
  pool: T[],
  getSlug: (item: T) => string,
  recentSlugs: string[],
  recentAvoidWindow = 15
): T | null {
  if (pool.length === 0) return null;

  const recentSet = new Set(recentSlugs.slice(-recentAvoidWindow));
  let candidates = pool.filter((item) => !recentSet.has(getSlug(item)));
  if (candidates.length === 0) candidates = pool;

  const due = candidates.filter((item) => isDue(moduleId, getSlug(item)));
  const finalPool = due.length > 0 ? due : candidates;

  return finalPool[Math.floor(Math.random() * finalPool.length)];
}
