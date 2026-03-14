import type { MetricCard, RiskRecord } from "@/types/qms";

const riskRecords: RiskRecord[] = [
  { id: "RSK-44", title: "Single-source sterilization vendor", owner: "C. Hall", rating: "Critical", mitigationStatus: "Active" },
  { id: "RSK-39", title: "Training compliance lag in packaging", owner: "P. Sharma", rating: "High", mitigationStatus: "Monitoring" },
  { id: "RSK-35", title: "Document approval bottleneck", owner: "A. Chen", rating: "Medium", mitigationStatus: "Planned" },
];

const riskMetrics: MetricCard[] = [
  { title: "Critical risks", value: "3", trend: "No net increase", tone: "warning" },
  { title: "Mitigation on track", value: "87%", trend: "+5 pts", tone: "success" },
  { title: "Residual risk trend", value: "Down", trend: "Improving", tone: "success" },
];

export async function getRisks() {
  return riskRecords;
}

export async function getRiskMetrics() {
  return riskMetrics;
}
