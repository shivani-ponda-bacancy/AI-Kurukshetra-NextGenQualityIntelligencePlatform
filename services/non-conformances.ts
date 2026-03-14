import type { MetricCard, NonConformanceRecord } from "@/types/qms";

const nonConformanceRecords: NonConformanceRecord[] = [
  { id: "NC-301", title: "Label reconciliation gap", severity: "Major", owner: "S. Mehta", dueDate: "2026-03-22", status: "Investigating" },
  { id: "NC-287", title: "Supplier COA mismatch", severity: "Critical", owner: "J. Owens", dueDate: "2026-03-19", status: "Open" },
  { id: "NC-275", title: "Calibration overdue", severity: "Minor", owner: "T. Grant", dueDate: "2026-03-27", status: "Closed" },
];

const nonConformanceMetrics: MetricCard[] = [
  { title: "Open events", value: "14", trend: "2 critical", tone: "danger" },
  { title: "Average closure", value: "9 days", trend: "-1.4 days", tone: "success" },
  { title: "Containment on time", value: "93%", trend: "+4 pts", tone: "success" },
];

export async function getNonConformances() {
  return nonConformanceRecords;
}

export async function getNonConformanceMetrics() {
  return nonConformanceMetrics;
}
