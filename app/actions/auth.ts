"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { env, hasSupabaseCredentials } from "@/lib/env";
import { createAdminSupabaseClient, createServerSupabaseClient } from "@/lib/supabase/server";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "@/lib/validation/auth";

function getBaseUrl() {
  const headerStore = headers();
  const origin = headerStore.get("origin");
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const protocol = headerStore.get("x-forwarded-proto") ?? "http";

  if (origin) {
    return origin;
  }

  if (host) {
    return `${protocol}://${host}`;
  }

  return "http://localhost:3000";
}

function buildRedirectUrl(path: string) {
  const baseUrl = env.NEXT_PUBLIC_APP_URL ?? getBaseUrl();

  try {
    return new URL(path, baseUrl).toString();
  } catch {
    return null;
  }
}

function isRedirectError(message: string) {
  const normalized = message.toLowerCase();
  return normalized.includes("redirect") || normalized.includes("url");
}

function isRateLimitError(message: string) {
  return message.toLowerCase().includes("rate limit");
}

function isAlreadyRegisteredError(message: string) {
  const normalized = message.toLowerCase();
  return normalized.includes("already registered") || normalized.includes("already exists");
}

function getSafeNextPath(value: FormDataEntryValue | null, fallback = "/dashboard") {
  if (typeof value !== "string") {
    return fallback;
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  return value;
}

export async function signInAction(formData: FormData) {
  const values = signInSchema.parse(Object.fromEntries(formData.entries()));
  const next = getSafeNextPath(formData.get("next"));

  if (!hasSupabaseCredentials()) {
    redirect(next);
  }

  const supabase = createServerSupabaseClient();

  if (!supabase) {
    redirect(next);
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });

  if (error) {
    redirect(`/sign-in?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard");
  redirect(next);
}

export async function signUpAction(formData: FormData) {
  const values = signUpSchema.parse(Object.fromEntries(formData.entries()));

  if (!hasSupabaseCredentials()) {
    redirect("/dashboard");
  }

  const supabase = createServerSupabaseClient();

  if (!supabase) {
    redirect("/dashboard");
  }

  const emailRedirectTo = buildRedirectUrl("/auth/callback?next=/dashboard");
  let { data, error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      data: {
        full_name: values.fullName,
        organization_name: values.organizationName,
        role: values.role,
      },
      ...(emailRedirectTo ? { emailRedirectTo } : {}),
    },
  });

  if (error && emailRedirectTo && isRedirectError(error.message)) {
    ({ data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          full_name: values.fullName,
          organization_name: values.organizationName,
          role: values.role,
        },
      },
    }));
  }

  if (error && isRateLimitError(error.message)) {
    const admin = createAdminSupabaseClient();

    if (admin) {
      const { error: adminError } = await admin.auth.admin.createUser({
        email: values.email,
        password: values.password,
        email_confirm: true,
        user_metadata: {
          full_name: values.fullName,
          organization_name: values.organizationName,
          role: values.role,
        },
      });

      if (adminError && !isAlreadyRegisteredError(adminError.message)) {
        redirect(`/sign-up?error=${encodeURIComponent(adminError.message)}`);
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (signInError) {
        redirect(`/sign-in?error=${encodeURIComponent(signInError.message)}`);
      }

      revalidatePath("/dashboard");
      redirect("/dashboard");
    }

    redirect(
      `/sign-up?error=${encodeURIComponent(
        "Email rate limit exceeded. Wait a minute and try again, or sign in if you already created this account."
      )}`
    );
  }

  if (error && isAlreadyRegisteredError(error.message)) {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (!signInError) {
      revalidatePath("/dashboard");
      redirect("/dashboard");
    }

    redirect(`/sign-in?error=${encodeURIComponent(signInError.message)}`);
  }

  if (error) {
    redirect(`/sign-up?error=${encodeURIComponent(error.message)}`);
  }

  if (data?.session) {
    revalidatePath("/dashboard");
    redirect("/dashboard");
  }

  redirect("/sign-in?message=Check your email to confirm your account.");
}

export async function forgotPasswordAction(formData: FormData) {
  const values = forgotPasswordSchema.parse(Object.fromEntries(formData.entries()));

  if (!hasSupabaseCredentials()) {
    redirect("/forgot-password?message=Supabase credentials are not configured in this environment.");
  }

  const supabase = createServerSupabaseClient();

  if (!supabase) {
    redirect("/forgot-password?message=Supabase credentials are not configured in this environment.");
  }

  const redirectTo = buildRedirectUrl("/auth/callback?next=/reset-password");
  let { error } = await supabase.auth.resetPasswordForEmail(values.email, redirectTo ? { redirectTo } : {});

  if (error && redirectTo && isRedirectError(error.message)) {
    ({ error } = await supabase.auth.resetPasswordForEmail(values.email));
  }

  if (error) {
    redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/forgot-password?message=Password reset instructions have been sent to your email.");
}

export async function updatePasswordAction(formData: FormData) {
  const values = resetPasswordSchema.parse(Object.fromEntries(formData.entries()));

  if (!hasSupabaseCredentials()) {
    redirect("/reset-password?message=Supabase credentials are not configured in this environment.");
  }

  const supabase = createServerSupabaseClient();

  if (!supabase) {
    redirect("/reset-password?message=Supabase credentials are not configured in this environment.");
  }

  const { error } = await supabase.auth.updateUser({
    password: values.password,
  });

  if (error) {
    redirect(`/reset-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/sign-in?message=Your password has been updated. Please sign in.");
}

export async function signOutAction() {
  const supabase = createServerSupabaseClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  redirect("/sign-in");
}

