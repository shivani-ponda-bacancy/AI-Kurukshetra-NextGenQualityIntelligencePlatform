import { createTrainingAction } from "@/app/actions/qms";
import { PageHeader } from "@/components/shared/page-header";
import { QuickActionForm } from "@/components/shared/quick-action-form";
import { SimpleTable } from "@/components/shared/simple-table";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTrainingMetrics, getTrainingRecords } from "@/services/training";
import { formatDate } from "@/utils/format";

export default async function TrainingPage() {
  const [metrics, records] = await Promise.all([getTrainingMetrics(), getTrainingRecords()]);

  return (
    <div className="space-y-6">
      <PageHeader
        description="Drive role-based training completion and curriculum compliance across operational teams."
        eyebrow="Training management"
        title="Keep competence current"
      />

      <section className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <StatCard key={metric.title} metric={metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Training matrix</CardTitle>
            <CardDescription>Monitor completion, due dates, and escalation risk for critical curricula.</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleTable
              headers={["Course", "Owner", "Completion", "Due date", "Status"]}
              rows={records.map((record) => [
                <div key={`${record.id}-title`}>
                  <p className="font-semibold text-slate-950">{record.course}</p>
                  <p className="text-xs text-slate-500">{record.id}</p>
                </div>,
                record.owner,
                `${record.completionRate}%`,
                formatDate(record.dueDate),
                <Badge key={`${record.id}-status`} variant={record.status === "Completed" ? "success" : record.status === "Overdue" ? "danger" : "outline"}>
                  {record.status}
                </Badge>,
              ])}
            />
          </CardContent>
        </Card>
        <QuickActionForm
          action={createTrainingAction}
          description="Assign a training item with server-side validation and a Supabase-ready insert action."
          fields={[
            { label: "Course", name: "course" },
            { label: "Owner", name: "owner" },
            { label: "Completion rate", name: "completionRate", type: "number" },
            { label: "Due date", name: "dueDate", type: "date" },
            { label: "Status", name: "status", options: ["On Track", "Overdue", "Completed"] },
          ]}
          submitLabel="Assign training"
          title="Create training task"
        />
      </section>
    </div>
  );
}
