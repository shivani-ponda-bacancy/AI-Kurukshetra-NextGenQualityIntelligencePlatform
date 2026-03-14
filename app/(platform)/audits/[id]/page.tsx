import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleTable } from "@/components/shared/simple-table";
import { getAuditReportById } from "@/services/audits";
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

function getActionVariant(status: string) {
  if (status === "Complete") return "success";
  if (status === "In Progress") return "warning";
  return "outline";
}

export default async function AuditDetailPage({ params }: { params: { id: string } }) {
  const audit = await getAuditReportById(params.id);

  if (!audit) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={getStatusVariant(audit.status)}>{audit.status}</Badge>
            <a className={buttonStyles("secondary")} href={`/api/audits/${audit.id}/report`} rel="noreferrer" target="_blank">
              Export PDF
            </a>
            <Link className={buttonStyles("secondary")} href="/audits">
              Back to audits
            </Link>
          </div>
        }
        description={audit.description}
        eyebrow="Audit report"
        title={audit.title}
      />

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Audit summary</CardTitle>
            <CardDescription>Schedule, scope, and ownership details.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Lead auditor</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{audit.leadAuditor}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Scheduled for</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{formatDate(audit.scheduledFor)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Location</p>
              <p className="mt-2 text-sm font-medium text-slate-700">{audit.location}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Audit type</p>
              <p className="mt-2 text-sm font-medium text-slate-700">{audit.auditType}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Scope</p>
              <p className="mt-2 text-sm text-slate-600">{audit.scope}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audit checklist</CardTitle>
            <CardDescription>Checklist items and completion status.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {audit.checklist.map((item) => (
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3" key={item.id}>
                <div>
                  <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                  <p className="text-xs text-slate-500">Owner: {item.owner}</p>
                </div>
                <Badge variant={item.status === "Complete" ? "success" : "outline"}>{item.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Findings tracking</CardTitle>
            <CardDescription>Document findings, severity, and closure status.</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleTable
              headers={["Finding", "Severity", "Owner", "Due date", "Status"]}
              rows={audit.findings.map((finding) => [
                <div key={finding.id} className="space-y-1">
                  <p className="font-semibold text-slate-950">{finding.title}</p>
                  <p className="text-xs text-slate-500">{finding.id}</p>
                </div>,
                <Badge key={`${finding.id}-severity`} variant={getSeverityVariant(finding.severity)}>
                  {finding.severity}
                </Badge>,
                finding.owner,
                formatDate(finding.dueDate),
                <Badge key={`${finding.id}-status`} variant={finding.status === "Closed" ? "success" : finding.status === "In Progress" ? "warning" : "outline"}>
                  {finding.status}
                </Badge>,
              ])}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Corrective actions</CardTitle>
            <CardDescription>Track corrective actions tied to audit findings.</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleTable
              headers={["Action", "Owner", "Due date", "Status", "Finding"]}
              rows={audit.correctiveActions.map((action) => [
                <div key={action.id} className="space-y-1">
                  <p className="font-semibold text-slate-950">{action.title}</p>
                  <p className="text-xs text-slate-500">{action.id}</p>
                </div>,
                action.owner,
                formatDate(action.dueDate),
                <Badge key={`${action.id}-status`} variant={getActionVariant(action.status)}>
                  {action.status}
                </Badge>,
                <span key={`${action.id}-finding`} className="text-sm text-slate-600">{action.findingId ?? "Not linked"}</span>,
              ])}
            />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
