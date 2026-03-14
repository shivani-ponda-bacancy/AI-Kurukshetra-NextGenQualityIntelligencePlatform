import type { Role } from "@/types/auth";

export interface NavigationItem {
  href: string;
  label: string;
  roles: Role[];
}

export const navigationItems: NavigationItem[] = [
  { href: "/dashboard", label: "Dashboard", roles: ["admin", "quality_manager", "auditor", "employee"] },
  { href: "/documents", label: "Documents", roles: ["admin", "quality_manager", "employee"] },
  { href: "/non-conformance", label: "Non-Conformance", roles: ["admin", "quality_manager", "auditor"] },
  { href: "/capa", label: "CAPA", roles: ["admin", "quality_manager"] },
  { href: "/audits", label: "Audits", roles: ["admin", "quality_manager", "auditor"] },
  { href: "/suppliers", label: "Suppliers", roles: ["admin", "quality_manager"] },
  { href: "/risks", label: "Risks", roles: ["admin", "quality_manager", "auditor"] },
  { href: "/training", label: "Training", roles: ["admin", "quality_manager", "employee"] },
  { href: "/quality-metrics", label: "Quality Metrics", roles: ["admin", "quality_manager", "auditor"] }
];

