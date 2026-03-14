import { createDocumentAction } from "@/app/actions/documents";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function DocumentUploadForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload a controlled document</CardTitle>
        <CardDescription>Store the file in Supabase Storage, track metadata in PostgreSQL, and start the approval workflow from one form.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={createDocumentAction} className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
            <span>Document title</span>
            <Input name="title" placeholder="SOP-009 Complaint Handling" required />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
            <span>Description</span>
            <Textarea name="description" placeholder="Describe the scope, process, and intended use of the document." required />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Owner</span>
            <Input name="owner" placeholder="Priya Sharma" required />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Category</span>
            <Input name="category" placeholder="Procedure" required />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Version</span>
            <Input min="1" name="version" required type="number" defaultValue="1" />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Effective date</span>
            <Input name="effectiveDate" required type="date" />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Status</span>
            <Select name="status" required defaultValue="Draft">
              <option value="Draft">Draft</option>
              <option value="Review">Review</option>
              <option value="Approved">Approved</option>
            </Select>
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>PDF or document file</span>
            <Input accept=".pdf,.doc,.docx,.xls,.xlsx" name="file" required type="file" />
          </label>
          <div className="md:col-span-2">
            <Button type="submit">Upload document</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
