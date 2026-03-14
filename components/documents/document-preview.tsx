import { FileText } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DocumentRecord } from "@/types/qms";

function isPdf(url: string | undefined) {
  return Boolean(url?.toLowerCase().includes(".pdf"));
}

export function DocumentPreview({ document }: { document: DocumentRecord }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Document preview</CardTitle>
        <CardDescription>Preview the latest uploaded file and verify the correct controlled version is attached.</CardDescription>
      </CardHeader>
      <CardContent>
        {document.fileUrl && isPdf(document.fileUrl) ? (
          <iframe className="h-[640px] w-full rounded-2xl border border-slate-200 bg-slate-50" src={document.fileUrl} title={`${document.title} preview`} />
        ) : (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
              <FileText className="h-8 w-8" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-slate-950">No inline preview available</h3>
            <p className="mt-2 max-w-md text-sm text-slate-500">
              {document.fileUrl
                ? `The latest file is attached as ${document.fileName ?? "a controlled document"}. Open it from Supabase storage or upload a PDF for inline preview.`
                : "Upload a controlled document to Supabase storage and the latest revision will appear here."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
