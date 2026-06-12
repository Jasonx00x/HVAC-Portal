import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { permissions as allPermissions, type PermissionKey } from "@/lib/fieldcore";
import { requiredPermissionForPath, roleDefaults, type UserRole } from "@/lib/auth/permissions";
import { getSupabaseCookieOptions, getSupabasePublicEnv } from "@/lib/supabase/env";

const publicPaths = ["/login", "/logout", "/auth/sign-in"];

type MiddlewareProfileRow = {
  role?: UserRole | null;
  status?: string | null;
};

type MiddlewareRoleRow = {
  role_permissions?: Array<{ permission_key: PermissionKey; enabled?: boolean | null }> | null;
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (request.method === "OPTIONS") {
    return NextResponse.next();
  }
  if (publicPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });
  const { url, anonKey } = getSupabasePublicEnv();

  if (!url || !anonKey) return response;

  const supabase = createServerClient(url, anonKey, {
    cookieEncoding: "raw",
    cookieOptions: getSupabaseCookieOptions(),
    cookies: {
      encode: "tokens-only",
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      }
    }
  });

  const { data } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
  if (!data.user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const needed = requiredPermissionForPath(pathname);
  if (!needed) return response;

  let profile: MiddlewareProfileRow | null = null;
  try {
    const result = await supabase
      .from("profiles")
      .select("role,status")
      .eq("id", data.user.id)
      .maybeSingle();
    profile = result.data as MiddlewareProfileRow | null;
  } catch {
    profile = null;
  }
  const role = ((profile?.role as UserRole | undefined) ?? "technician");
  const status = String(profile?.status ?? "active").toLowerCase();
  if (["disabled", "suspended"].includes(status)) {
    const blockedUrl = request.nextUrl.clone();
    blockedUrl.pathname = "/unauthorized";
    blockedUrl.searchParams.set("reason", "account_status");
    return NextResponse.redirect(blockedUrl);
  }

  if (role === "technician" && !pathname.startsWith("/technician")) {
    const blockedUrl = request.nextUrl.clone();
    blockedUrl.pathname = "/unauthorized";
    blockedUrl.searchParams.set("permission", "technician_portal_only");
    return NextResponse.redirect(blockedUrl);
  }

  let granted = roleDefaults[role] ?? roleDefaults.technician;
  let roleRow: MiddlewareRoleRow | null = null;
  try {
    const result = await supabase
      .from("roles")
      .select("role_permissions(permission_key,enabled)")
      .eq("role", role)
      .maybeSingle();
    roleRow = result.data as MiddlewareRoleRow | null;
  } catch {
    roleRow = null;
  }
  const rows = roleRow?.role_permissions;
  if (Array.isArray(rows) && rows.length > 0) {
    granted = rows
      .filter((row) => row.enabled === true)
      .map((row: { permission_key: PermissionKey }) => row.permission_key)
      .filter((permission: PermissionKey) => allPermissions.includes(permission));
  }

  if (!granted.includes(needed)) {
    const blockedUrl = request.nextUrl.clone();
    blockedUrl.pathname = "/unauthorized";
    blockedUrl.searchParams.set("permission", needed);
    return NextResponse.redirect(blockedUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"]
};
