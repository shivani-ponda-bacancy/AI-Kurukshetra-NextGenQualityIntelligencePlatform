"use client";

import { CategoryScale, Chart as ChartJS, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip } from "chart.js";
import { Line } from "react-chartjs-2";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

type ChartPoint = {
  period: string;
  value: number;
};

export function SupplierQualityChart({ data }: { data: ChartPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Supplier quality score</CardTitle>
        <CardDescription>Average supplier quality score across recent periods.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <Line
            data={{
              labels: data.map((point) => point.period),
              datasets: [
                {
                  label: "Quality score",
                  data: data.map((point) => point.value),
                  borderColor: "#f97316",
                  backgroundColor: "rgba(249, 115, 22, 0.12)",
                  fill: true,
                  tension: 0.35,
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "bottom",
                },
              },
              scales: {
                y: {
                  beginAtZero: false,
                  suggestedMin: 60,
                  suggestedMax: 100,
                },
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
