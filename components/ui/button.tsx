import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-sky-700",
  secondary: "bg-secondary text-secondary-foreground hover:bg-slate-200",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
  danger: "bg-danger text-danger-foreground hover:bg-red-700",
};

export function buttonStyles(variant: ButtonVariant = "primary") {
  return cn(
    "inline-flex h-11 items-center justify-center rounded-2xl px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    variantClasses[variant],
  );
}

export function Button({ className, variant = "primary", type = "button", ...props }: ButtonProps) {
  return <button className={cn(buttonStyles(variant), className)} type={type} {...props} />;
}
