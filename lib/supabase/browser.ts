import { createBrowserClient } from "@supabase/ssr";

import { env, hasSupabaseCredentials } from "@/lib/env";
import type { Database } from "@/types/database";

export function createBrowserSupabaseClient() {
  if (!hasSupabaseCredentials()) {
    return null;
  }

  return createBrowserClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL!, env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
}
