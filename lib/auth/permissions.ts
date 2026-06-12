import { createClient } from "@/lib/supabase/server";
import { appRoutes, permissions as allPermissions, type PermissionKey } from "@/lib/fieldcore";

export type UserRole = "super_admin" | "admin" | "office_staff" | "technician";

export type CurrentAccess = {
  isAuthenticated: boolean;
  userId?: string;
  email?: string;
  fullName?: string;
  role: UserRole | "anonymous";
  status?: string;
  permissions: PermissionKey[];
};

export const roleDefaults: Record<UserRole, PermissionKey[]> = {
  super_admin: [...allPermissions],
  admin: allPermissions.filter((permission) => permission !== "view_profit"),
  office_staff: [
    "view_dashboard",
    "manage_properties",
    "manage_units",
    "manage_equipment",
    "manage_jobs",
    "manage_calendar",
    "manage_approvals",
    "manage_materials",
    "manage_inventory",
    "manage_invoices",
    "manage_residential",
    "view_reports"
  ],
  technician: ["manage_jobs", "manage_materials"]
};

export const routePermissions: Record<string, PermissionKey> = {
  "/dashboard": "view_dashboard",
  "/calendar": "manage_calendar",
  "/properties": "manage_properties",
  "/units": "manage_units",
  "/equipment": "manage_equipment",
  "/jobs": "manage_jobs",
  "/approvals": "manage_approvals",
  "/materials": "manage_materials",
  "/inventory": "manage_inventory",
  "/invoices": "manage_invoices",
  "/revenue": "view_revenue",
  "/reports": "view_reports",
  "/employees": "manage_employees",
  "/residential": "manage_residential",
  "/settings/staff": "manage_staff",
  "/settings": "manage_settings"
};

export function hasPermission(access: CurrentAccess, permission?: PermissionKey) {
  return !permission || access.permissions.includes(permission);
}

export function visibleRoutes(access: CurrentAccess) {
  return appRoutes.filter((route) => hasPermission(access, route.permission));
}

export function requiredPermissionForPath(pathname: string) {
  const match = Object.entries(routePermissions)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([path]) => pathname === path || pathname.startsWith(`${path}/`));
  return match?.[1];
}

export async function getCurrentAccess(): Promise<CurrentAccess> {
  let supabase: Awaited<ReturnType<typeof createClient>>;
  try {
    supabase = await createClient();
  } catch {
    return { isAuthenticated: false, role: "anonymous", permissions: [] };
  }
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    return { isAuthenticated: false, role: "anonymous", permissions: [] };
  }

  const fallbackRole: UserRole = "technician";
  const { data: profile } = await supabase
    .from("profiles")
    .select("id,email,full_name,role,status")
    .eq("id", user.id)
    .maybeSingle();

  const role = ((profile?.role as UserRole | undefined) ?? fallbackRole);
  let permissions = roleDefaults[role] ?? roleDefaults.technician;

  const { data: roleRows } = await supabase
    .from("roles")
    .select("id,role_permissions(permission_key,enabled)")
    .eq("role", role)
    .maybeSingle();

  const permissionRows = roleRows?.role_permissions;
  if (Array.isArray(permissionRows) && permissionRows.length > 0) {
    permissions = permissionRows
      .filter((row: { enabled?: boolean }) => row.enabled)
      .map((row: { permission_key: PermissionKey }) => row.permission_key)
      .filter((permission: PermissionKey) => allPermissions.includes(permission));
  }

  return {
    isAuthenticated: true,
    userId: user.id,
    email: profile?.email ?? user.email ?? undefined,
    fullName: profile?.full_name ?? user.user_metadata?.full_name ?? undefined,
    role,
    status: profile?.status,
    permissions
  };
}
