"use server";

import { revalidatePath } from "next/cache";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  auditSchema,
  capaSchema,
  documentSchema,
  nonConformanceSchema,
  riskSchema,
  supplierSchema,
  trainingSchema,
} from "@/lib/validation/qms";

type InsertableClient = {
  from: (table: string) => {
    insert: (values: Record<string, unknown>) => Promise<{ error: { message: string } | null }>;
  };
};

function asInsertableClient(client: ReturnType<typeof createServerSupabaseClient>) {
  return client as unknown as InsertableClient | null;
}

export async function upsertDocumentAction(formData: FormData) {
  const values = documentSchema.parse(Object.fromEntries(formData.entries()));
  const client = asInsertableClient(createServerSupabaseClient());

  if (client) {
    const { error } = await client.from("documents").insert({
      title: values.title,
      owner: values.owner,
      category: values.category,
      effective_date: values.effectiveDate,
      status: values.status,
    });

    if (error) throw new Error(error.message);
  }

  revalidatePath("/documents");
  revalidatePath("/dashboard");
}

export async function createNonConformanceAction(formData: FormData) {
  const values = nonConformanceSchema.parse(Object.fromEntries(formData.entries()));
  const client = asInsertableClient(createServerSupabaseClient());

  if (client) {
    const { error } = await client.from("non_conformances").insert({
      title: values.title,
      severity: values.severity,
      owner: values.owner,
      due_date: values.dueDate,
      status: values.status,
    });

    if (error) throw new Error(error.message);
  }

  revalidatePath("/non-conformances");
}

export async function createCapaAction(formData: FormData) {
  const values = capaSchema.parse(Object.fromEntries(formData.entries()));
  const client = asInsertableClient(createServerSupabaseClient());

  if (client) {
    const { error } = await client.from("capa_actions").insert({
      title: values.title,
      owner: values.owner,
      due_date: values.dueDate,
      status: values.status,
    });

    if (error) throw new Error(error.message);
  }

  revalidatePath("/capa");
}

export async function createAuditAction(formData: FormData) {
  const values = auditSchema.parse(Object.fromEntries(formData.entries()));
  const client = asInsertableClient(createServerSupabaseClient());

  if (client) {
    const { error } = await client.from("audits").insert({
      title: values.title,
      lead_auditor: values.leadAuditor,
      scheduled_for: values.scheduledFor,
      status: values.status,
    });

    if (error) throw new Error(error.message);
  }

  revalidatePath("/audits");
}

export async function createSupplierAction(formData: FormData) {
  const values = supplierSchema.parse(Object.fromEntries(formData.entries()));
  const client = asInsertableClient(createServerSupabaseClient());

  if (client) {
    const normalizedRating = Math.max(0, Math.min(5, Number((values.score / 20).toFixed(2))));

    const { error } = await client.from("suppliers").insert({
      name: values.name,
      contact_email: values.contact,
      rating: normalizedRating,
    });

    if (error) throw new Error(error.message);
  }

  revalidatePath("/suppliers");
}

export async function createRiskAction(formData: FormData) {
  const values = riskSchema.parse(Object.fromEntries(formData.entries()));
  const client = asInsertableClient(createServerSupabaseClient());

  if (client) {
    const { error } = await client.from("risks").insert({
      title: values.title,
      owner: values.owner,
      rating: values.rating,
      mitigation_status: values.mitigationStatus,
    });

    if (error) throw new Error(error.message);
  }

  revalidatePath("/risks");
}

export async function createTrainingAction(formData: FormData) {
  const values = trainingSchema.parse(Object.fromEntries(formData.entries()));
  const client = asInsertableClient(createServerSupabaseClient());

  if (client) {
    const { error } = await client.from("trainings").insert({
      course: values.course,
      owner: values.owner,
      due_date: values.dueDate,
      completion_rate: values.completionRate,
      status: values.status,
    });

    if (error) throw new Error(error.message);
  }

  revalidatePath("/training");
}

