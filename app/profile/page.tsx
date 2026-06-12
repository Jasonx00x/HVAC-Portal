import Link from "next/link";
import { FieldCoreShell } from "@/components/fieldcore-shell";
import { Card } from "@/components/ui";
import { getCurrentAccess } from "@/lib/auth/permissions";

export default async function ProfilePage() {
  const access = await getCurrentAccess();
  const permissions = access.permissions.length > 0 ? access.permissions : [];

  return (
    <FieldCoreShell title="Profile" subtitle="Account, role, session, and permission summary for the current FieldCore user.">
      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-950 text-sm font-bold text-white">FC</div>
            <div>
              <h3 className="font-bold">{access.fullName || access.email || "Signed in user"}</h3>
              <p className="text-sm text-muted">{access.email ?? "Email unavailable"}</p>
            </div>
          </div>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-border pb-2">
              <dt className="text-muted">Role</dt>
              <dd className="font-semibold capitalize">{access.role.replace("_", " ")}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-border pb-2">
              <dt className="text-muted">Status</dt>
              <dd className="font-semibold capitalize">{access.status ?? "Active"}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-border pb-2">
              <dt className="text-muted">Session</dt>
              <dd className="font-semibold">{access.isAuthenticated ? "Authenticated" : "Not signed in"}</dd>
            </div>
          </dl>
          <div className="mt-5 flex gap-2">
            <Link className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white" href="/dashboard">Dashboard</Link>
            <Link className="rounded-md border border-border px-4 py-2 text-sm font-semibold" href="/logout">Logout</Link>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-bold">Permissions</h3>
          <p className="mt-1 text-sm text-muted">This controls what the sidebar shows and what protected routes/actions allow.</p>
          {permissions.length === 0 ? (
            <p className="mt-4 rounded-md bg-slate-50 p-3 text-sm text-muted">No permissions loaded for this profile.</p>
          ) : (
            <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {permissions.map((permission) => (
                <span className="rounded-md border border-border bg-white px-3 py-2 text-xs font-semibold text-slate-700" key={permission}>
                  {permission.replaceAll("_", " ")}
                </span>
              ))}
            </div>
          )}
        </Card>
      </div>
    </FieldCoreShell>
  );
}
