import Link from "next/link";
import { CheckCircle2, CircleAlert, CircleHelp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

type CheckState = "ok" | "warning" | "info";

function StatusRow({ label, detail, state }: { label: string; detail: string; state: CheckState }) {
  const Icon = state === "ok" ? CheckCircle2 : state === "warning" ? CircleAlert : CircleHelp;
  const color = state === "ok" ? "text-success" : state === "warning" ? "text-accent" : "text-primary";
  return (
    <div className="flex gap-3 rounded-lg border border-border bg-white p-4">
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${color}`} />
      <div>
        <p className="font-semibold">{label}</p>
        <p className="mt-1 text-sm leading-6 text-muted">{detail}</p>
      </div>
    </div>
  );
}

const promoteSql = `-- Run this in Supabase SQL Editor after applying migrations.
insert into public.profiles (id, tenant_id, email, full_name, role, status)
select
  u.id,
  '00000000-0000-4000-8000-000000000001',
  u.email,
  coalesce(u.raw_user_meta_data ->> 'full_name', u.email),
  'super_admin'::public.user_role,
  'active'
from auth.users u
where lower(u.email) = 'alfaroje26@gmail.com'
on conflict (id) do update
set role = 'super_admin'::public.user_role,
    status = 'active',
    email = excluded.email,
    updated_at = now();`;

export default async function SetupPage() {
  const hasUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const hasAnon = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const hasServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
  let userEmail = "Not signed in";
  let profileRole = "No profile loaded";
  let profileStatus = "Unknown";
  let profileError = "";
  let migrationStatus = "Not checked";
  let migrationOk = false;

  if (hasUrl && hasAnon) {
    try {
      const supabase = await createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        userEmail = userData.user.email ?? "Signed in user has no email";
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("email,role,status")
          .eq("id", userData.user.id)
          .maybeSingle();
        profileError = error?.message ?? "";
        profileRole = profile?.role ?? "Missing profile row";
        profileStatus = profile?.status ?? "Missing";
      }

      const { error: migrationError } = await supabase.from("app_workspaces").select("tenant_id").limit(1);
      migrationOk = !migrationError;
      migrationStatus = migrationError ? migrationError.message : "Workspace migration tables are available.";
    } catch (error) {
      migrationStatus = error instanceof Error ? error.message : "Could not connect to Supabase.";
    }
  }

  const isSuperAdmin = profileRole === "super_admin";

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-foreground">
      <section className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-xl border border-border bg-white p-6 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-wide text-accent">FieldCore HVAC</p>
          <h1 className="mt-2 text-2xl font-bold">Setup and Role Diagnostics</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            Use this page when login works but the portal shows the wrong role. It checks the Supabase connection, current profile, migrations, and service-role setup.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white" href="/login">Go to login</Link>
            <Link className="rounded-md border border-border px-4 py-2 text-sm font-semibold" href="/dashboard">Try dashboard</Link>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2">
          <StatusRow label="Supabase URL" detail={hasUrl ? "Configured in .env.local." : "Missing NEXT_PUBLIC_SUPABASE_URL."} state={hasUrl ? "ok" : "warning"} />
          <StatusRow label="Supabase anon key" detail={hasAnon ? "Configured in .env.local." : "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY."} state={hasAnon ? "ok" : "warning"} />
          <StatusRow label="Service role key" detail={hasServiceRole ? "Configured server-side. Staff invites can be created from the portal." : "Missing. You can sign in, but the portal cannot create/invite staff accounts yet."} state={hasServiceRole ? "ok" : "warning"} />
          <StatusRow label="Testing migration" detail={migrationStatus} state={migrationOk ? "ok" : "warning"} />
          <StatusRow label="Current signed-in user" detail={userEmail} state={userEmail === "Not signed in" ? "info" : "ok"} />
          <StatusRow label="Current role" detail={`${profileRole} / ${profileStatus}${profileError ? ` (${profileError})` : ""}`} state={isSuperAdmin ? "ok" : "warning"} />
        </section>

        {!isSuperAdmin ? (
          <div className="rounded-xl border border-border bg-white p-6 shadow-soft">
            <h2 className="text-lg font-semibold">Fix Alfaroje26@gmail.com showing as Technician</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              This happens when the account was created before the migration trigger ran, or the profile row was created with the default technician role. Run this once in Supabase SQL Editor.
            </p>
            <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs leading-6 text-white">{promoteSql}</pre>
          </div>
        ) : null}

        <div className="rounded-xl border border-border bg-white p-6 shadow-soft">
          <h2 className="text-lg font-semibold">What You Need To Test All Views</h2>
          <div className="mt-4 grid gap-3 text-sm text-muted">
            <p>1. Apply both Supabase migrations in source control.</p>
            <p>2. Create or fix `Alfaroje26@gmail.com` as `super_admin` using the SQL above.</p>
            <p>3. Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local` if you want the Staff page to create temporary users for Admin, Office, and Technician testing.</p>
            <p>4. Go to Settings - Staff, invite test users, assign roles, then log out and log back in as each one.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
