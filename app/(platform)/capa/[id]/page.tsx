import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCapaCaseById } from "@/services/capa";
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

function getTaskVariant(status: string) {
  if (status === "Complete") return "success";
  if (status === "In Progress") return "warning";
  return "outline";
}

export default async function CapaDetailPage({ params }: { params: { id: string } }) {
  const record = await getCapaCaseById(params.id);

  if (!record) {
    notFound();
  }

  const correctiveTasks = record.tasks.filter((task) => task.type === "Corrective");
  const preventiveTasks = record.tasks.filter((task) => task.type === "Preventive");

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={getStatusVariant(record.status)}>{record.status}</Badge>
            <Badge variant={getEffectivenessVariant(record.effectivenessStatus)}>{record.effectivenessStatus}</Badge>
            <Link className={buttonStyles("secondary")} href="/capa">
              Back to CAPA
            </Link>
          </div>
        }
        description={record.description}
        eyebrow="CAPA case"
        title={record.title}
      />

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Case summary</CardTitle>
            <CardDescription>Ownership, link to non-conformance, and due dates.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Owner</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{record.owner}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Opened on</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{formatDate(record.openedOn)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Due date</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{formatDate(record.dueDate)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Linked non-conformance</p>
              {record.nonConformanceId ? (
                <Link className="mt-2 inline-flex text-sm font-semibold text-sky-700 hover:text-sky-800" href={`/non-conformance/${record.nonConformanceId}`}>
                  {record.nonConformanceId}
                </Link>
              ) : (
                <p className="mt-2 text-sm text-slate-500">Not linked</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Root cause analysis</p>
              <p className="mt-2 text-sm text-slate-600">{record.rootCauseAnalysis}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Effectiveness verification</CardTitle>
            <CardDescription>Verification plan, owner, and due date.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Plan</p>
              <p className="mt-2 text-sm text-slate-600">{record.effectivenessPlan}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Owner</p>
              <p className="mt-2 text-sm font-semibold text-slate-950">{record.effectivenessOwner}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Due date</p>
              <p className="mt-2 text-sm text-slate-600">{formatDate(record.effectivenessDueDate)}</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Corrective actions</CardTitle>
            <CardDescription>Tasks that address the immediate root cause.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">{record.correctiveActionPlan}</p>
            {correctiveTasks.map((task) => (
              <div className="flex flex-col gap-2 rounded-2xl border border-slate-200/70 bg-white/80 p-4" key={task.id}>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-slate-950">{task.title}</p>
                  <Badge variant={getTaskVariant(task.status)}>{task.status}</Badge>
                </div>
                <p className="text-sm text-slate-500">Owner: {task.owner}</p>
                <p className="text-sm text-slate-500">Due: {formatDate(task.dueDate)}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preventive actions</CardTitle>
            <CardDescription>Tasks that prevent recurrence.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">{record.preventiveActionPlan}</p>
            {preventiveTasks.map((task) => (
              <div className="flex flex-col gap-2 rounded-2xl border border-slate-200/70 bg-white/80 p-4" key={task.id}>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-slate-950">{task.title}</p>
                  <Badge variant={getTaskVariant(task.status)}>{task.status}</Badge>
                </div>
                <p className="text-sm text-slate-500">Owner: {task.owner}</p>
                <p className="text-sm text-slate-500">Due: {formatDate(task.dueDate)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
