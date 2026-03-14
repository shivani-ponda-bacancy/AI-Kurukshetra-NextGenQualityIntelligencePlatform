import { NextResponse } from "next/server";

import { getQualityMetrics } from "@/services/metrics";

export async function GET() {
  return NextResponse.json(await getQualityMetrics());
}
