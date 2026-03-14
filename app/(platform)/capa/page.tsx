import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";
import { SimpleTable } from "@/components/shared/simple-table";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCapaCases, getCapaMetrics } from "@/services/capa";
import { formatDate } from "@/utils/format";

function getStatusVariant(status: string) {
  if (status === "Closed") return "success";
  if (status === "Effectiveness Check") return "warning";
  if (status === "In Progress") return "warning";
  return "outline";
}

function getEffectivenessVariant(status: string) {
  if (status === "Verified") return "success";
  if (status === "In Progress") return "warning";
  return "outline";
}

export default async function CapaPage() {
  const [metrics, records] = await Promise.all([getCapaMetrics(), getCapaCases()]);
  const upcomingTasks = records
    .flatMap((record) => record.tasks)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <Link className={buttonStyles()} href="/capa/new">
            New CAPA
          </Link>
        }
        description="Link non-conformances to root cause analysis, corrective and preventive actions, and effectiveness checks."
        eyebrow="CAPA management"
        title="Drive corrective and preventive actions"
      />

      <section className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <StatCard key={metric.title} metric={metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>CAPA register</CardTitle>
            <CardDescription>Track ownership, due dates, and effectiveness verification for each case.</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleTable
              headers={["CAPA", "Linked non-conformance", "Owner", "Due date", "Status", "Effectiveness"]}
              rows={records.map((record) => [
                <div key={`${record.id}-title`} className="space-y-1">
                  <Link className="font-semibold text-slate-950 hover:text-sky-700" href={`/capa/${record.id}`}>
                    {record.title}
                  </Link>
                  <p className="text-xs text-slate-500">{record.id}</p>
                </div>,
                record.nonConformanceId ? (
                  <Link className="text-sm font-medium text-sky-700 hover:text-sky-800" href={`/non-conformance/${record.nonConformanceId}`}>
                    {record.nonConformanceId}
                  </Link>
                ) : (
                  <span className="text-sm text-slate-500">Not linked</span>
                ),
                record.owner,
                formatDate(record.dueDate),
                <Badge key={`${record.id}-status`} variant={getStatusVariant(record.status)}>
                  {record.status}
                </Badge>,
                <Badge key={`${record.id}-effectiveness`} variant={getEffectivenessVariant(record.effectivenessStatus)}>
                  {record.effectivenessStatus}
                </Badge>,
              ])}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming tasks</CardTitle>
            <CardDescription>Next actions across corrective and preventive plans.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTasks.map((task) => (
              <div className="surface-muted space-y-2 p-4" key={task.id}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-950">{task.title}</p>
                  <Badge variant={task.status === "Complete" ? "success" : task.status === "In Progress" ? "warning" : "outline"}>
                    {task.status}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500">{task.type} action</p>
                <p className="text-sm text-slate-600">Owner: {task.owner}</p>
                <p className="text-sm text-slate-600">Due: {formatDate(task.dueDate)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
