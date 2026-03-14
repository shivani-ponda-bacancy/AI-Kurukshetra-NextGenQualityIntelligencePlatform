import type { CapaCase, CapaResolutionPoint, CapaTask, MetricCard } from "@/types/qms";

const capaCases: CapaCase[] = [
  {
    id: "CAPA-210",
    title: "Seal torque variation - Line 3",
    description: "Address leak test failures tied to torque variation on seal fixture.",
    nonConformanceId: "NC-410",
    nonConformanceTitle: "Leak test failure at Line 3",
    owner: "A. Chen",
    openedOn: "2026-03-11",
    dueDate: "2026-03-25",
    status: "In Progress",
    rootCauseAnalysis: "Torque wrench calibration drift combined with inconsistent fixture setup across shifts.",
    correctiveActionPlan: "Recalibrate torque tools, standardize fixture setup, and retrain operators.",
    preventiveActionPlan: "Add weekly torque verification and fixture checklist in startup routine.",
    effectivenessPlan: "Verify leak test pass rate over 3 consecutive lots with audit sign-off.",
    effectivenessStatus: "In Progress",
    effectivenessOwner: "Quality Eng",
    effectivenessDueDate: "2026-03-30",
    tasks: [
      { id: "CAPA-210-T1", title: "Recalibrate torque tools", owner: "Metrology", dueDate: "2026-03-14", status: "Complete", type: "Corrective" },
      { id: "CAPA-210-T2", title: "Update fixture setup SOP", owner: "Doc Control", dueDate: "2026-03-18", status: "In Progress", type: "Corrective" },
      { id: "CAPA-210-T3", title: "Operator retraining", owner: "Production Lead", dueDate: "2026-03-20", status: "Not Started", type: "Corrective" },
      { id: "CAPA-210-T4", title: "Add weekly torque verification", owner: "Quality Eng", dueDate: "2026-03-22", status: "Not Started", type: "Preventive" },
    ],
  },
  {
    id: "CAPA-205",
    title: "Label template control improvement",
    description: "Prevent packaging label misprints by tightening template change control.",
    nonConformanceId: "NC-402",
    nonConformanceTitle: "Packaging label misprint on batch 24-0312",
    owner: "S. Mehta",
    openedOn: "2026-03-12",
    dueDate: "2026-03-21",
    status: "Open",
    rootCauseAnalysis: "Template revision bypassed document control review before deployment.",
    correctiveActionPlan: "Relabel affected units and lock template access to approved users.",
    preventiveActionPlan: "Add automated approval gate and change notification workflow.",
    effectivenessPlan: "Audit label print logs for 30 days with zero deviations.",
    effectivenessStatus: "Pending",
    effectivenessOwner: "Packaging QA",
    effectivenessDueDate: "2026-04-05",
    tasks: [
      { id: "CAPA-205-T1", title: "Relabel affected inventory", owner: "Packaging Team", dueDate: "2026-03-16", status: "In Progress", type: "Corrective" },
      { id: "CAPA-205-T2", title: "Lock template permissions", owner: "IT", dueDate: "2026-03-18", status: "Not Started", type: "Corrective" },
      { id: "CAPA-205-T3", title: "Configure approval workflow", owner: "Doc Control", dueDate: "2026-03-20", status: "Not Started", type: "Preventive" },
    ],
  },
  {
    id: "CAPA-198",
    title: "Supplier COA verification",
    description: "Strengthen incoming COA verification and supplier follow-up cadence.",
    nonConformanceId: "NC-389",
    nonConformanceTitle: "Supplier COA mismatch for resin lot",
    owner: "J. Owens",
    openedOn: "2026-02-26",
    dueDate: "2026-03-10",
    status: "Effectiveness Check",
    rootCauseAnalysis: "Supplier lab calibration issue and delayed escalation to supplier QA.",
    correctiveActionPlan: "Retest resin lots and update supplier escalation protocol.",
    preventiveActionPlan: "Implement dual verification for COA parameters on high risk materials.",
    effectivenessPlan: "Monitor next 3 supplier lots and confirm COA alignment.",
    effectivenessStatus: "Verified",
    effectivenessOwner: "Supplier Quality",
    effectivenessDueDate: "2026-03-20",
    tasks: [
      { id: "CAPA-198-T1", title: "Supplier retest and disposition", owner: "Supplier QA", dueDate: "2026-03-01", status: "Complete", type: "Corrective" },
      { id: "CAPA-198-T2", title: "Update escalation protocol", owner: "Quality Manager", dueDate: "2026-03-05", status: "Complete", type: "Preventive" },
      { id: "CAPA-198-T3", title: "Enhanced COA verification", owner: "Incoming QA", dueDate: "2026-03-15", status: "Complete", type: "Preventive" },
    ],
  },
];
const capaResolutionSeries: CapaResolutionPoint[] = [
  { period: "Oct", days: 22 },
  { period: "Nov", days: 20 },
  { period: "Dec", days: 18 },
  { period: "Jan", days: 16 },
  { period: "Feb", days: 15 },
  { period: "Mar", days: 14 },
];

function isTaskOverdue(task: CapaTask, today: Date) {
  if (task.status === "Complete") return false;
  return new Date(task.dueDate).getTime() < today.getTime();
}

function buildMetrics(records: CapaCase[]): MetricCard[] {
  const openCount = records.filter((record) => record.status !== "Closed").length;
  const tasks = records.flatMap((record) => record.tasks);
  const overdueTasks = tasks.filter((task) => isTaskOverdue(task, new Date())).length;
  const verifiedCount = records.filter((record) => record.effectivenessStatus === "Verified").length;
  const verificationRate = records.length ? Math.round((verifiedCount / records.length) * 100) : 0;

  return [
    { title: "Open CAPAs", value: `${openCount}`, trend: `${overdueTasks} overdue tasks`, tone: overdueTasks > 0 ? "warning" : "success" },
    { title: "Effectiveness verified", value: `${verificationRate}%`, trend: `${verifiedCount} verified`, tone: verificationRate >= 80 ? "success" : "warning" },
    { title: "Active task load", value: `${tasks.length}`, trend: "Corrective and preventive", tone: "default" },
  ];
}

export async function getCapaCases() {
  return capaCases;
}

export async function getCapas() {
  return capaCases;
}

export async function getCapaMetrics() {
  return buildMetrics(capaCases);
}

export async function getCapaCaseById(id: string) {
  return capaCases.find((record) => record.id === id) ?? null;
}

export async function getCapaResolutionSeries() {
  return capaResolutionSeries;
}
