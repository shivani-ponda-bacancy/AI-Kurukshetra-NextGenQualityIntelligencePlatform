import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { env, hasSupabaseCredentials } from "@/lib/env";
import { normalizeRole } from "@/lib/auth";
import type { Role } from "@/types/auth";
import type { Database } from "@/types/database";

export async function updateSession(request: NextRequest) {
  if (!hasSupabaseCredentials()) {
    return {
      response: NextResponse.next({ request }),
      user: null,
      role: "quality_manager" as Role,
    };
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL!, env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({ name, value, ...options });
        response = NextResponse.next({ request });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({ name, value: "", ...options });
        response = NextResponse.next({ request });
        response.cookies.set({ name, value: "", ...options, maxAge: 0 });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return {
    response,
    user,
    role: normalizeRole(user?.user_metadata.role as string | undefined),
  };
}
