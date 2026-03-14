"use client";

import { CategoryScale, Chart as ChartJS, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip } from "chart.js";
import { Line } from "react-chartjs-2";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

type ChartPoint = {
  period: string;
  value: number;
};

export function DefectTrendsChart({ data }: { data: ChartPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Defect trends</CardTitle>
        <CardDescription>Track defect rate movement across recent periods.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <Line
            data={{
              labels: data.map((point) => point.period),
              datasets: [
                {
                  label: "Defect rate",
                  data: data.map((point) => point.value),
                  borderColor: "#dc2626",
                  backgroundColor: "rgba(220, 38, 38, 0.12)",
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
                },
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
