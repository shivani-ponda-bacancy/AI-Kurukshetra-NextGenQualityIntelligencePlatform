import { cache } from "react";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type { DocumentRecord, DocumentStatus, MetricCard } from "@/types/qms";

const documentRecords: DocumentRecord[] = [
  {
    id: "DOC-001",
    title: "SOP-001 Incoming Inspection",
    description: "Defines inspection and release criteria for inbound materials and quality records.",
    owner: "A. Chen",
    ownerId: "user-001",
    status: "Approved",
    version: 4,
    category: "Procedure",
    fileUrl: "https://example.com/qms/sop-001-v4.pdf",
    fileName: "sop-001-v4.pdf",
    createdAt: "2026-03-05T10:00:00.000Z",
    effectiveDate: "2026-03-05",
    currentApprover: "Priya Sharma",
    history: [
      { id: "DOC-001-H3", version: 4, action: "Approved", actor: "Priya Sharma", notes: "Approved for production release.", createdAt: "2026-03-05T10:00:00.000Z", fileUrl: "https://example.com/qms/sop-001-v4.pdf", status: "Approved" },
      { id: "DOC-001-H2", version: 4, action: "Submitted for review", actor: "A. Chen", notes: "Updated sampling clarifications and acceptance limits.", createdAt: "2026-03-03T14:30:00.000Z", fileUrl: "https://example.com/qms/sop-001-v4.pdf", status: "Review" },
      { id: "DOC-001-H1", version: 3, action: "Revision created", actor: "A. Chen", notes: "Version 4 drafted from approved version 3.", createdAt: "2026-03-01T09:00:00.000Z", fileUrl: "https://example.com/qms/sop-001-v3.pdf", status: "Draft" }
    ]
  },
  {
    id: "DOC-002",
    title: "WI-104 Cleanroom Gowning",
    description: "Step-by-step gowning guidance for controlled environments with contamination checkpoints.",
    owner: "L. Patel",
    ownerId: "user-002",
    status: "Review",
    version: 2,
    category: "Work Instruction",
    fileUrl: "https://example.com/qms/wi-104-v2.pdf",
    fileName: "wi-104-v2.pdf",
    createdAt: "2026-03-18T08:15:00.000Z",
    effectiveDate: "2026-03-18",
    currentApprover: "N. Singh",
    history: [
      { id: "DOC-002-H2", version: 2, action: "Submitted for review", actor: "L. Patel", notes: "Awaiting audit lead approval before release.", createdAt: "2026-03-18T08:15:00.000Z", fileUrl: "https://example.com/qms/wi-104-v2.pdf", status: "Review" },
      { id: "DOC-002-H1", version: 2, action: "Uploaded", actor: "L. Patel", notes: "New gowning visuals and contamination controls attached.", createdAt: "2026-03-17T17:40:00.000Z", fileUrl: "https://example.com/qms/wi-104-v2.pdf", status: "Draft" }
    ]
  },
  {
    id: "DOC-003",
    title: "FRM-220 Batch Review Checklist",
    description: "Checklist template for batch record review before final disposition and release.",
    owner: "R. Diaz",
    ownerId: "user-003",
    status: "Draft",
    version: 1,
    category: "Form",
    fileUrl: "https://example.com/qms/frm-220-v1.pdf",
    fileName: "frm-220-v1.pdf",
    createdAt: "2026-03-12T12:20:00.000Z",
    effectiveDate: "2026-03-22",
    currentApprover: "Priya Sharma",
    history: [
      { id: "DOC-003-H1", version: 1, action: "Created", actor: "R. Diaz", notes: "Initial draft for new electronic batch record workflow.", createdAt: "2026-03-12T12:20:00.000Z", fileUrl: "https://example.com/qms/frm-220-v1.pdf", status: "Draft" }
    ]
  }
];

type DocumentRow = Database["public"]["Tables"]["documents"]["Row"];

function mapSupabaseStatus(value: string | null | undefined): DocumentStatus {
  if (value === "Approved") return "Approved";
  if (value === "Review") return "Review";
  return "Draft";
}

function buildMetrics(records: DocumentRecord[]): MetricCard[] {
  const draftCount = records.filter((record) => record.status === "Draft").length;
  const reviewCount = records.filter((record) => record.status === "Review").length;
  const approvedCount = records.filter((record) => record.status === "Approved").length;

  return [
    { title: "Controlled docs", value: `${records.length}`, trend: `${approvedCount} approved`, tone: "success" },
    { title: "Pending review", value: `${reviewCount}`, trend: reviewCount > 0 ? "Approval queue active" : "No blockers", tone: reviewCount > 0 ? "warning" : "success" },
    { title: "Draft revisions", value: `${draftCount}`, trend: `${approvedCount} released`, tone: draftCount > 0 ? "default" : "success" },
  ];
}

const getDocumentsFromSupabase = cache(async (): Promise<DocumentRecord[] | null> => {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("documents")
    .select("id, title, description, version, file_url, status, created_by, created_at")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return null;
  }

  const rows = data as DocumentRow[];

  return rows.map((document) => ({
    id: document.id,
    title: document.title,
    description: document.description ?? "No description provided.",
    owner: document.created_by,
    ownerId: document.created_by,
    status: mapSupabaseStatus(document.status),
    version: document.version ?? 1,
    category: "Controlled Document",
    fileUrl: document.file_url ?? undefined,
    fileName: document.file_url ? document.file_url.split("/").pop() ?? undefined : undefined,
    createdAt: document.created_at ?? new Date().toISOString(),
    effectiveDate: (document.created_at ?? new Date().toISOString()).slice(0, 10),
    currentApprover: mapSupabaseStatus(document.status) === "Review" ? "Quality Manager" : undefined,
    history: [
      {
        id: `${document.id}-history`,
        version: document.version ?? 1,
        action: mapSupabaseStatus(document.status) === "Approved" ? "Approved" : mapSupabaseStatus(document.status) === "Review" ? "Submitted for review" : "Created",
        actor: document.created_by,
        notes: "Loaded from Supabase metadata.",
        createdAt: document.created_at ?? new Date().toISOString(),
        fileUrl: document.file_url ?? undefined,
        status: mapSupabaseStatus(document.status),
      },
    ],
  }));
});

export async function getDocuments() {
  return (await getDocumentsFromSupabase()) ?? documentRecords;
}

export async function getDocumentMetrics() {
  const records = await getDocuments();
  return buildMetrics(records);
}

export async function getDocumentById(id: string) {
  const records = await getDocuments();
  return records.find((record) => record.id === id) ?? null;
}

export async function getDocumentHistory(id: string) {
  const document = await getDocumentById(id);
  return document?.history ?? [];
}
