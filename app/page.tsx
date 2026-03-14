import Link from "next/link";
import { ArrowRight, ShieldCheck, Workflow, BarChart3 } from "lucide-react";

import { buttonStyles } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const highlights = [
  {
    title: "Unified quality workflow",
    description: "Run documents, CAPAs, audits, supplier controls, and training from one role-aware SaaS workspace.",
    icon: Workflow,
  },
  {
    title: "Audit-ready by design",
    description: "Server actions, RBAC, and Supabase auth create a secure baseline for regulated quality operations.",
    icon: ShieldCheck,
  },
  {
    title: "Analytics that matter",
    description: "Track closure rate, supplier performance, and leading indicators with TanStack Query and Chart.js.",
    icon: BarChart3,
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 md:px-10 lg:px-12">
      <section className="surface-panel relative overflow-hidden px-8 py-16 md:px-12 md:py-20">
        <div className="absolute inset-y-0 right-0 hidden w-2/5 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.18),transparent_58%)] lg:block" />
        <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-sky-600">Enterprise quality management</p>
              <h1 className="max-w-4xl text-5xl font-semibold leading-tight text-slate-950 md:text-6xl">
                Build a modern QMS that keeps documents, actions, and audits in one operational system.
              </h1>
              <p className="max-w-2xl text-lg text-slate-600">
                This scaffold ships a full App Router foundation for regulated SaaS teams: authentication, RBAC, analytics, and feature routes for every major quality workflow.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link className={buttonStyles()} href="/dashboard">
                Open demo workspace
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link className={buttonStyles("secondary")} href="/sign-in">
                Configure authentication
              </Link>
            </div>
          </div>
          <Card className="border-slate-200/80 bg-slate-950 text-white">
            <CardContent className="space-y-6 p-8">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-sky-300">What is included</p>
                <h2 className="mt-3 text-2xl font-semibold">Production foundation</h2>
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li>Next.js App Router with server-first routes and server actions</li>
                <li>Supabase auth and SSR client setup for secure session handling</li>
                <li>Feature routes for documents, NCs, CAPAs, audits, suppliers, risks, training, and metrics</li>
                <li>Reusable UI primitives and analytics-ready client hooks</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-3">
        {highlights.map((highlight) => {
          const Icon = highlight.icon;

          return (
            <Card key={highlight.title}>
              <CardContent className="space-y-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-slate-950">{highlight.title}</h2>
                  <p className="text-sm text-slate-600">{highlight.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </main>
  );
}
