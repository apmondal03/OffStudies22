import type { LucideIcon } from "lucide-react";

interface CalloutBoxProps {
  icon: LucideIcon;
  label: string;
  tone?: "warning" | "accent" | "highlight";
  children: React.ReactNode;
}

export function CalloutBox({ icon: Icon, label, tone = "warning", children }: CalloutBoxProps) {
  const toneClasses =
    tone === "warning"
      ? "border-b2 bg-[color-mix(in_srgb,var(--b2)_7%,transparent)] text-b2"
      : tone === "highlight"
        ? "border-b1 bg-[color-mix(in_srgb,var(--b1)_7%,transparent)] text-b1"
        : "border-accent bg-accent-soft text-accent-strong";

  return (
    <div className={`flex gap-3 rounded-2xl border-l-[3px] px-5 py-4 ${toneClasses}`}>
      <Icon className="h-4 w-4 shrink-0 mt-0.5" strokeWidth={2} />
      <div>
        <p className="text-xs uppercase tracking-widest font-medium mb-1">{label}</p>
        <div className="text-sm leading-relaxed text-ink">{children}</div>
      </div>
    </div>
  );
}
