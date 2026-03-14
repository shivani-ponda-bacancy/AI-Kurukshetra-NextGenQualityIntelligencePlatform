import type { MetricCard, SupplierRecord } from "@/types/qms";

const supplierRecords: SupplierRecord[] = [
  { id: "SUP-11", name: "Acme Components", score: 94, contact: "qa@acmecomponents.com", status: "Approved" },
  { id: "SUP-09", name: "Vertex Labs", score: 82, contact: "compliance@vertexlabs.com", status: "Conditional" },
  { id: "SUP-06", name: "Nova Sterile", score: 76, contact: "quality@novasterile.com", status: "Under Review" },
];

const supplierMetrics: MetricCard[] = [
  { title: "Approved suppliers", value: "42", trend: "+3 this quarter", tone: "success" },
  { title: "Avg supplier score", value: "89", trend: "+2 pts", tone: "success" },
  { title: "Conditional approvals", value: "5", trend: "Monitor closely", tone: "warning" },
];

export async function getSuppliers() {
  return supplierRecords;
}

export async function getSupplierMetrics() {
  return supplierMetrics;
}
