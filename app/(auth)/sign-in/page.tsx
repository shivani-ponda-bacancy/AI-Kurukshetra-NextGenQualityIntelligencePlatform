import { AuthForm } from "@/components/forms/auth-form";
import { signInAction } from "@/app/actions/auth";

export default function SignInPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string; next?: string };
}) {
  return (
    <AuthForm
      action={signInAction}
      auxLinks={[{ href: "/forgot-password", label: "Forgot your password?" }]}
      description="Secure sign-in backed by Supabase Auth with SSR sessions and middleware-protected routes."
      error={searchParams.error}
      fields={[
        { name: "email", label: "Work email", type: "email", placeholder: "qa@company.com" },
        { name: "password", label: "Password", type: "password", placeholder: "At least 8 characters" },
      ]}
      footerHref="/sign-up"
      footerLinkLabel="Create account"
      footerText="Need a workspace?"
      hiddenFields={searchParams.next ? [{ name: "next", value: searchParams.next }] : undefined}
      message={searchParams.message}
      submitLabel="Sign in"
      title="Sign in to Northstar QMS"
    />
  );
}
