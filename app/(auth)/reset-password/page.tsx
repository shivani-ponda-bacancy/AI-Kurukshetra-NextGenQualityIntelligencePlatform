import { AuthForm } from "@/components/forms/auth-form";
import { updatePasswordAction } from "@/app/actions/auth";

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string };
}) {
  return (
    <AuthForm
      action={updatePasswordAction}
      description="Choose a new password after completing the Supabase recovery flow."
      error={searchParams.error}
      fields={[
        { name: "password", label: "New password", type: "password", placeholder: "At least 8 characters" },
        { name: "confirmPassword", label: "Confirm password", type: "password", placeholder: "Repeat your password" },
      ]}
      footerHref="/sign-in"
      footerLinkLabel="Return to sign in"
      footerText="Finished updating your password?"
      message={searchParams.message}
      submitLabel="Update password"
      title="Create a new password"
    />
  );
}
