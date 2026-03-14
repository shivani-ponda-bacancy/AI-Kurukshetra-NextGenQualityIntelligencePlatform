import type { MetricCard, NonConformanceIssue } from "@/types/qms";

const nonConformanceIssues: NonConformanceIssue[] = [
  {
    id: "NC-410",
    title: "Leak test failure at Line 3",
    description: "Three consecutive units failed helium leak test during final assembly.",
    source: "In-process inspection",
    location: "Line 3 - Assembly",
    reportedBy: "M. Rao",
    reportedOn: "2026-03-10",
    assignedTo: "A. Chen",
    severity: "High",
    status: "Investigating",
    dueDate: "2026-03-20",
    containment: "Quarantined lot L3-240310, halted Line 3, notified production supervisor.",
    rootCause: "Under review: suspected torque variation on seal fixture.",
    investigationNotes: [
      { id: "NC-410-N1", author: "A. Chen", createdAt: "2026-03-11", note: "Started tear-down analysis and collected torque data for last two shifts." },
      { id: "NC-410-N2", author: "M. Rao", createdAt: "2026-03-12", note: "Maintenance verified fixture calibration; no drift noted." },
    ],
    resolutionPlan: [
      { id: "NC-410-R1", title: "Contain and segregate affected units", owner: "A. Chen", dueDate: "2026-03-12", status: "Complete" },
      { id: "NC-410-R2", title: "Root cause analysis and corrective action plan", owner: "Quality Eng", dueDate: "2026-03-18", status: "In Progress" },
      { id: "NC-410-R3", title: "Effectiveness verification on new builds", owner: "Validation", dueDate: "2026-03-22", status: "Not Started" },
    ],
  },
  {
    id: "NC-402",
    title: "Packaging label misprint on batch 24-0312",
    description: "Primary label lot code missing digit; 120 units affected.",
    source: "Final inspection",
    location: "Packaging",
    reportedBy: "K. Patel",
    reportedOn: "2026-03-12",
    assignedTo: "S. Mehta",
    severity: "Medium",
    status: "Open",
    dueDate: "2026-03-18",
    containment: "Stopped shipment, held pallets in QA cage pending relabeling.",
    investigationNotes: [
      { id: "NC-402-N1", author: "K. Patel", createdAt: "2026-03-12", note: "Misprint traced to label template revision from March 8." },
    ],
    resolutionPlan: [
      { id: "NC-402-R1", title: "Relabel affected units", owner: "Packaging Team", dueDate: "2026-03-16", status: "In Progress" },
      { id: "NC-402-R2", title: "Update label template control", owner: "Doc Control", dueDate: "2026-03-18", status: "Not Started" },
    ],
  },
  {
    id: "NC-389",
    title: "Supplier COA mismatch for resin lot",
    description: "Incoming COA values did not match internal verification for viscosity range.",
    source: "Incoming inspection",
    location: "Warehouse",
    reportedBy: "J. Owens",
    reportedOn: "2026-02-25",
    assignedTo: "J. Owens",
    severity: "High",
    status: "Closed",
    dueDate: "2026-03-05",
    containment: "Placed supplier lot on hold and initiated supplier notification.",
    resolutionSummary: "Supplier issued corrected COA; material accepted after retest. Supplier added to enhanced monitoring for 3 lots.",
    closureDate: "2026-03-04",
    investigationNotes: [
      { id: "NC-389-N1", author: "J. Owens", createdAt: "2026-02-26", note: "Retest confirmed viscosity outside COA tolerance." },
      { id: "NC-389-N2", author: "Supplier QA", createdAt: "2026-02-28", note: "Recalculated COA; lab equipment calibration error identified." },
    ],
    resolutionPlan: [
      { id: "NC-389-R1", title: "Supplier containment and retest", owner: "Supplier QA", dueDate: "2026-02-28", status: "Complete" },
      { id: "NC-389-R2", title: "Approve material disposition", owner: "Quality Manager", dueDate: "2026-03-02", status: "Complete" },
      { id: "NC-389-R3", title: "Monitor next 3 lots", owner: "Supplier Quality", dueDate: "2026-03-20", status: "In Progress" },
    ],
  },
  {
    id: "NC-375",
    title: "Calibration sticker missing on scale",
    description: "One production scale missing current calibration sticker during audit walk-through.",
    source: "Internal audit",
    location: "Weighing room",
    reportedBy: "L. Nguyen",
    reportedOn: "2026-02-18",
    assignedTo: "T. Grant",
    severity: "Low",
    status: "Closed",
    dueDate: "2026-02-24",
    containment: "Removed scale from service until calibration verified.",
    resolutionSummary: "Calibration verified; new visual management checklist added to daily startup.",
    closureDate: "2026-02-22",
    investigationNotes: [
      { id: "NC-375-N1", author: "T. Grant", createdAt: "2026-02-19", note: "Calibration certificate valid; sticker removed during cleaning." },
    ],
    resolutionPlan: [
      { id: "NC-375-R1", title: "Re-apply calibration label", owner: "Metrology", dueDate: "2026-02-19", status: "Complete" },
      { id: "NC-375-R2", title: "Update cleaning checklist", owner: "Production Lead", dueDate: "2026-02-23", status: "Complete" },
    ],
  },
];

function daysBetween(start: string, end: string) {
  const startDate = new Date(start).getTime();
  const endDate = new Date(end).getTime();
  return Math.max(0, Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)));
}

function buildMetrics(records: NonConformanceIssue[]): MetricCard[] {
  const openCount = records.filter((record) => record.status !== "Closed").length;
  const highSeverityCount = records.filter((record) => record.severity === "High").length;
  const closedRecords = records.filter((record) => record.status === "Closed" && record.closureDate);
  const averageClosureDays = closedRecords.length
    ? Math.round(
        closedRecords.reduce((total, record) => total + daysBetween(record.reportedOn, record.closureDate ?? record.reportedOn), 0) / closedRecords.length,
      )
    : 0;

  return [
    { title: "Open issues", value: `${openCount}`, trend: `${highSeverityCount} high severity`, tone: openCount > 0 ? "warning" : "success" },
    { title: "High severity", value: `${highSeverityCount}`, trend: highSeverityCount > 0 ? "Immediate containment" : "No criticals", tone: highSeverityCount > 0 ? "danger" : "success" },
    { title: "Avg closure time", value: closedRecords.length ? `${averageClosureDays} days` : "N/A", trend: `${closedRecords.length} closed`, tone: closedRecords.length ? "success" : "default" },
  ];
}

export async function getNonConformanceIssues() {
  return nonConformanceIssues;
}

export async function getNonConformanceMetrics() {
  return buildMetrics(nonConformanceIssues);
}

export async function getNonConformanceIssueById(id: string) {
  return nonConformanceIssues.find((record) => record.id === id) ?? null;
}
