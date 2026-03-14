import { approveDocumentAction, submitDocumentForReviewAction } from "@/app/actions/documents";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { DocumentRecord } from "@/types/qms";

export function DocumentApprovalPanel({ document }: { document: DocumentRecord }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Approval workflow</CardTitle>
        <CardDescription>Advance the document through review and approval while keeping a clear audit trail.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form action={submitDocumentForReviewAction} className="space-y-3">
          <input name="documentId" type="hidden" value={document.id} />
          <Textarea name="notes" placeholder="Add review notes or change summary before sending for approval." required />
          <Button className="w-full" type="submit" variant="secondary">
            Submit for review
          </Button>
        </form>
        <form action={approveDocumentAction} className="space-y-3">
          <input name="documentId" type="hidden" value={document.id} />
          <Textarea name="notes" placeholder="Capture approval rationale, release notes, or implementation instructions." required />
          <Button className="w-full" type="submit">
            Approve document
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
