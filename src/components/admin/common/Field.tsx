import type { ReactNode } from "react";

interface FieldProps {
  label: string;
  hint?: string;
  children: ReactNode;
}

export function Field({ label, hint, children }: FieldProps) {
  return (
    <label className="block space-y-2">
      <span className="flex items-center gap-2 text-sm text-zinc-300">
        {label}
        {hint && <span className="text-xs text-zinc-600">{hint}</span>}
      </span>
      {children}
    </label>
  );
}
