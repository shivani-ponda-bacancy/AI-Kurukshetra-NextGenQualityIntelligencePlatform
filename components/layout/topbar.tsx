import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getRoleLabel, isDemoMode } from "@/lib/auth";
import type { AppUser } from "@/types/auth";

export function Topbar({ user, signOutAction }: { user: AppUser; signOutAction: () => Promise<void> }) {
  return (
    <header className="surface-panel flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-semibold text-slate-900">{user.organizationName}</p>
        <p className="text-sm text-slate-500">Centralized quality operations across documents, CAPAs, suppliers, audits, and training.</p>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant={isDemoMode() ? "warning" : "success"}>{isDemoMode() ? "Demo mode" : getRoleLabel(user.role)}</Badge>
        <form action={signOutAction}>
          <Button type="submit" variant="secondary">
            Sign out
          </Button>
        </form>
      </div>
    </header>
  );
}
