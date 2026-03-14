"use client";

import { hasAnyRole } from "@/lib/rbac";
import type { Role } from "@/types/auth";

export function useRoleAccess(role: Role, allowedRoles: Role[]) {
  return hasAnyRole(role, allowedRoles);
}
