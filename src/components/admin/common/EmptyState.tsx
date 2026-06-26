import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  body: string;
  action?: ReactNode;
}

export function EmptyState({ title, body, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-[620px] items-center justify-center p-8 text-center">
      <div className="max-w-sm">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-500">{body}</p>
        {action && <div className="mt-5">{action}</div>}
      </div>
    </div>
  );
}
