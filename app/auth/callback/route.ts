import { type NextRequest, NextResponse } from "next/server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";
  const redirectUrl = new URL(next, request.url);

  if (code) {
    const supabase = createServerSupabaseClient();

    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        const signInUrl = new URL("/sign-in", request.url);
        signInUrl.searchParams.set("error", error.message);
        return NextResponse.redirect(signInUrl);
      }
    }
  }

  return NextResponse.redirect(redirectUrl);
}
