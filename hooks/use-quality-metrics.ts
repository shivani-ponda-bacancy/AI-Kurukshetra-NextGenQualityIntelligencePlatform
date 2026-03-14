"use client";

import { useQuery } from "@tanstack/react-query";

import type { QualityMetricPoint } from "@/types/qms";

async function fetchMetrics(): Promise<QualityMetricPoint[]> {
  const response = await fetch("/api/metrics", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load quality metrics");
  }

  return response.json();
}

export function useQualityMetrics() {
  return useQuery({
    queryKey: ["quality-metrics"],
    queryFn: fetchMetrics,
  });
}
