import type { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  children: ReactNode;
}

export function FormSection({ title, children }: FormSectionProps) {
  return (
    <section className="rounded-xl border border-white/10 bg-zinc-950/50 p-4">
      <h3 className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {title}
      </h3>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}
