import { createSupplierAction } from "@/app/actions/qms";
import { PageHeader } from "@/components/shared/page-header";
import { QuickActionForm } from "@/components/shared/quick-action-form";
import { SimpleTable } from "@/components/shared/simple-table";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSupplierMetrics, getSuppliers } from "@/services/suppliers";

export default async function SuppliersPage() {
  const [metrics, records] = await Promise.all([getSupplierMetrics(), getSuppliers()]);

  return (
    <div className="space-y-6">
      <PageHeader
        description="Track supplier quality performance, approval status, and contact ownership in one governed workspace."
        eyebrow="Supplier quality"
        title="Strengthen supplier oversight"
      />

      <section className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <StatCard key={metric.title} metric={metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Supplier register</CardTitle>
            <CardDescription>Keep supplier qualification and quality monitoring visible to procurement and quality teams.</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleTable
              headers={["Supplier", "Contact", "Score", "Status"]}
              rows={records.map((record) => [
                <div key={`${record.id}-title`}>
                  <p className="font-semibold text-slate-950">{record.name}</p>
                  <p className="text-xs text-slate-500">{record.id}</p>
                </div>,
                record.contact,
                `${record.score}/100`,
                <Badge key={`${record.id}-status`} variant={record.status === "Approved" ? "success" : record.status === "Conditional" ? "warning" : "outline"}>
                  {record.status}
                </Badge>,
              ])}
            />
          </CardContent>
        </Card>
        <QuickActionForm
          action={createSupplierAction}
          description="Add or qualify suppliers with a server action and RBAC-protected persistence layer."
          fields={[
            { label: "Supplier name", name: "name" },
            { label: "Contact email", name: "contact", type: "email" },
            { label: "Initial score", name: "score", type: "number" },
            { label: "Status", name: "status", options: ["Approved", "Conditional", "Under Review"] },
          ]}
          submitLabel="Add supplier"
          title="Onboard supplier"
        />
      </section>
    </div>
  );
}
