export function ShowMoreButton({
  remaining,
  onClick,
}: {
  remaining: number;
  onClick: () => void;
}) {
  return (
    <div className="mt-8 text-center">
      <button
        type="button"
        onClick={onClick}
        className="rounded-full border border-border-strong px-6 py-2.5 text-sm font-medium hover:border-accent hover:text-accent transition-colors"
      >
        Show more ({remaining} remaining)
      </button>
    </div>
  );
}
