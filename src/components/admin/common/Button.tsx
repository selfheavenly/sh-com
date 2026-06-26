import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

export function Button({
  children,
  className = "",
  variant = "secondary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
}) {
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-white text-zinc-950 hover:bg-zinc-200",
    secondary: "border border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10",
    danger: "border border-red-500/25 bg-red-500/10 text-red-100 hover:bg-red-500/20",
    ghost: "text-zinc-400 hover:bg-white/5 hover:text-zinc-100",
  };

  return (
    <button
      {...props}
      className={`inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
