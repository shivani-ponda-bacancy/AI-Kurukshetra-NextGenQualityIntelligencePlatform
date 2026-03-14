import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getNonConformanceIssueById } from "@/services/non-conformance";
import { formatDate } from "@/utils/format";

function getSeverityVariant(severity: string) {
  if (severity === "High") return "danger";
  if (severity === "Medium") return "warning";
  return "outline";
}

function getStatusVariant(status: string) {
  if (status === "Closed") return "success";
  if (status === "Investigating") return "warning";
  return "outline";
}

function getResolutionVariant(status: string) {
  if (status === "Complete") return "success";
  if (status === "In Progress") return "warning";
  return "outline";
}

export default async function NonConformanceDetailPage({ params }: { params: { id: string } }) {
  const issue = await getNonConformanceIssueById(params.id);

  if (!issue) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={getSeverityVariant(issue.severity)}>{issue.severity} severity</Badge>
            <Badge variant={getStatusVariant(issue.status)}>{issue.status}</Badge>
            <Link className={buttonStyles("secondary")} href="/non-conformance">
              Back to log
            </Link>
          </div>
        }
        description={issue.description}
        eyebrow="Non-conformance case"
        title={issue.title}
      />

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Issue details</CardTitle>
            <CardDescription>Report context, assignment, and containment summary.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Reported by</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{issue.reportedBy}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Reported on</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{formatDate(issue.reportedOn)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Assigned to</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{issue.assignedTo}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Due date</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{formatDate(issue.dueDate)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Source</p>
              <p className="mt-2 text-sm font-medium text-slate-700">{issue.source}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Location</p>
              <p className="mt-2 text-sm font-medium text-slate-700">{issue.location}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Containment</p>
              <p className="mt-2 text-sm text-slate-600">{issue.containment}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Root cause</p>
              <p className="mt-2 text-sm text-slate-600">{issue.rootCause ?? "In progress"}</p>
            </div>
            {issue.closureDate ? (
              <div className="sm:col-span-2">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Closure date</p>
                <p className="mt-2 text-sm text-slate-600">{formatDate(issue.closureDate)}</p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Investigation notes</CardTitle>
            <CardDescription>Chronological updates from the investigation owner.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {issue.investigationNotes.length ? (
              issue.investigationNotes.map((note) => (
                <div className="surface-muted space-y-2 p-4" key={note.id}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-950">{note.author}</p>
                    <p className="text-xs text-slate-500">{formatDate(note.createdAt)}</p>
                  </div>
                  <p className="text-sm text-slate-600">{note.note}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No investigation notes captured yet.</p>
            )}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Resolution tracking</CardTitle>
          <CardDescription>Track containment, corrective actions, and effectiveness verification.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {issue.resolutionPlan.map((step) => (
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/70 bg-white/80 p-4 md:flex-row md:items-center md:justify-between" key={step.id}>
                <div>
                  <p className="font-semibold text-slate-950">{step.title}</p>
                  <p className="text-sm text-slate-500">{step.owner}  Due {formatDate(step.dueDate)}</p>
                </div>
                <Badge variant={getResolutionVariant(step.status)}>{step.status}</Badge>
              </div>
            ))}
          </div>
          {issue.resolutionSummary ? (
            <div className="surface-muted space-y-2 p-4">
              <p className="text-sm font-semibold text-slate-950">Resolution summary</p>
              <p className="text-sm text-slate-600">{issue.resolutionSummary}</p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
