import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-6 py-10 md:px-10">
      <div className="grid w-full gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-sky-600">Northstar QMS</p>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold text-slate-950 md:text-5xl">Role-aware authentication for regulated quality operations.</h1>
            <p className="max-w-xl text-base text-slate-600">
              Supabase Auth handles sign-in, sign-up, password recovery, and server-side sessions. Middleware enforces access for Admin, Quality Manager, Auditor, and Employee routes before the app renders.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="surface-muted p-4">
              <p className="text-sm font-semibold text-slate-900">Protected sessions</p>
              <p className="mt-1 text-sm text-slate-500">SSR session refresh and redirect handling for authenticated workspaces.</p>
            </div>
            <div className="surface-muted p-4">
              <p className="text-sm font-semibold text-slate-900">Route RBAC</p>
              <p className="mt-1 text-sm text-slate-500">Navigation and middleware both enforce role-specific visibility and access.</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">{children}</div>
      </div>
    </main>
  );
}
