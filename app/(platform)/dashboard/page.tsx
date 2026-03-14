import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { CapaResolutionChart } from "@/components/charts/capa-resolution-chart";
import { DefectTrendsChart } from "@/components/charts/defect-trends-chart";
import { SupplierQualityChart } from "@/components/charts/supplier-quality-chart";
import { getCapaCases, getCapaResolutionSeries } from "@/services/capa";
import { getNonConformanceIssues } from "@/services/non-conformance";
import { getAudits } from "@/services/audits";
import { getSuppliers } from "@/services/suppliers";
import { getQualityMetrics } from "@/services/metrics";
import type { MetricCard } from "@/types/qms";

export default async function DashboardPage() {
  const [nonConformanceIssues, capaCases, capaResolution, suppliers, audits, qualityMetrics] = await Promise.all([
    getNonConformanceIssues(),
    getCapaCases(),
    getCapaResolutionSeries(),
    getSuppliers(),
    getAudits(),
    getQualityMetrics(),
  ]);

  const openNonConformances = nonConformanceIssues.filter((issue) => issue.status !== "Closed").length;
  const highSeverityCount = nonConformanceIssues.filter((issue) => issue.severity === "High").length;

  const verifiedCapas = capaCases.filter((caseItem) => caseItem.effectivenessStatus === "Verified").length;
  const capaCompletionRate = capaCases.length ? Math.round((verifiedCapas / capaCases.length) * 100) : 0;

  const supplierAverage = suppliers.length
    ? Math.round(suppliers.reduce((total, supplier) => total + supplier.score, 0) / suppliers.length)
    : 0;

  const auditFindings = audits.flatMap((audit) => audit.findings);
  const openAuditFindings = auditFindings.filter((finding) => finding.status !== "Closed").length;

  const metrics: MetricCard[] = [
    {
      title: "Open non-conformances",
      value: `${openNonConformances}`,
      trend: `${highSeverityCount} high severity`,
      tone: openNonConformances > 0 ? "warning" : "success",
    },
    {
      title: "CAPA completion rate",
      value: `${capaCompletionRate}%`,
      trend: `${verifiedCapas} verified`,
      tone: capaCompletionRate >= 85 ? "success" : "warning",
    },
    {
      title: "Supplier performance",
      value: `${supplierAverage}`,
      trend: "Avg score",
      tone: supplierAverage >= 85 ? "success" : "warning",
    },
    {
      title: "Audit findings",
      value: `${openAuditFindings}`,
      trend: `${auditFindings.length} total`,
      tone: openAuditFindings > 0 ? "warning" : "success",
    },
  ];

  const defectTrendData = qualityMetrics.map((point) => ({
    period: point.period,
    value: point.defectRate,
  }));
  const supplierScoreData = qualityMetrics.map((point) => ({
    period: point.period,
    value: point.supplierScore,
  }));
  const capaResolutionData = capaResolution.map((point) => ({
    period: point.period,
    value: point.days,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        description="Monitor non-conformances, CAPA performance, supplier health, and audit findings in one view."
        eyebrow="Quality dashboard"
        title="Quality operations overview"
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <StatCard key={metric.title} metric={metric} />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <DefectTrendsChart data={defectTrendData} />
        <CapaResolutionChart data={capaResolutionData} />
        <SupplierQualityChart data={supplierScoreData} />
      </section>
    </div>
  );
}
