import type { UserRole } from "@/types";

import { getRoleHome } from "@/routes";

const rolePrefixes: Record<UserRole, string> = {
  CONSUMER: "/consumer",
  PROVIDER: "/provider",
  OPERATOR: "/operator",
  ADMIN: "/admin",
};

export function isRolePath(pathname: string, role: UserRole) {
  const prefix = rolePrefixes[role];
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export { getRoleHome, rolePrefixes };
