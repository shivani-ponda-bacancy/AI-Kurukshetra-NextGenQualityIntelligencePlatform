import Link from "next/link";

import { DocumentUploadForm } from "@/components/documents/document-upload-form";
import { PageHeader } from "@/components/shared/page-header";
import { buttonStyles } from "@/components/ui/button";

export default function NewDocumentPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <Link className={buttonStyles("secondary")} href="/documents">
            Back to documents
          </Link>
        }
        description="Upload a new controlled document, attach the latest file from Supabase Storage, and register its metadata in PostgreSQL."
        eyebrow="Document management"
        title="Create a controlled document"
      />

      {searchParams.error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{searchParams.error}</div>
      ) : null}

      <DocumentUploadForm />
    </div>
  );
}
