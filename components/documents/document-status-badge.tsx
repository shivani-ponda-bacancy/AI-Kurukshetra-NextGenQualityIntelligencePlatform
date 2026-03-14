import { Badge } from "@/components/ui/badge";
import type { DocumentStatus } from "@/types/qms";

export function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
  if (status === "Approved") {
    return <Badge variant="success">Approved</Badge>;
  }

  if (status === "Review") {
    return <Badge variant="warning">In Review</Badge>;
  }

  return <Badge variant="outline">Draft</Badge>;
}
