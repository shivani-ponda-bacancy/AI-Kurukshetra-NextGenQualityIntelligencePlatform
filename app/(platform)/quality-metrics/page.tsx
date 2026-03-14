import { QualityMetricsChart } from "@/components/charts/quality-metrics-chart";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getQualityMetricCards, getQualityMetrics } from "@/services/metrics";
import { formatPercent } from "@/utils/format";

export default async function QualityMetricsPage() {
  const [cards, series] = await Promise.all([getQualityMetricCards(), getQualityMetrics()]);

  return (
    <div className="space-y-6">
      <PageHeader
        description="A dedicated metrics cockpit combining server-rendered KPI cards with TanStack Query client refresh for trend charts."
        eyebrow="Quality metrics"
        title="Measure leading and lagging indicators"
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((metric) => (
          <StatCard key={metric.title} metric={metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <QualityMetricsChart />
        <Card>
          <CardHeader>
            <CardTitle>Current month readout</CardTitle>
            <CardDescription>Quick benchmark on the most recent performance period.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {series.slice(-3).map((point) => (
              <div className="surface-muted grid grid-cols-3 gap-4 p-4" key={point.period}>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Period</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">{point.period}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Closure</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">{formatPercent(point.closureRate)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Supplier score</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">{point.supplierScore}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
