import { useEffect, useState } from "react";

const DEFAULT_PAGE_SIZE = 60;

/**
 * "Show more" pagination, capped so no listing page ever renders an
 * unbounded number of cards at once — a real usability issue once a
 * module accumulates admin-added entries on top of its built-in set.
 * `filteredCount` should be the length of whatever's currently filtered/
 * searched; visibleCount automatically resets to one page whenever that
 * count changes, so switching a filter or typing a search query doesn't
 * leave "Show more" needing an extra click to catch up.
 */
export function usePagination(filteredCount: number, pageSize = DEFAULT_PAGE_SIZE) {
  const [visibleCount, setVisibleCount] = useState(pageSize);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [filteredCount, pageSize]);

  return {
    visibleCount,
    showMore: () => setVisibleCount((c) => c + pageSize),
    hasMore: visibleCount < filteredCount,
    remaining: Math.max(0, filteredCount - visibleCount),
  };
}
