export interface MetricCard {
  title: string;
  value: string;
  trend: string;
  tone?: "default" | "success" | "warning" | "danger";
}

export interface DashboardOverview {
  metrics: MetricCard[];
  upcomingAudits: AuditRecord[];
  priorityRisks: RiskRecord[];
}

export type DocumentStatus = "Draft" | "Review" | "Approved";

export interface DocumentHistoryEntry {
  id: string;
  version: number;
  action: "Created" | "Uploaded" | "Submitted for review" | "Approved" | "Revision created";
  actor: string;
  notes: string;
  createdAt: string;
  fileUrl?: string;
  status: DocumentStatus;
}

export interface DocumentRecord {
  id: string;
  title: string;
  description: string;
  owner: string;
  ownerId?: string;
  status: DocumentStatus;
  version: number;
  category: string;
  fileUrl?: string;
  fileName?: string;
  createdAt: string;
  effectiveDate: string;
  currentApprover?: string;
  history: DocumentHistoryEntry[];
}

export interface NonConformanceRecord {
  id: string;
  title: string;
  severity: "Minor" | "Major" | "Critical";
  owner: string;
  dueDate: string;
  status: "Open" | "Investigating" | "Closed";
}

export type NonConformanceSeverity = "Low" | "Medium" | "High";
export type NonConformanceStatus = "Open" | "Investigating" | "Closed";
export type NonConformanceResolutionStatus = "Not Started" | "In Progress" | "Complete";

export interface NonConformanceNote {
  id: string;
  author: string;
  note: string;
  createdAt: string;
}

export interface NonConformanceResolutionStep {
  id: string;
  title: string;
  owner: string;
  dueDate: string;
  status: NonConformanceResolutionStatus;
}

export interface NonConformanceIssue {
  id: string;
  title: string;
  description: string;
  source: string;
  location: string;
  reportedBy: string;
  reportedOn: string;
  assignedTo: string;
  severity: NonConformanceSeverity;
  status: NonConformanceStatus;
  dueDate: string;
  containment: string;
  rootCause?: string;
  resolutionSummary?: string;
  closureDate?: string;
  investigationNotes: NonConformanceNote[];
  resolutionPlan: NonConformanceResolutionStep[];
}

export interface CapaRecord {
  id: string;
  title: string;
  owner: string;
  dueDate: string;
  status: "Planned" | "In Progress" | "Verified";
}

export type CapaStatus = "Open" | "In Progress" | "Effectiveness Check" | "Closed";
export type CapaTaskStatus = "Not Started" | "In Progress" | "Complete";
export type CapaTaskType = "Corrective" | "Preventive";
export type CapaEffectivenessStatus = "Pending" | "In Progress" | "Verified";

export interface CapaTask {
  id: string;
  title: string;
  owner: string;
  dueDate: string;
  status: CapaTaskStatus;
  type: CapaTaskType;
}

export interface CapaCase {
  id: string;
  title: string;
  description: string;
  nonConformanceId?: string;
  nonConformanceTitle?: string;
  owner: string;
  openedOn: string;
  dueDate: string;
  status: CapaStatus;
  rootCauseAnalysis: string;
  correctiveActionPlan: string;
  preventiveActionPlan: string;
  effectivenessPlan: string;
  effectivenessStatus: CapaEffectivenessStatus;
  effectivenessOwner: string;
  effectivenessDueDate: string;
  tasks: CapaTask[];
}

export interface CapaResolutionPoint {
  period: string;
  days: number;
}
export type AuditStatus = "Planned" | "In Progress" | "Completed";
export type AuditChecklistStatus = "Open" | "Complete";
export type AuditFindingSeverity = "Minor" | "Major" | "Critical";
export type AuditFindingStatus = "Open" | "In Progress" | "Closed";
export type AuditCorrectiveActionStatus = "Planned" | "In Progress" | "Complete";

export interface AuditRecord {
  id: string;
  title: string;
  leadAuditor: string;
  scheduledFor: string;
  status: AuditStatus;
}

export interface AuditChecklistItem {
  id: string;
  title: string;
  owner: string;
  status: AuditChecklistStatus;
}

export interface AuditFinding {
  id: string;
  title: string;
  description: string;
  severity: AuditFindingSeverity;
  status: AuditFindingStatus;
  owner: string;
  dueDate: string;
  correctiveActionIds?: string[];
}

export interface AuditCorrectiveAction {
  id: string;
  title: string;
  owner: string;
  dueDate: string;
  status: AuditCorrectiveActionStatus;
  findingId?: string;
}

export interface AuditReport extends AuditRecord {
  description: string;
  location: string;
  scope: string;
  auditType: string;
  checklist: AuditChecklistItem[];
  findings: AuditFinding[];
  correctiveActions: AuditCorrectiveAction[];
  preparedBy: string;
  preparedOn: string;
}


export interface SupplierRecord {
  id: string;
  name: string;
  score: number;
  contact: string;
  status: "Approved" | "Conditional" | "Under Review";
}

export interface RiskRecord {
  id: string;
  title: string;
  owner: string;
  rating: "Low" | "Medium" | "High" | "Critical";
  mitigationStatus: "Planned" | "Active" | "Monitoring";
}

export interface TrainingRecord {
  id: string;
  course: string;
  completionRate: number;
  dueDate: string;
  owner: string;
  status: "On Track" | "Overdue" | "Completed";
}

export interface QualityMetricPoint {
  period: string;
  closureRate: number;
  defectRate: number;
  supplierScore: number;
}

