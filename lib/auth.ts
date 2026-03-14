import type { AppUser, Role } from "@/types/auth";
import { hasSupabaseCredentials } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const demoUser: AppUser = {
  id: "demo-user",
  email: "quality.lead@northstarqms.com",
  fullName: "Priya Sharma",
  organizationName: "Northstar Biologics",
  role: "quality_manager",
};

const supportedRoles: Role[] = ["admin", "quality_manager", "auditor", "employee"];

export function normalizeRole(value: string | undefined): Role {
  if (value && supportedRoles.includes(value as Role)) {
    return value as Role;
  }

  return "employee";
}

export function getRoleLabel(role: Role) {
  return role
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export async function getCurrentUser() {
  if (!hasSupabaseCredentials()) {
    return demoUser;
  }

  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return demoUser;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? demoUser.email,
    fullName: (user.user_metadata.full_name as string | undefined) ?? "Quality user",
    organizationName: (user.user_metadata.organization_name as string | undefined) ?? "Customer workspace",
    role: normalizeRole(user.user_metadata.role as string | undefined),
  } satisfies AppUser;
}

export function isDemoMode() {
  return !hasSupabaseCredentials();
}
