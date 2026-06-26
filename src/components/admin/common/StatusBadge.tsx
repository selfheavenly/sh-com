import type { ReactNode } from "react";

export type StatusTone = "green" | "blue" | "amber" | "red" | "zinc";

interface StatusBadgeProps {
  children: ReactNode;
  tone: StatusTone;
}

export function StatusBadge({ children, tone }: StatusBadgeProps) {
  const tones: Record<StatusTone, string> = {
    green: "border-emerald-500/25 bg-emerald-500/10 text-emerald-200",
    blue: "border-sky-500/25 bg-sky-500/10 text-sky-200",
    amber: "border-amber-500/25 bg-amber-500/10 text-amber-200",
    red: "border-red-500/25 bg-red-500/10 text-red-200",
    zinc: "border-white/10 bg-white/5 text-zinc-300",
  };

  return (
    <span className={`rounded-full border px-2 py-0.5 text-xs ${tones[tone]}`}>
      {children}
    </span>
  );
}
