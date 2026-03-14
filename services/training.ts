import type { MetricCard, TrainingRecord } from "@/types/qms";

const trainingRecords: TrainingRecord[] = [
  { id: "TRN-18", course: "Deviation handling refresh", completionRate: 96, dueDate: "2026-03-20", owner: "Operations", status: "On Track" },
  { id: "TRN-17", course: "Supplier audit fundamentals", completionRate: 72, dueDate: "2026-03-16", owner: "Procurement", status: "Overdue" },
  { id: "TRN-14", course: "Data integrity essentials", completionRate: 100, dueDate: "2026-03-08", owner: "Quality", status: "Completed" },
];

const trainingMetrics: MetricCard[] = [
  { title: "Training completion", value: "94%", trend: "+3 pts", tone: "success" },
  { title: "Overdue learners", value: "12", trend: "4 escalated", tone: "warning" },
  { title: "Curricula current", value: "98%", trend: "1 revision pending", tone: "default" },
];

export async function getTrainingRecords() {
  return trainingRecords;
}

export async function getTrainingMetrics() {
  return trainingMetrics;
}
