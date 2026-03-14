import { AuthForm } from "@/components/forms/auth-form";
import { signUpAction } from "@/app/actions/auth";

export default function SignUpPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string };
}) {
  return (
    <AuthForm
      action={signUpAction}
      description="Provision a tenant workspace and store the selected role in Supabase Auth metadata for middleware-based access control."
      error={searchParams.error}
      fields={[
        { name: "fullName", label: "Full name", placeholder: "Priya Sharma" },
        { name: "organizationName", label: "Organization", placeholder: "Northstar Biologics" },
        { name: "email", label: "Work email", type: "email", placeholder: "qa@company.com" },
        { name: "password", label: "Password", type: "password", placeholder: "At least 8 characters" },
        {
          name: "role",
          label: "Role",
          placeholder: "",
          options: [
            { label: "Admin", value: "admin" },
            { label: "Quality Manager", value: "quality_manager" },
            { label: "Auditor", value: "auditor" },
            { label: "Employee", value: "employee" },
          ],
        },
      ]}
      footerHref="/sign-in"
      footerLinkLabel="Sign in"
      footerText="Already have an account?"
      message={searchParams.message}
      submitLabel="Create workspace"
      title="Create a QMS workspace"
    />
  );
}
