import type { ReactNode } from "react";
import type { AdminSection } from "../types";

interface AdminShellProps {
  activeSection: AdminSection;
  sidebarCollapsed: boolean;
  sidebarOpen: boolean;
  onNavigate: (section: AdminSection) => void;
  onLock: () => void;
  onCloseSidebar: () => void;
  onToggleSidebar: () => void;
  children: ReactNode;
}

export function AdminShell({
  activeSection,
  sidebarCollapsed,
  sidebarOpen,
  onNavigate,
  onLock,
  onCloseSidebar,
  onToggleSidebar,
  children,
}: AdminShellProps) {
  const shellGridClass = sidebarCollapsed
    ? "lg:grid-cols-[88px_1fr]"
    : "lg:grid-cols-[288px_1fr]";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onCloseSidebar}
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
        />
      )}

      <div className={`min-h-screen lg:grid ${shellGridClass}`}>
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 p-3 transition-transform duration-200 lg:static lg:z-auto lg:w-auto lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-zinc-900/90 p-4 shadow-2xl">
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-zinc-950 font-semibold">
                SH
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium leading-none">Self Heavenly</p>
                  <p className="mt-1 truncate text-xs text-zinc-500">Admin Console</p>
                </div>
              )}
            </div>

            <nav className="mt-8 space-y-6 text-sm">
              <NavGroup title="Mini Apps" collapsed={sidebarCollapsed}>
                <NavItem
                  active={activeSection === "date-designer"}
                  onClick={() => onNavigate("date-designer")}
                  collapsed={sidebarCollapsed}
                  shortLabel="DD"
                >
                  Date Designer
                </NavItem>
                <NavItem disabled collapsed={sidebarCollapsed} shortLabel="FM">
                  Future mini app
                </NavItem>
              </NavGroup>
              <NavGroup title="Website" collapsed={sidebarCollapsed}>
                <NavItem disabled collapsed={sidebarCollapsed} shortLabel="HP">
                  Home Page
                </NavItem>
                <NavItem
                  active={activeSection === "password"}
                  onClick={() => onNavigate("password")}
                  collapsed={sidebarCollapsed}
                  shortLabel="PW"
                >
                  Admin Password
                </NavItem>
              </NavGroup>
            </nav>

            <button
              onClick={onLock}
              className="mt-auto rounded-md border border-white/10 px-3 py-2 text-sm text-zinc-300 hover:bg-white/5"
            >
              {sidebarCollapsed ? "Lock" : "Lock admin"}
            </button>

            <button
              type="button"
              onClick={onToggleSidebar}
              className="mt-2 hidden rounded-md border border-white/10 px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 lg:block"
              aria-expanded={!sidebarCollapsed}
            >
              {sidebarCollapsed ? "Expand" : "Collapse"}
            </button>
          </div>
        </aside>

        <main className="min-w-0 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

function NavGroup({
  title,
  children,
  collapsed,
}: {
  title: string;
  children: ReactNode;
  collapsed?: boolean;
}) {
  return (
    <div>
      {!collapsed && (
        <p className="px-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
          {title}
        </p>
      )}
      <div className="mt-2 space-y-1">{children}</div>
    </div>
  );
}

function NavItem({
  children,
  active,
  disabled,
  onClick,
  collapsed,
  shortLabel,
}: {
  children: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
  shortLabel?: string;
}) {
  const content = collapsed ? shortLabel ?? children : children;
  const className = `w-full rounded-md px-3 py-2 ${
    collapsed ? "text-center" : "text-left"
  } ${
    active
      ? "bg-white/10 text-white"
      : disabled
        ? "text-zinc-600"
        : "text-zinc-400 hover:bg-white/5"
  }`;

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={className}
        title={collapsed && typeof children === "string" ? children : undefined}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      className={className}
      title={collapsed && typeof children === "string" ? children : undefined}
    >
      {content}
    </div>
  );
}
