import type { MetricCard, QualityMetricPoint } from "@/types/qms";

const metricSeries: QualityMetricPoint[] = [
  { period: "Oct", closureRate: 78, defectRate: 12, supplierScore: 83 },
  { period: "Nov", closureRate: 82, defectRate: 10, supplierScore: 85 },
  { period: "Dec", closureRate: 84, defectRate: 9, supplierScore: 86 },
  { period: "Jan", closureRate: 88, defectRate: 7, supplierScore: 89 },
  { period: "Feb", closureRate: 91, defectRate: 6, supplierScore: 91 },
  { period: "Mar", closureRate: 93, defectRate: 5, supplierScore: 92 },
];

const metricCards: MetricCard[] = [
  { title: "Closure rate", value: "93%", trend: "+15 pts", tone: "success" },
  { title: "Defect rate", value: "0.8%", trend: "-0.4 pts", tone: "success" },
  { title: "Supplier quality index", value: "92", trend: "+6 pts", tone: "success" },
  { title: "Audit readiness", value: "96%", trend: "Stable", tone: "default" },
];

export async function getQualityMetrics() {
  return metricSeries;
}

export async function getQualityMetricCards() {
  return metricCards;
}
