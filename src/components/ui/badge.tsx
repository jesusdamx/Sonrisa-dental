import type { ReactNode } from "react";

export type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "teal";

const styles: Record<BadgeVariant, string> = {
  success: "bg-emerald-500/15 text-emerald-100 ring-emerald-300/30",
  warning: "bg-amber-500/15 text-amber-100 ring-amber-300/30",
  danger: "bg-rose-500/15 text-rose-100 ring-rose-300/30",
  info: "bg-sky-500/15 text-sky-100 ring-sky-300/30",
  neutral: "bg-slate-700/50 text-slate-100 ring-slate-400/30",
  teal: "bg-teal-500/15 text-teal-100 ring-teal-300/30",
};

const dots: Record<BadgeVariant, string> = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-rose-500",
  info: "bg-sky-500",
  neutral: "bg-slate-400",
  teal: "bg-teal-500",
};

export function Badge({
  variant = "neutral",
  dot = false,
  children,
}: {
  variant?: BadgeVariant;
  dot?: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${styles[variant]}`}
    >
      {dot ? (
        <span className={`h-1.5 w-1.5 rounded-full ${dots[variant]}`} />
      ) : null}
      {children}
    </span>
  );
}
