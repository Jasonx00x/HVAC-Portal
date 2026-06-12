import { FieldCoreShell } from "@/components/fieldcore-shell";
import { StaffPermissions } from "@/components/staff-permissions";

export default function StaffSettingsPage() {
  return <FieldCoreShell title="Staff Management" subtitle="Invite, disable, remove, role-change, and permission-management workspace for Hot & Cool staff."><StaffPermissions /></FieldCoreShell>;
}
