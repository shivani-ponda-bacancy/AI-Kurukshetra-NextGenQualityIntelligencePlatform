"use client";

import { CategoryScale, Chart as ChartJS, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip } from "chart.js";
import { Line } from "react-chartjs-2";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

type ChartPoint = {
  period: string;
  value: number;
};

export function CapaResolutionChart({ data }: { data: ChartPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>CAPA resolution time</CardTitle>
        <CardDescription>Average days to close CAPA records.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <Line
            data={{
              labels: data.map((point) => point.period),
              datasets: [
                {
                  label: "Resolution days",
                  data: data.map((point) => point.value),
                  borderColor: "#0ea5e9",
                  backgroundColor: "rgba(14, 165, 233, 0.12)",
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
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
