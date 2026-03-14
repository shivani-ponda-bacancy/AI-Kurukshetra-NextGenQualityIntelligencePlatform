import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";
import { Button, buttonStyles } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function NewNonConformancePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <Link className={buttonStyles("secondary")} href="/non-conformance">
            Back to log
          </Link>
        }
        description="Report a new quality issue, assign ownership, and capture early containment actions."
        eyebrow="Non-conformance management"
        title="Report a quality issue"
      />

      <Card>
        <CardHeader>
          <CardTitle>Non-conformance intake</CardTitle>
          <CardDescription>Capture the issue, assignment, severity, and initial investigation notes.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
              <span>Issue title</span>
              <Input name="title" placeholder="Leak test failure on Line 3" required />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
              <span>Description</span>
              <Textarea name="description" placeholder="Summarize the deviation, impacted lots, and immediate risk." required />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Reported by</span>
              <Input name="reportedBy" placeholder="M. Rao" required />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Reported on</span>
              <Input name="reportedOn" required type="date" />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Severity</span>
              <Select name="severity" required defaultValue="Medium">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </Select>
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Assigned to</span>
              <Input name="assignedTo" placeholder="A. Chen" required />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Source</span>
              <Select name="source" required defaultValue="In-process inspection">
                <option value="Incoming inspection">Incoming inspection</option>
                <option value="In-process inspection">In-process inspection</option>
                <option value="Final inspection">Final inspection</option>
                <option value="Customer complaint">Customer complaint</option>
                <option value="Internal audit">Internal audit</option>
              </Select>
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Area / location</span>
              <Input name="location" placeholder="Line 3 - Assembly" required />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Due date</span>
              <Input name="dueDate" required type="date" />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Status</span>
              <Select name="status" required defaultValue="Open">
                <option value="Open">Open</option>
                <option value="Investigating">Investigating</option>
                <option value="Closed">Closed</option>
              </Select>
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
              <span>Containment action</span>
              <Textarea name="containment" placeholder="Describe immediate containment steps and impacted material." required />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
              <span>Initial investigation notes</span>
              <Textarea name="investigationNotes" placeholder="Document early findings, data collected, and next steps." />
            </label>
            <div className="md:col-span-2">
              <Button type="submit">Submit non-conformance</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


