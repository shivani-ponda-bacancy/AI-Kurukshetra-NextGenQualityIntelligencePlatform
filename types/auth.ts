export type Role = "admin" | "quality_manager" | "auditor" | "employee";

export interface AppUser {
  id: string;
  email: string;
  fullName: string;
  organizationName: string;
  role: Role;
}
