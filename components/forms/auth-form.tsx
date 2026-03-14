import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/utils/cn";

interface AuthFormField {
  name: string;
  label: string;
  type?: string;
  placeholder: string;
  options?: Array<{ label: string; value: string }>;
}

interface AuthFormLink {
  href: string;
  label: string;
}

interface HiddenField {
  name: string;
  value: string;
}

export function AuthForm({
  title,
  description,
  action,
  fields,
  submitLabel,
  footerText,
  footerHref,
  footerLinkLabel,
  auxLinks,
  hiddenFields,
  message,
  error,
}: {
  title: string;
  description: string;
  action: (formData: FormData) => void | Promise<void>;
  fields: AuthFormField[];
  submitLabel: string;
  footerText: string;
  footerHref: string;
  footerLinkLabel: string;
  auxLinks?: AuthFormLink[];
  hiddenFields?: HiddenField[];
  message?: string;
  error?: string;
}) {
  return (
    <Card className="w-full max-w-lg border-white/80 bg-white/92 shadow-soft backdrop-blur">
      <CardHeader className="space-y-3">
        <div className="inline-flex w-fit rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
          Supabase Auth
        </div>
        <div className="space-y-2">
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription className="text-sm leading-6">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {message ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>
        ) : null}
        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}
        <form action={action} className="space-y-4">
          {hiddenFields?.map((field) => (
            <input key={field.name} name={field.name} type="hidden" value={field.value} />
          ))}
          {fields.map((field) => (
            <label className="block space-y-2 text-sm font-medium text-slate-700" key={field.name}>
              <span>{field.label}</span>
              {field.options ? (
                <Select className="bg-slate-50" name={field.name} required>
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              ) : (
                <Input className="bg-slate-50" name={field.name} placeholder={field.placeholder} required type={field.type ?? "text"} />
              )}
            </label>
          ))}
          <Button className="w-full" type="submit">
            {submitLabel}
          </Button>
        </form>
        {auxLinks?.length ? (
          <div className="flex flex-wrap gap-3 text-sm">
            {auxLinks.map((link) => (
              <Link className={cn("font-semibold text-sky-700", "hover:text-sky-900")} href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        ) : null}
        <p className="text-sm text-slate-500">
          {footerText}{" "}
          <Link className="font-semibold text-sky-700 hover:text-sky-900" href={footerHref}>
            {footerLinkLabel}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
