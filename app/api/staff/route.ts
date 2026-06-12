import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasPermission, getCurrentAccess } from "@/lib/auth/permissions";

const tenantId = process.env.SUPABASE_WORKSPACE_TENANT_ID ?? "00000000-0000-4000-8000-000000000001";

export async function GET() {
  const access = await getCurrentAccess();
  if (!access.isAuthenticated || !hasPermission(access, "manage_staff")) {
    return NextResponse.json({ error: "Missing manage_staff permission" }, { status: 403 });
  }

  const supabase = await createClient();
  const [{ data: profiles, error: profilesError }, { data: roles, error: rolesError }] = await Promise.all([
    supabase.from("profiles").select("id,email,full_name,phone,role,status,last_login_at,created_at").order("created_at", { ascending: false }),
    supabase.from("roles").select("id,name,role,role_permissions(permission_key,enabled)")
  ]);

  if (profilesError || rolesError) {
    return NextResponse.json({
      staff: [],
      roles: [],
      backendReady: false,
      error: profilesError?.message ?? rolesError?.message ?? "Supabase staff tables are not ready."
    });
  }

  return NextResponse.json({ staff: profiles ?? [], roles: roles ?? [], backendReady: true });
}

export async function POST(request: Request) {
  const access = await getCurrentAccess();
  if (!access.isAuthenticated || !hasPermission(access, "manage_staff")) {
    return NextResponse.json({ error: "Missing manage_staff permission" }, { status: 403 });
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({
      error: "SUPABASE_SERVICE_ROLE_KEY is required on the server before staff invitations can be sent.",
      needsServiceRole: true
    }, { status: 400 });
  }

  const body = await request.json() as { email?: string; fullName?: string; role?: string; password?: string };
  if (!body.email) return NextResponse.json({ error: "Email is required." }, { status: 400 });

  const password = body.password || `FieldCore-${Math.random().toString(36).slice(2, 10)}!`;
  const role = body.role || "technician";

  const { data, error } = await admin.auth.admin.createUser({
    email: body.email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: body.fullName,
      invited_by: access.email,
      fieldcore_role: role
    }
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await admin.from("profiles").upsert({
    id: data.user.id,
    tenant_id: tenantId,
    email: body.email,
    full_name: body.fullName || body.email,
    role,
    status: "invited"
  });

  await admin.from("staff_invites").upsert({
    tenant_id: tenantId,
    email: body.email,
    full_name: body.fullName,
    role,
    status: "invited",
    invited_by: access.userId
  });

  await admin.from("activity_logs").insert({
    tenant_id: tenantId,
    actor_id: access.userId,
    entity_type: "staff",
    entity_id: data.user.id,
    action: "Staff Invited",
    detail: `${body.email} invited as ${role}`
  });

  return NextResponse.json({ ok: true, user: data.user, temporaryPassword: password });
}

export async function PATCH(request: Request) {
  const access = await getCurrentAccess();
  if (!access.isAuthenticated || !hasPermission(access, "manage_staff")) {
    return NextResponse.json({ error: "Missing manage_staff permission" }, { status: 403 });
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({
      error: "SUPABASE_SERVICE_ROLE_KEY is required on the server before staff records can be edited.",
      needsServiceRole: true
    }, { status: 400 });
  }

  const body = await request.json() as { id?: string; role?: string; status?: string; fullName?: string; phone?: string };
  if (!body.id) return NextResponse.json({ error: "Staff id is required." }, { status: 400 });

  const patch: Record<string, string> = {};
  if (body.role) patch.role = body.role;
  if (body.status) patch.status = body.status;
  if (body.fullName) patch.full_name = body.fullName;
  if (body.phone) patch.phone = body.phone;

  const { error } = await admin.from("profiles").update(patch).eq("id", body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await admin.from("activity_logs").insert({
    tenant_id: tenantId,
    actor_id: access.userId,
    entity_type: "staff",
    entity_id: body.id,
    action: "Staff Updated",
    detail: JSON.stringify(patch)
  });

  return NextResponse.json({ ok: true });
}
