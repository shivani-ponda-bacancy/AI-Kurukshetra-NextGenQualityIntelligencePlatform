import { z } from "zod";

export const documentStatusSchema = z.enum(["Draft", "Review", "Approved"]);

export const documentSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  owner: z.string().min(2),
  category: z.string().min(2),
  effectiveDate: z.string().min(1),
  version: z.coerce.number().int().min(1),
  status: documentStatusSchema,
});

export const documentApprovalSchema = z.object({
  status: documentStatusSchema,
  notes: z.string().min(2),
});

export const nonConformanceSchema = z.object({
  title: z.string().min(3),
  severity: z.enum(["Minor", "Major", "Critical"]),
  owner: z.string().min(2),
  dueDate: z.string().min(1),
  status: z.enum(["Open", "Investigating", "Closed"]),
});

export const capaSchema = z.object({
  title: z.string().min(3),
  owner: z.string().min(2),
  dueDate: z.string().min(1),
  status: z.enum(["Planned", "In Progress", "Verified"]),
});

export const auditSchema = z.object({
  title: z.string().min(3),
  leadAuditor: z.string().min(2),
  scheduledFor: z.string().min(1),
  status: z.enum(["Planned", "In Progress", "Completed"]),
});

export const supplierSchema = z.object({
  name: z.string().min(2),
  contact: z.string().email(),
  score: z.coerce.number().min(0).max(100),
  status: z.enum(["Approved", "Conditional", "Under Review"]),
});

export const riskSchema = z.object({
  title: z.string().min(3),
  owner: z.string().min(2),
  rating: z.enum(["Low", "Medium", "High", "Critical"]),
  mitigationStatus: z.enum(["Planned", "Active", "Monitoring"]),
});

export const trainingSchema = z.object({
  course: z.string().min(3),
  owner: z.string().min(2),
  dueDate: z.string().min(1),
  completionRate: z.coerce.number().min(0).max(100),
  status: z.enum(["On Track", "Overdue", "Completed"]),
});
