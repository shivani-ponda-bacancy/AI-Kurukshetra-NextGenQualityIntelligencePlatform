import { createNonConformanceAction } from "@/app/actions/qms";
import { PageHeader } from "@/components/shared/page-header";
import { QuickActionForm } from "@/components/shared/quick-action-form";
import { SimpleTable } from "@/components/shared/simple-table";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getNonConformanceMetrics, getNonConformances } from "@/services/non-conformances";
import { formatDate } from "@/utils/format";

export default async function NonConformancesPage() {
  const [metrics, records] = await Promise.all([getNonConformanceMetrics(), getNonConformances()]);

  return (
    <div className="space-y-6">
      <PageHeader
        description="Capture deviations, enforce containment, and maintain evidence trails for investigations and closure checks."
        eyebrow="Non-conformance management"
        title="Drive timely containment and investigation"
      />

      <section className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <StatCard key={metric.title} metric={metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Active non-conformances</CardTitle>
            <CardDescription>Focus the team on severity, response ownership, and due-date discipline.</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleTable
              headers={["Issue", "Severity", "Owner", "Due date", "Status"]}
              rows={records.map((record) => [
                <div key={`${record.id}-title`}>
                  <p className="font-semibold text-slate-950">{record.title}</p>
                  <p className="text-xs text-slate-500">{record.id}</p>
                </div>,
                <Badge key={`${record.id}-severity`} variant={record.severity === "Critical" ? "danger" : record.severity === "Major" ? "warning" : "outline"}>
                  {record.severity}
                </Badge>,
                record.owner,
                formatDate(record.dueDate),
                <Badge key={`${record.id}-status`} variant={record.status === "Closed" ? "success" : record.status === "Investigating" ? "warning" : "outline"}>
                  {record.status}
                </Badge>,
              ])}
            />
          </CardContent>
        </Card>
        <QuickActionForm
          action={createNonConformanceAction}
          description="Raise a new event with Zod-validated data. Supabase persistence is handled by a server action."
          fields={[
            { label: "Title", name: "title" },
            { label: "Severity", name: "severity", options: ["Minor", "Major", "Critical"] },
            { label: "Owner", name: "owner" },
            { label: "Due date", name: "dueDate", type: "date" },
            { label: "Status", name: "status", options: ["Open", "Investigating", "Closed"] },
          ]}
          submitLabel="Log non-conformance"
          title="Report event"
        />
      </section>
    </div>
  );
}
