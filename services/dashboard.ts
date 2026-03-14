import type { DashboardOverview } from "@/types/qms";

import { getAuditMetrics, getAudits } from "@/services/audits";
import { getCapaMetrics } from "@/services/capa";
import { getDocumentMetrics } from "@/services/documents";
import { getNonConformanceMetrics } from "@/services/non-conformances";
import { getRiskMetrics, getRisks } from "@/services/risks";
import { getSupplierMetrics } from "@/services/suppliers";
import { getTrainingMetrics } from "@/services/training";

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const [documents, nonConformances, capas, audits, suppliers, risks, training, auditList, riskList] = await Promise.all([
    getDocumentMetrics(),
    getNonConformanceMetrics(),
    getCapaMetrics(),
    getAuditMetrics(),
    getSupplierMetrics(),
    getRiskMetrics(),
    getTrainingMetrics(),
    getAudits(),
    getRisks(),
  ]);

  return {
    metrics: [
      documents[0],
      nonConformances[0],
      capas[1],
      audits[1],
      suppliers[1],
      risks[0],
      training[0],
    ],
    upcomingAudits: auditList,
    priorityRisks: riskList,
  };
}
