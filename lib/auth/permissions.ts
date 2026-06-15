import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { appSessionCookieName, verifyAppSessionCookie } from "@/lib/auth/session-cookie";
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

type ProfileAccessRow = {
  email?: string | null;
  full_name?: string | null;
  role?: UserRole | null;
  status?: string | null;
};

type RoleAccessRow = {
  role_permissions?: Array<{ permission_key: PermissionKey; enabled?: boolean | null }> | null;
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
  const fallbackSession = await verifyAppSessionCookie((await cookies()).get(appSessionCookieName)?.value);
  const previewAccess: CurrentAccess = {
    isAuthenticated: true,
    userId: "preview-admin",
    email: "alfaroje26@gmail.com",
    fullName: "Hot & Cool Admin",
    role: "super_admin",
    status: "active",
    permissions: roleDefaults.super_admin
  };
  let supabase: Awaited<ReturnType<typeof createClient>>;
  try {
    supabase = await createClient();
  } catch {
    if (fallbackSession) {
      const permissions = roleDefaults[fallbackSession.role] ?? roleDefaults.technician;
      return {
        isAuthenticated: true,
        userId: fallbackSession.userId,
        email: fallbackSession.email,
        fullName: fallbackSession.fullName,
        role: fallbackSession.role,
        status: fallbackSession.status,
        permissions
      };
    }
    return previewAccess;
  }
  const { data: userData } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
  const user = userData.user;

  if (!user) {
    if (fallbackSession) {
      const permissions = roleDefaults[fallbackSession.role] ?? roleDefaults.technician;
      return {
        isAuthenticated: true,
        userId: fallbackSession.userId,
        email: fallbackSession.email,
        fullName: fallbackSession.fullName,
        role: fallbackSession.role,
        status: fallbackSession.status,
        permissions
      };
    }
    return previewAccess;
  }

  const fallbackRole: UserRole = "technician";
  let profile: ProfileAccessRow | null = null;
  try {
    const result = await supabase
      .from("profiles")
      .select("id,email,full_name,role,status")
      .eq("id", user.id)
      .maybeSingle();
    profile = result.data as ProfileAccessRow | null;
  } catch {
    profile = null;
  }

  const role = ((profile?.role as UserRole | undefined) ?? fallbackRole);
  let permissions = roleDefaults[role] ?? roleDefaults.technician;

  let roleRows: RoleAccessRow | null = null;
  try {
    const result = await supabase
      .from("roles")
      .select("id,role_permissions(permission_key,enabled)")
      .eq("role", role)
      .maybeSingle();
    roleRows = result.data as RoleAccessRow | null;
  } catch {
    roleRows = null;
  }

  const permissionRows = roleRows?.role_permissions;
  if (Array.isArray(permissionRows) && permissionRows.length > 0) {
    permissions = permissionRows
      .filter((row) => row.enabled === true)
      .map((row: { permission_key: PermissionKey }) => row.permission_key)
      .filter((permission: PermissionKey) => allPermissions.includes(permission));
  }

  return {
    isAuthenticated: true,
    userId: user.id,
    email: profile?.email ?? user.email ?? undefined,
    fullName: profile?.full_name ?? user.user_metadata?.full_name ?? undefined,
    role,
    status: profile?.status ?? undefined,
    permissions
  };
}
