import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { SimpleTable } from "@/components/shared/simple-table";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getNonConformanceIssues, getNonConformanceMetrics } from "@/services/non-conformance";
import { cn } from "@/utils/cn";
import { formatDate } from "@/utils/format";

const playbookSteps = [
  {
    title: "Report and contain",
    description: "Log the deviation, quarantine impacted material, and alert operations immediately.",
  },
  {
    title: "Assign investigation owner",
    description: "Set accountable owners and document the root cause analysis approach.",
  },
  {
    title: "Close with verification",
    description: "Track corrective actions, verify effectiveness, and capture closure rationale.",
  },
];

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

export default async function NonConformancePage({
  searchParams,
}: {
  searchParams: { filter?: string };
}) {
  const [metrics, records] = await Promise.all([getNonConformanceMetrics(), getNonConformanceIssues()]);
  const filter = searchParams.filter;
  const openRecords = records.filter((record) => record.status !== "Closed");
  const closedRecords = records.filter((record) => record.status === "Closed");
  const highSeverityRecords = records.filter((record) => record.severity === "High");
  const activeFilter = filter === "open" || filter === "closed" || filter === "high" ? filter : "all";
  const filteredRecords =
    activeFilter === "open" ? openRecords : activeFilter === "closed" ? closedRecords : activeFilter === "high" ? highSeverityRecords : records;

  const filterOptions = [
    { key: "all", label: `All (${records.length})`, href: "/non-conformance" },
    { key: "open", label: `Open (${openRecords.length})`, href: "/non-conformance?filter=open" },
    { key: "closed", label: `Closed (${closedRecords.length})`, href: "/non-conformance?filter=closed" },
    { key: "high", label: `High severity (${highSeverityRecords.length})`, href: "/non-conformance?filter=high" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <Link className={buttonStyles()} href="/non-conformance/new">
            Report issue
          </Link>
        }
        description="Capture quality issues, assign owners, track severity, and close with verified resolution steps."
        eyebrow="Non-conformance management"
        title="Triage and resolve quality issues"
      />

      <section className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <StatCard key={metric.title} metric={metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Non-conformance log</CardTitle>
            <CardDescription>Filter by status or severity to focus the team on critical issues.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {filterOptions.map((option) => (
                <Link
                  className={cn(
                    buttonStyles(activeFilter === option.key ? "primary" : "secondary"),
                    "h-9 px-3 text-xs",
                  )}
                  href={option.href}
                  key={option.key}
                >
                  {option.label}
                </Link>
              ))}
            </div>
            {filteredRecords.length ? (
              <SimpleTable
                headers={["Issue", "Severity", "Assigned to", "Due date", "Status"]}
                rows={filteredRecords.map((record) => [
                  <div key={`${record.id}-issue`} className="space-y-1">
                    <Link className="font-semibold text-slate-950 hover:text-sky-700" href={`/non-conformance/${record.id}`}>
                      {record.title}
                    </Link>
                    <p className="text-xs text-slate-500">{record.id} - {record.source}</p>
                  </div>,
                  <Badge key={`${record.id}-severity`} variant={getSeverityVariant(record.severity)}>
                    {record.severity}
                  </Badge>,
                  record.assignedTo,
                  formatDate(record.dueDate),
                  <Badge key={`${record.id}-status`} variant={getStatusVariant(record.status)}>
                    {record.status}
                  </Badge>,
                ])}
              />
            ) : (
              <EmptyState
                description="No non-conformances match this filter yet. Try another filter or report a new issue."
                title="No results"
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response playbook</CardTitle>
            <CardDescription>Guide the investigation and closure workflow for every issue.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {playbookSteps.map((step, index) => (
              <div className="surface-muted space-y-2 p-4" key={step.title}>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Step {index + 1}</p>
                <p className="text-base font-semibold text-slate-950">{step.title}</p>
                <p className="text-sm text-slate-600">{step.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
