import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";
import { SimpleTable } from "@/components/shared/simple-table";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuditMetrics, getAudits } from "@/services/audits";
import { formatDate } from "@/utils/format";

function getStatusVariant(status: string) {
  if (status === "Completed") return "success";
  if (status === "In Progress") return "warning";
  return "outline";
}

function getSeverityVariant(severity: string) {
  if (severity === "Critical") return "danger";
  if (severity === "Major") return "warning";
  return "outline";
}

export default async function AuditsPage() {
  const [metrics, records] = await Promise.all([getAuditMetrics(), getAudits()]);
  const openFindings = records
    .flatMap((record) =>
      record.findings
        .filter((finding) => finding.status !== "Closed")
        .map((finding) => ({
          ...finding,
          auditId: record.id,
          auditTitle: record.title,
        })),
    )
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <Link className={buttonStyles()} href="/audits/new">
            Schedule audit
          </Link>
        }
        description="Schedule audits, track findings, and drive corrective actions with documented checklists."
        eyebrow="Audit management"
        title="Keep audit readiness on track"
      />

      <section className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <StatCard key={metric.title} metric={metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Audit calendar</CardTitle>
            <CardDescription>Monitor schedules, findings, and corrective action load.</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleTable
              headers={["Audit", "Lead auditor", "Scheduled for", "Status", "Findings", "Actions"]}
              rows={records.map((record) => {
                const openFindingCount = record.findings.filter((finding) => finding.status !== "Closed").length;
                const openActionCount = record.correctiveActions.filter((action) => action.status !== "Complete").length;

                return [
                  <div key={`${record.id}-title`} className="space-y-1">
                    <Link className="font-semibold text-slate-950 hover:text-sky-700" href={`/audits/${record.id}`}>
                      {record.title}
                    </Link>
                    <p className="text-xs text-slate-500">{record.id}</p>
                  </div>,
                  record.leadAuditor,
                  formatDate(record.scheduledFor),
                  <Badge key={`${record.id}-status`} variant={getStatusVariant(record.status)}>
                    {record.status}
                  </Badge>,
                  <span key={`${record.id}-findings`} className="text-sm text-slate-600">{openFindingCount} open</span>,
                  <span key={`${record.id}-actions`} className="text-sm text-slate-600">{openActionCount} pending</span>,
                ];
              })}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Open findings</CardTitle>
            <CardDescription>Findings that need corrective action closure.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {openFindings.map((finding) => (
              <div className="surface-muted space-y-2 p-4" key={finding.id}>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-950">{finding.title}</p>
                  <Badge variant={getSeverityVariant(finding.severity)}>{finding.severity}</Badge>
                </div>
                <p className="text-xs text-slate-500">Audit: {finding.auditId}</p>
                <p className="text-sm text-slate-600">Owner: {finding.owner}</p>
                <p className="text-sm text-slate-600">Due: {formatDate(finding.dueDate)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
