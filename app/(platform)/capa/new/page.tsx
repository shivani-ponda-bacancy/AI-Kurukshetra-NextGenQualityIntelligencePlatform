import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";
import { Button, buttonStyles } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getNonConformanceIssues } from "@/services/non-conformance";

export default async function NewCapaPage() {
  const issues = await getNonConformanceIssues();

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <Link className={buttonStyles("secondary")} href="/capa">
            Back to CAPA
          </Link>
        }
        description="Launch a CAPA tied to a non-conformance, define root cause analysis, and outline corrective and preventive plans."
        eyebrow="CAPA management"
        title="Create a CAPA record"
      />

      <Card>
        <CardHeader>
          <CardTitle>CAPA intake</CardTitle>
          <CardDescription>Capture the root cause, action plans, assignments, and effectiveness verification.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
              <span>CAPA title</span>
              <Input name="title" placeholder="Seal torque variation - Line 3" required />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
              <span>Linked non-conformance</span>
              <Select name="nonConformanceId" required defaultValue={issues[0]?.id ?? ""}>
                {issues.map((issue) => (
                  <option key={issue.id} value={issue.id}>
                    {issue.id} - {issue.title}
                  </option>
                ))}
              </Select>
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Owner</span>
              <Input name="owner" placeholder="A. Chen" required />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Status</span>
              <Select name="status" required defaultValue="Open">
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Effectiveness Check">Effectiveness Check</option>
                <option value="Closed">Closed</option>
              </Select>
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Opened on</span>
              <Input name="openedOn" required type="date" />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Due date</span>
              <Input name="dueDate" required type="date" />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
              <span>Root cause analysis</span>
              <Textarea name="rootCauseAnalysis" placeholder="Summarize the root cause analysis and evidence." required />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
              <span>Corrective action plan</span>
              <Textarea name="correctiveActionPlan" placeholder="List corrective actions and containment steps." required />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
              <span>Preventive action plan</span>
              <Textarea name="preventiveActionPlan" placeholder="List preventive actions to avoid recurrence." required />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
              <span>Effectiveness verification plan</span>
              <Textarea name="effectivenessPlan" placeholder="Describe verification criteria and monitoring window." required />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Effectiveness owner</span>
              <Input name="effectivenessOwner" placeholder="Quality Eng" required />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Effectiveness due date</span>
              <Input name="effectivenessDueDate" required type="date" />
            </label>

            <div className="md:col-span-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-sm font-semibold text-slate-900">Task assignments</p>
                <p className="text-xs text-slate-500">Capture corrective and preventive action owners and due dates.</p>
              </div>
            </div>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Task 1 title</span>
              <Input name="task1Title" placeholder="Recalibrate torque tools" />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Task 1 type</span>
              <Select name="task1Type" defaultValue="Corrective">
                <option value="Corrective">Corrective</option>
                <option value="Preventive">Preventive</option>
              </Select>
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Task 1 owner</span>
              <Input name="task1Owner" placeholder="Metrology" />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Task 1 due date</span>
              <Input name="task1DueDate" type="date" />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Task 2 title</span>
              <Input name="task2Title" placeholder="Update fixture setup SOP" />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Task 2 type</span>
              <Select name="task2Type" defaultValue="Preventive">
                <option value="Corrective">Corrective</option>
                <option value="Preventive">Preventive</option>
              </Select>
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Task 2 owner</span>
              <Input name="task2Owner" placeholder="Doc Control" />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Task 2 due date</span>
              <Input name="task2DueDate" type="date" />
            </label>
            <div className="md:col-span-2">
              <Button type="submit">Create CAPA</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
