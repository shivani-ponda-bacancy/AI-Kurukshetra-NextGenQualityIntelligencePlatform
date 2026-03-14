import { navigationItems } from "@/lib/navigation";
import type { Role } from "@/types/auth";

export interface ProtectedRouteRule {
  prefix: string;
  roles: Role[];
}

export const protectedRouteRules: ProtectedRouteRule[] = [
  { prefix: "/dashboard", roles: ["admin", "quality_manager", "auditor", "employee"] },
  { prefix: "/documents", roles: ["admin", "quality_manager", "employee"] },
  { prefix: "/non-conformances", roles: ["admin", "quality_manager", "auditor"] },
  { prefix: "/non-conformance", roles: ["admin", "quality_manager", "auditor"] },
  { prefix: "/capa", roles: ["admin", "quality_manager"] },
  { prefix: "/audits", roles: ["admin", "quality_manager", "auditor"] },
  { prefix: "/suppliers", roles: ["admin", "quality_manager"] },
  { prefix: "/risks", roles: ["admin", "quality_manager", "auditor"] },
  { prefix: "/training", roles: ["admin", "quality_manager", "employee"] },
  { prefix: "/quality-metrics", roles: ["admin", "quality_manager", "auditor"] },
];

export const publicAuthRoutes = ["/sign-in", "/sign-up", "/forgot-password", "/reset-password"];
export const publicRoutes = ["/", ...publicAuthRoutes, "/auth/callback"];

export function hasAnyRole(role: Role, allowedRoles: Role[]) {
  return allowedRoles.includes(role);
}

export function getNavigationForRole(role: Role) {
  return navigationItems.filter((item) => item.roles.includes(role));
}

export function getAllowedRolesForPath(pathname: string) {
  return protectedRouteRules.find((route) => pathname === route.prefix || pathname.startsWith(`${route.prefix}/`))?.roles ?? null;
}

export function isPublicRoute(pathname: string) {
  return publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}


