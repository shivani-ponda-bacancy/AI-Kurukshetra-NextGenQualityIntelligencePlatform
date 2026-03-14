import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { getNavigationForRole } from "@/lib/rbac";
import type { AppUser } from "@/types/auth";

export function Sidebar({ user }: { user: AppUser }) {
  const items = getNavigationForRole(user.role);

  return (
    <aside className="surface-panel sticky top-6 hidden h-[calc(100vh-3rem)] w-72 shrink-0 flex-col justify-between overflow-hidden lg:flex">
      <div className="p-6">
        <div className="space-y-4 border-b border-slate-100 pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600">Northstar QMS</p>
            <h2 className="mt-2 text-2xl font-semibold">Operational Quality</h2>
          </div>
          <Badge variant="outline">{user.organizationName}</Badge>
        </div>
        <nav className="mt-6 space-y-1.5">
          {items.map((item) => (
            <Link
              className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              href={item.href}
              key={item.href}
            >
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-slate-100 p-6">
        <p className="text-sm font-semibold text-slate-900">{user.fullName}</p>
        <p className="text-sm text-slate-500">{user.email}</p>
      </div>
    </aside>
  );
}
