import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";
import { Button, buttonStyles } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function NewAuditPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <Link className={buttonStyles("secondary")} href="/audits">
            Back to audits
          </Link>
        }
        description="Schedule an audit, define the checklist, and capture the scope and ownership details."
        eyebrow="Audit management"
        title="Schedule an audit"
      />

      <Card>
        <CardHeader>
          <CardTitle>Audit scheduling</CardTitle>
          <CardDescription>Plan the audit, set accountability, and preload checklist items.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
              <span>Audit title</span>
              <Input name="title" placeholder="Internal GMP compliance audit" required />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Audit type</span>
              <Select name="auditType" required defaultValue="Internal">
                <option value="Internal">Internal</option>
                <option value="Supplier">Supplier</option>
                <option value="Regulatory">Regulatory</option>
              </Select>
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Lead auditor</span>
              <Input name="leadAuditor" placeholder="E. Knight" required />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Scheduled for</span>
              <Input name="scheduledFor" required type="date" />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Status</span>
              <Select name="status" required defaultValue="Planned">
                <option value="Planned">Planned</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </Select>
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
              <span>Location</span>
              <Input name="location" placeholder="Plant 2 - Assembly and Packaging" required />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
              <span>Scope</span>
              <Textarea name="scope" placeholder="Assembly, packaging, batch record review" required />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
              <span>Audit checklist</span>
              <Textarea name="checklist" placeholder="List checklist items to verify during the audit." required />
            </label>
            <div className="md:col-span-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-sm font-semibold text-slate-900">Checklist ownership</p>
                <p className="text-xs text-slate-500">Assign owners for key checklist items.</p>
              </div>
            </div>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Checklist item 1</span>
              <Input name="checklistItem1" placeholder="Training records current" />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Item 1 owner</span>
              <Input name="checklistOwner1" placeholder="QA" />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Checklist item 2</span>
              <Input name="checklistItem2" placeholder="Line clearance log complete" />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Item 2 owner</span>
              <Input name="checklistOwner2" placeholder="Production" />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Checklist item 3</span>
              <Input name="checklistItem3" placeholder="Calibration status verified" />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Item 3 owner</span>
              <Input name="checklistOwner3" placeholder="Metrology" />
            </label>
            <div className="md:col-span-2">
              <Button type="submit">Create audit</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
