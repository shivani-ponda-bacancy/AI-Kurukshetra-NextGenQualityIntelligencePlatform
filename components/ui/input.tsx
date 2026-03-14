import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/utils/cn";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...props },
  ref,
) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-100",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
