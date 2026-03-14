import { notFound } from "next/navigation";
import Link from "next/link";

import { DocumentApprovalPanel } from "@/components/documents/document-approval-panel";
import { DocumentHistoryTimeline } from "@/components/documents/document-history-timeline";
import { DocumentPreview } from "@/components/documents/document-preview";
import { DocumentStatusBadge } from "@/components/documents/document-status-badge";
import { PageHeader } from "@/components/shared/page-header";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDocumentById } from "@/services/documents";
import { formatDate } from "@/utils/format";

export default async function DocumentDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { error?: string; message?: string };
}) {
  const document = await getDocumentById(params.id);

  if (!document) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <div className="flex items-center gap-3">
            <DocumentStatusBadge status={document.status} />
            <Link className={buttonStyles("secondary")} href="/documents">
              Back to documents
            </Link>
          </div>
        }
        description={document.description}
        eyebrow="Document workspace"
        title={document.title}
      />

      {searchParams.message ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{searchParams.message}</div>
      ) : null}
      {searchParams.error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{searchParams.error}</div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <DocumentPreview document={document} />
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
              <CardDescription>Version state, ownership, and current workflow assignment.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Version</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">v{document.version}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Owner</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{document.owner}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Effective date</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{formatDate(document.effectiveDate)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Current approver</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{document.currentApprover ?? "Not assigned"}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">File</p>
                <p className="mt-2 text-sm font-medium text-slate-700">{document.fileName ?? "No file uploaded"}</p>
              </div>
            </CardContent>
          </Card>
          <DocumentApprovalPanel document={document} />
        </div>
      </section>

      <DocumentHistoryTimeline history={document.history} />
    </div>
  );
}
