"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCcw, Send, ShieldCheck, UserPlus } from "lucide-react";
import { permissions, type PermissionKey } from "@/lib/fieldcore";
import { Badge, Card } from "@/components/ui";

type RoleRow = {
  id: string;
  name: string;
  role: string;
  role_permissions?: Array<{ permission_key: PermissionKey; enabled: boolean }>;
};

type StaffRow = {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: string;
  status: string;
  last_login_at?: string;
  created_at?: string;
};

type StaffResponse = {
  staff: StaffRow[];
  roles: RoleRow[];
  backendReady: boolean;
  error?: string;
};

const statuses = ["invited", "active", "disabled", "suspended", "pending_verification"];
const roleOptions = ["super_admin", "admin", "office_staff", "technician"];

export function StaffPermissions() {
  const [data, setData] = useState<StaffResponse>({ staff: [], roles: [], backendReady: false });
  const [selectedRole, setSelectedRole] = useState("technician");
  const [notice, setNotice] = useState("Loading staff from Supabase...");
  const [form, setForm] = useState({ email: "", fullName: "", role: "technician", password: "" });

  async function loadStaff() {
    setNotice("Loading staff from Supabase...");
    const response = await fetch("/api/staff", { cache: "no-store" });
    const payload = await response.json() as StaffResponse;
    setData(payload);
    setNotice(payload.error ?? (payload.backendReady ? "Staff records loaded." : "Supabase staff tables are not ready yet."));
  }

  useEffect(() => {
    void loadStaff();
  }, []);

  const selectedPermissions = useMemo(() => {
    const role = data.roles.find((item) => item.role === selectedRole);
    return new Set((role?.role_permissions ?? []).filter((item) => item.enabled).map((item) => item.permission_key));
  }, [data.roles, selectedRole]);

  async function inviteStaff() {
    setNotice("Creating Supabase Auth user...");
    const response = await fetch("/api/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const payload = await response.json() as { error?: string; temporaryPassword?: string };
    if (!response.ok) {
      setNotice(payload.error ?? "Invite failed.");
      return;
    }
    setNotice(`Invite created. Temporary password: ${payload.temporaryPassword}`);
    setForm({ email: "", fullName: "", role: "technician", password: "" });
    await loadStaff();
  }

  async function updateStaff(id: string, patch: Partial<StaffRow>) {
    setNotice("Updating staff record...");
    const response = await fetch("/api/staff", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch })
    });
    const payload = await response.json() as { error?: string };
    if (!response.ok) {
      setNotice(payload.error ?? "Update failed.");
      return;
    }
    setNotice("Staff record updated.");
    await loadStaff();
  }

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold">Staff testing console</h3>
            <p className="mt-1 text-sm text-muted">Invite Supabase Auth users, assign roles, test account status, and verify permissions.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge tone={data.backendReady ? "success" : "warning"}>{data.backendReady ? "Supabase ready" : "Needs migration/service role"}</Badge>
            <button className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold" onClick={loadStaff} type="button">
              <RefreshCcw className="h-4 w-4" />
              Reload
            </button>
          </div>
        </div>
        <p className="mt-4 rounded-md bg-slate-50 px-3 py-2 text-sm text-muted">{notice}</p>
      </Card>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="p-5">
          <h3 className="flex items-center gap-2 font-semibold"><UserPlus className="h-4 w-4 text-primary" /> Invite staff</h3>
          <div className="mt-4 space-y-3">
            <input className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} placeholder="Email" value={form.email} />
            <input className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))} placeholder="Full name" value={form.fullName} />
            <input className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} placeholder="Temporary password, optional" value={form.password} />
            <select className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))} value={form.role}>
              {roleOptions.map((role) => <option key={role} value={role}>{role.replace("_", " ")}</option>)}
            </select>
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white" disabled={!form.email} onClick={inviteStaff} type="button">
              <Send className="h-4 w-4" />
              Invite staff
            </button>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="border-b border-border p-5">
            <h3 className="font-semibold">Staff accounts</h3>
            <p className="mt-1 text-sm text-muted">Use these controls to try role/status changes and verify route protection.</p>
          </div>
          <div className="divide-y divide-border">
            {data.staff.length === 0 ? <p className="p-5 text-sm text-muted">No staff records loaded yet.</p> : null}
            {data.staff.map((staff) => (
              <article className="grid gap-3 p-5 lg:grid-cols-[1fr_180px_180px]" key={staff.id}>
                <div>
                  <p className="font-semibold">{staff.full_name || staff.email}</p>
                  <p className="mt-1 text-sm text-muted">{staff.email}</p>
                  <p className="mt-1 text-xs text-muted">Last login: {staff.last_login_at ? new Date(staff.last_login_at).toLocaleString() : "No login recorded"}</p>
                </div>
                <select className="rounded-md border border-border px-3 py-2 text-sm capitalize" onChange={(event) => updateStaff(staff.id, { role: event.target.value })} value={staff.role}>
                  {roleOptions.map((role) => <option key={role} value={role}>{role.replace("_", " ")}</option>)}
                </select>
                <select className="rounded-md border border-border px-3 py-2 text-sm capitalize" onChange={(event) => updateStaff(staff.id, { status: event.target.value })} value={staff.status}>
                  {statuses.map((status) => <option key={status} value={status}>{status.replace("_", " ")}</option>)}
                </select>
              </article>
            ))}
          </div>
        </Card>
      </section>

      <Card className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="flex items-center gap-2 font-semibold"><ShieldCheck className="h-4 w-4 text-primary" /> Permission matrix</h3>
            <p className="mt-1 text-sm text-muted">Visual route testing: menu items and buttons are hidden when permission is missing.</p>
          </div>
          <select className="rounded-md border border-border px-3 py-2 text-sm capitalize" onChange={(event) => setSelectedRole(event.target.value)} value={selectedRole}>
            {roleOptions.map((role) => <option key={role} value={role}>{role.replace("_", " ")}</option>)}
          </select>
        </div>
        <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {permissions.map((permission) => (
            <div className={`rounded-md border p-3 text-sm ${selectedPermissions.has(permission) ? "border-primary bg-cyan-50 text-primary" : "border-border bg-white text-muted"}`} key={permission}>
              {permission}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
