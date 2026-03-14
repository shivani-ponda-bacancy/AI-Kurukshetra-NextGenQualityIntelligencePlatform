"use client";

import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

import { useQualityMetrics } from "@/hooks/use-quality-metrics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

export function QualityMetricsChart() {
  const { data = [] } = useQualityMetrics();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quality metrics trend</CardTitle>
        <CardDescription>Monitor defect rate, closure performance, and supplier health from a single analytics surface.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[320px]">
          <Line
            data={{
              labels: data.map((entry) => entry.period),
              datasets: [
                {
                  label: "Closure rate",
                  data: data.map((entry) => entry.closureRate),
                  borderColor: "#0284c7",
                  backgroundColor: "rgba(2, 132, 199, 0.12)",
                  fill: true,
                  tension: 0.35,
                },
                {
                  label: "Supplier score",
                  data: data.map((entry) => entry.supplierScore),
                  borderColor: "#f97316",
                  backgroundColor: "rgba(249, 115, 22, 0.1)",
                  fill: false,
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
                  suggestedMin: 50,
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
