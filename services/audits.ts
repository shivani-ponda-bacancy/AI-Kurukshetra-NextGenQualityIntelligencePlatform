import type { AuditReport, MetricCard } from "@/types/qms";

const auditReports: AuditReport[] = [
  {
    id: "AUD-104",
    title: "Internal GMP compliance audit",
    description: "Evaluate GMP adherence across assembly, packaging, and batch record review.",
    leadAuditor: "E. Knight",
    scheduledFor: "2026-03-28",
    status: "Planned",
    location: "Plant 2 - Assembly and Packaging",
    scope: "Assembly, packaging, batch record review",
    auditType: "Internal",
    checklist: [
      { id: "AUD-104-C1", title: "Training records current", owner: "QA", status: "Open" },
      { id: "AUD-104-C2", title: "Line clearance log complete", owner: "Production", status: "Open" },
      { id: "AUD-104-C3", title: "Calibration status verified", owner: "Metrology", status: "Open" },
    ],
    findings: [
      {
        id: "AUD-104-F1",
        title: "Line clearance log missing signature",
        description: "One batch record missing line clearance sign off for shift B.",
        severity: "Major",
        status: "Open",
        owner: "Production Lead",
        dueDate: "2026-04-05",
        correctiveActionIds: ["AUD-104-A1"],
      },
      {
        id: "AUD-104-F2",
        title: "Training matrix not updated",
        description: "New operator training entries not reflected in the master matrix.",
        severity: "Minor",
        status: "Open",
        owner: "Training Coordinator",
        dueDate: "2026-04-02",
        correctiveActionIds: ["AUD-104-A2"],
      },
    ],
    correctiveActions: [
      {
        id: "AUD-104-A1",
        title: "Update line clearance SOP and retrain operators",
        owner: "Doc Control",
        dueDate: "2026-04-08",
        status: "In Progress",
        findingId: "AUD-104-F1",
      },
      {
        id: "AUD-104-A2",
        title: "Refresh training matrix and add review reminder",
        owner: "Training Coordinator",
        dueDate: "2026-04-06",
        status: "Planned",
        findingId: "AUD-104-F2",
      },
    ],
    preparedBy: "E. Knight",
    preparedOn: "2026-03-29",
  },
  {
    id: "AUD-99",
    title: "Supplier surveillance audit",
    description: "Assess supplier adherence to incoming inspection and COA requirements.",
    leadAuditor: "B. Thomas",
    scheduledFor: "2026-03-26",
    status: "In Progress",
    location: "Supplier site - Apex Polymers",
    scope: "Incoming inspection, COA review, storage controls",
    auditType: "Supplier",
    checklist: [
      { id: "AUD-99-C1", title: "COA alignment verified", owner: "Supplier QA", status: "Complete" },
      { id: "AUD-99-C2", title: "Storage conditions logged", owner: "Supplier QA", status: "Open" },
      { id: "AUD-99-C3", title: "Inspection sampling plan current", owner: "Supplier QA", status: "Open" },
    ],
    findings: [
      {
        id: "AUD-99-F1",
        title: "COA retention gap",
        description: "Two COA records missing from Q1 archive binder.",
        severity: "Major",
        status: "In Progress",
        owner: "Supplier QA",
        dueDate: "2026-04-01",
        correctiveActionIds: ["AUD-99-A1"],
      },
    ],
    correctiveActions: [
      {
        id: "AUD-99-A1",
        title: "Backfill COA archive and update retention checklist",
        owner: "Supplier QA",
        dueDate: "2026-04-04",
        status: "In Progress",
        findingId: "AUD-99-F1",
      },
    ],
    preparedBy: "B. Thomas",
    preparedOn: "2026-03-27",
  },
  {
    id: "AUD-92",
    title: "ISO 13485 readiness",
    description: "Validate audit readiness for ISO 13485 surveillance visit.",
    leadAuditor: "N. Singh",
    scheduledFor: "2026-02-27",
    status: "Completed",
    location: "HQ - Quality Conference Room",
    scope: "Document control, CAPA, training compliance",
    auditType: "Internal",
    checklist: [
      { id: "AUD-92-C1", title: "Document control checks", owner: "Quality Manager", status: "Complete" },
      { id: "AUD-92-C2", title: "CAPA effectiveness review", owner: "Quality Manager", status: "Complete" },
      { id: "AUD-92-C3", title: "Training compliance checks", owner: "Quality Manager", status: "Complete" },
    ],
    findings: [
      {
        id: "AUD-92-F1",
        title: "CAPA effectiveness evidence missing",
        description: "One CAPA lacked effectiveness verification evidence packet.",
        severity: "Minor",
        status: "Closed",
        owner: "Quality Manager",
        dueDate: "2026-03-05",
        correctiveActionIds: ["AUD-92-A1"],
      },
    ],
    correctiveActions: [
      {
        id: "AUD-92-A1",
        title: "Attach effectiveness evidence to CAPA file",
        owner: "Quality Manager",
        dueDate: "2026-03-03",
        status: "Complete",
        findingId: "AUD-92-F1",
      },
    ],
    preparedBy: "N. Singh",
    preparedOn: "2026-03-01",
  },
];

function buildMetrics(records: AuditReport[]): MetricCard[] {
  const scheduledCount = records.filter((record) => record.status !== "Completed").length;
  const findings = records.flatMap((record) => record.findings);
  const closedFindings = findings.filter((finding) => finding.status === "Closed").length;
  const closedRate = findings.length ? Math.round((closedFindings / findings.length) * 100) : 0;
  const readiness = closedRate >= 85 ? "High" : closedRate >= 70 ? "Moderate" : "At risk";

  return [
    { title: "Scheduled audits", value: `${scheduledCount}`, trend: `${records.length} total`, tone: scheduledCount > 0 ? "default" : "success" },
    { title: "Findings closed", value: `${closedRate}%`, trend: `${closedFindings} closed`, tone: closedRate >= 85 ? "success" : closedRate >= 70 ? "warning" : "danger" },
    { title: "Audit readiness", value: readiness, trend: closedRate >= 85 ? "On track" : "Needs attention", tone: closedRate >= 85 ? "success" : closedRate >= 70 ? "warning" : "danger" },
  ];
}

export async function getAudits() {
  return auditReports;
}

export async function getAuditMetrics() {
  return buildMetrics(auditReports);
}

export async function getAuditReportById(id: string) {
  return auditReports.find((record) => record.id === id) ?? null;
}
