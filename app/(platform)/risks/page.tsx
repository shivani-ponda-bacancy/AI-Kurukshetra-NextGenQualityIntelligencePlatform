import { createRiskAction } from "@/app/actions/qms";
import { PageHeader } from "@/components/shared/page-header";
import { QuickActionForm } from "@/components/shared/quick-action-form";
import { SimpleTable } from "@/components/shared/simple-table";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getRiskMetrics, getRisks } from "@/services/risks";

export default async function RisksPage() {
  const [metrics, records] = await Promise.all([getRiskMetrics(), getRisks()]);

  return (
    <div className="space-y-6">
      <PageHeader
        description="Maintain a live risk register spanning suppliers, operations, documentation, and compliance readiness."
        eyebrow="Risk management"
        title="Surface and mitigate operational risk"
      />

      <section className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <StatCard key={metric.title} metric={metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Risk register</CardTitle>
            <CardDescription>Track severity and mitigation status with direct accountability on each risk item.</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleTable
              headers={["Risk", "Owner", "Rating", "Mitigation"]}
              rows={records.map((record) => [
                <div key={`${record.id}-title`}>
                  <p className="font-semibold text-slate-950">{record.title}</p>
                  <p className="text-xs text-slate-500">{record.id}</p>
                </div>,
                record.owner,
                <Badge key={`${record.id}-rating`} variant={record.rating === "Critical" ? "danger" : record.rating === "High" ? "warning" : "outline"}>
                  {record.rating}
                </Badge>,
                record.mitigationStatus,
              ])}
            />
          </CardContent>
        </Card>
        <QuickActionForm
          action={createRiskAction}
          description="Register new risks with Zod validation and a server-side persistence pattern."
          fields={[
            { label: "Title", name: "title" },
            { label: "Owner", name: "owner" },
            { label: "Rating", name: "rating", options: ["Low", "Medium", "High", "Critical"] },
            { label: "Mitigation status", name: "mitigationStatus", options: ["Planned", "Active", "Monitoring"] },
          ]}
          submitLabel="Register risk"
          title="Add risk"
        />
      </section>
    </div>
  );
}
