import Link from "next/link";
import { FieldCoreShell } from "@/components/fieldcore-shell";
import { HvacWorkspace } from "@/components/hvac-workspace";
import { Card } from "@/components/ui";
import { getCurrentAccess, hasPermission } from "@/lib/auth/permissions";

export default async function SettingsPage() {
  const access = await getCurrentAccess();
  return (
    <FieldCoreShell title="Settings" subtitle="Company, invoice terms, permissions, staff, pricing, and SaaS workspace settings.">
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Company Settings", "Company profile, service address, terms"],
            ["Invoice Settings", "Numbering, terms, taxes, defaults"],
            ["Material Categories", "Billable parts, markup defaults"],
            ["Security", "Auth, permissions, disabled users"]
          ].map(([title, detail]) => (
            <Card className="p-5" key={title}>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted">{detail}</p>
            </Card>
          ))}
        </section>
        {hasPermission(access, "manage_staff") ? (
          <Card className="p-5">
            <h3 className="font-semibold">Staff & Permissions</h3>
            <p className="mt-2 text-sm text-muted">Invite staff, change roles, disable users, and test permission behavior.</p>
            <Link className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white" href="/settings/staff">Open Staff Management</Link>
          </Card>
        ) : null}
        <HvacWorkspace view="settings" canManageSettings={hasPermission(access, "manage_settings")} />
      </div>
    </FieldCoreShell>
  );
}
