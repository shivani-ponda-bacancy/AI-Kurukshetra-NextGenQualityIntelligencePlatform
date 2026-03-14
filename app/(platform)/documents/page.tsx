import Link from "next/link";

import { DocumentStatusBadge } from "@/components/documents/document-status-badge";
import { PageHeader } from "@/components/shared/page-header";
import { SimpleTable } from "@/components/shared/simple-table";
import { StatCard } from "@/components/shared/stat-card";
import { buttonStyles } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDocumentMetrics, getDocuments } from "@/services/documents";
import { formatDate } from "@/utils/format";

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: { message?: string };
}) {
  const [metrics, documents] = await Promise.all([getDocumentMetrics(), getDocuments()]);

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <Link className={buttonStyles()} href="/documents/new">
            Upload document
          </Link>
        }
        description="Manage controlled quality documentation with file uploads, approval routing, version visibility, and historical traceability."
        eyebrow="Document management"
        title="Controlled document center"
      />

      {searchParams.message ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{searchParams.message}</div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <StatCard key={metric.title} metric={metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Document register</CardTitle>
            <CardDescription>Every controlled version with owner, release status, and direct access to the detail workspace.</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleTable
              headers={['Document', 'Version', 'Owner', 'Effective date', 'Status']}
              rows={documents.map((document) => [
                <div key={`${document.id}-title`}>
                  <Link className="font-semibold text-slate-950 hover:text-sky-700" href={`/documents/${document.id}`}>
                    {document.title}
                  </Link>
                  <p className="text-xs text-slate-500">{document.category}</p>
                </div>,
                `v${document.version}`,
                document.owner,
                formatDate(document.effectiveDate),
                <DocumentStatusBadge key={`${document.id}-status`} status={document.status} />,
              ])}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Workflow highlights</CardTitle>
            <CardDescription>Track what needs approval and what is already released.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {documents.slice(0, 3).map((document) => (
              <div className="surface-muted space-y-3 p-4" key={document.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-950">{document.title}</p>
                    <p className="text-sm text-slate-500">{document.owner} • Version {document.version}</p>
                  </div>
                  <DocumentStatusBadge status={document.status} />
                </div>
                <p className="text-sm text-slate-600">{document.description}</p>
                <Link className={buttonStyles("secondary")} href={`/documents/${document.id}`}>
                  Open workspace
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
