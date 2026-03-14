import type { SelectHTMLAttributes } from "react";

import { cn } from "@/utils/cn";

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
