import type { ReactNode } from "react";

interface AdminPageHeaderProps {
  title: string;
  eyebrow?: string;
  description?: string;
  action?: ReactNode;
  onOpenNavigation: () => void;
}

export function AdminPageHeader({
  title,
  eyebrow,
  description,
  action,
  onOpenNavigation,
}: AdminPageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <button
          type="button"
          onClick={onOpenNavigation}
          className="rounded-md border border-white/10 px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 lg:hidden"
        >
          Menu
        </button>
        <div className="min-w-0">
          {eyebrow && <p className="text-sm text-zinc-500">{eyebrow}</p>}
          <h1 className={eyebrow ? "mt-2 text-3xl font-semibold tracking-tight text-white" : "text-3xl font-semibold tracking-tight text-white"}>
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
              {description}
            </p>
          )}
        </div>
      </div>
      {action && <div className="w-full sm:w-auto">{action}</div>}
    </header>
  );
}
