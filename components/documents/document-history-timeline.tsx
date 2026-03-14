import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentStatusBadge } from "@/components/documents/document-status-badge";
import type { DocumentHistoryEntry } from "@/types/qms";
import { formatDate } from "@/utils/format";

export function DocumentHistoryTimeline({ history }: { history: DocumentHistoryEntry[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Document history</CardTitle>
        <CardDescription>Every upload, review step, approval, and revision event in version order.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {history.map((entry) => (
          <div className="relative pl-6" key={entry.id}>
            <span className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-sky-500" />
            <div className="surface-muted space-y-3 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-slate-950">{entry.action}</p>
                  <p className="text-sm text-slate-500">Version {entry.version} • {entry.actor} • {formatDate(entry.createdAt)}</p>
                </div>
                <DocumentStatusBadge status={entry.status} />
              </div>
              <p className="text-sm text-slate-600">{entry.notes}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
