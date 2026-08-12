import type { ReactNode } from "react";

export type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "teal";

const styles: Record<BadgeVariant, string> = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  warning: "bg-amber-50 text-amber-700 ring-amber-600/20",
  danger: "bg-rose-50 text-rose-700 ring-rose-600/20",
  info: "bg-sky-50 text-sky-700 ring-sky-600/20",
  neutral: "bg-slate-100 text-slate-600 ring-slate-500/20",
  teal: "bg-teal-50 text-teal-700 ring-teal-600/20",
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
