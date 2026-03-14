import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { MetricCard } from "@/types/qms";

const trendIcons = {
  default: Minus,
  success: ArrowUpRight,
  warning: Minus,
  danger: ArrowDownRight,
};

export function StatCard({ metric }: { metric: MetricCard }) {
  const tone = metric.tone ?? "default";
  const Icon = trendIcons[tone];

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">{metric.title}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{metric.value}</p>
          </div>
          <Badge variant={tone === "default" ? "outline" : tone}>
            <Icon className="mr-1 h-3.5 w-3.5" />
            {metric.trend}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
