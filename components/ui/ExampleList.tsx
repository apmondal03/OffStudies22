export function ExampleList({ examples }: { examples: string[] }) {
  if (examples.length === 0) return null;

  return (
    <ul className="mt-3 space-y-2">
      {examples.map((ex, i) => (
        <li
          key={i}
          className="border-l-2 border-border-strong pl-3.5 text-base text-ink-muted italic leading-relaxed"
        >
          &ldquo;{ex}&rdquo;
        </li>
      ))}
    </ul>
  );
}
