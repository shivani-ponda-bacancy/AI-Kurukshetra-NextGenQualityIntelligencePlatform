import { NextResponse } from "next/server";

import { hasSupabaseCredentials } from "@/lib/env";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    mode: hasSupabaseCredentials() ? "configured" : "demo",
  });
}
