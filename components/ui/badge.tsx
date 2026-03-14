import type { HTMLAttributes } from "react";

import { cn } from "@/utils/cn";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "outline";

const badgeClasses: Record<BadgeVariant, string> = {
  default: "bg-sky-100 text-sky-700",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-700",
  outline: "border border-slate-200 bg-white text-slate-600",
};

export function Badge({ className, children, variant = "default", ...props }: HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", badgeClasses[variant], className)} {...props}>
      {children}
    </span>
  );
}
