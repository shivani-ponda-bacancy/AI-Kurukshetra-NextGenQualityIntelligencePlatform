"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { getDocumentsBucket } from "@/lib/env";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { documentApprovalSchema, documentSchema } from "@/lib/validation/qms";

function getSafeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
}

async function uploadDocumentFile(file: File, ownerId: string) {
  const adminClient = createAdminSupabaseClient();

  if (!adminClient) {
    return undefined;
  }

  const extension = file.name.split(".").pop() ?? "bin";
  const filePath = `${ownerId}/${crypto.randomUUID()}-${getSafeFileName(file.name || `document.${extension}`)}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await adminClient.storage.from(getDocumentsBucket()).upload(filePath, buffer, {
    cacheControl: "3600",
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = adminClient.storage.from(getDocumentsBucket()).getPublicUrl(filePath);
  return data.publicUrl;
}

export async function createDocumentAction(formData: FormData) {
  const values = documentSchema.parse(Object.fromEntries(formData.entries()));
  const fileEntry = formData.get("file");
  const currentUser = await getCurrentUser();

  if (!(fileEntry instanceof File) || fileEntry.size === 0) {
    redirect("/documents/new?error=Please upload a document file.");
  }

  const fileUrl = currentUser ? await uploadDocumentFile(fileEntry, currentUser.id) : undefined;
  const adminClient = createAdminSupabaseClient();

  if (adminClient && currentUser) {
    const { error } = await adminClient.from("documents").insert({
      title: values.title,
      description: values.description,
      version: values.version,
      file_url: fileUrl ?? null,
      status: values.status,
      created_by: currentUser.id,
      created_at: new Date().toISOString(),
    });

    if (error) {
      redirect(`/documents/new?error=${encodeURIComponent(error.message)}`);
    }
  }

  revalidatePath("/documents");
  redirect("/documents?message=Document uploaded successfully.");
}

export async function submitDocumentForReviewAction(formData: FormData) {
  const documentId = String(formData.get("documentId") ?? "");
  const values = documentApprovalSchema.parse({
    status: "Review",
    notes: String(formData.get("notes") ?? ""),
  });
  const adminClient = createAdminSupabaseClient();

  if (adminClient && documentId) {
    const { error } = await adminClient.from("documents").update({ status: values.status }).eq("id", documentId);

    if (error) {
      redirect(`/documents/${documentId}?error=${encodeURIComponent(error.message)}`);
    }
  }

  revalidatePath("/documents");
  revalidatePath(`/documents/${documentId}`);
  redirect(`/documents/${documentId}?message=Document submitted for review.`);
}

export async function approveDocumentAction(formData: FormData) {
  const documentId = String(formData.get("documentId") ?? "");
  const values = documentApprovalSchema.parse({
    status: "Approved",
    notes: String(formData.get("notes") ?? ""),
  });
  const adminClient = createAdminSupabaseClient();

  if (adminClient && documentId) {
    const { error } = await adminClient.from("documents").update({ status: values.status }).eq("id", documentId);

    if (error) {
      redirect(`/documents/${documentId}?error=${encodeURIComponent(error.message)}`);
    }
  }

  revalidatePath("/documents");
  revalidatePath(`/documents/${documentId}`);
  redirect(`/documents/${documentId}?message=Document approved and released.`);
}
