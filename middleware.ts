import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { isDemoMode } from "@/lib/auth";
import { getAllowedRolesForPath, hasAnyRole, isPublicRoute, publicAuthRoutes } from "@/lib/rbac";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const { response, user, role } = await updateSession(request);

  if (isDemoMode()) {
    return response;
  }

  const isAuthRoute = publicAuthRoutes.some((route) => pathname === route);
  const allowedRoles = getAllowedRolesForPath(pathname);

  if (!user && !isPublicRoute(pathname)) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("message", "Please sign in to continue.");
    signInUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (user && allowedRoles && !hasAnyRole(role, allowedRoles)) {
    const dashboardUrl = new URL("/dashboard", request.url);
    dashboardUrl.searchParams.set("error", "You do not have access to that area.");
    return NextResponse.redirect(dashboardUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
