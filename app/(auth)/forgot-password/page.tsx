import { AuthForm } from "@/components/forms/auth-form";
import { forgotPasswordAction } from "@/app/actions/auth";

export default function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string };
}) {
  return (
    <AuthForm
      action={forgotPasswordAction}
      description="Enter your account email and Supabase will send a secure password recovery link."
      error={searchParams.error}
      fields={[{ name: "email", label: "Work email", type: "email", placeholder: "qa@company.com" }]}
      footerHref="/sign-in"
      footerLinkLabel="Back to sign in"
      footerText="Remembered your password?"
      message={searchParams.message}
      submitLabel="Send reset link"
      title="Reset your password"
    />
  );
}
