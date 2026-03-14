import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { signOutAction } from "@/app/actions/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { getCurrentUser } from "@/lib/auth";

export default async function PlatformLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1600px] gap-6 px-6 py-6 md:px-10 lg:px-8">
      <Sidebar user={user} />
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <Topbar signOutAction={signOutAction} user={user} />
        <div className="flex-1 space-y-6">{children}</div>
      </div>
    </div>
  );
}
