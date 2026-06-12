import { FieldCoreShell } from "@/components/fieldcore-shell";
import { HvacWorkspace } from "@/components/hvac-workspace";

export default function CalendarPage() {
  return <FieldCoreShell title="Calendar / Dispatch" subtitle="Schedule work days, dispatch technicians, and track blocked jobs by date."><HvacWorkspace view="calendar" /></FieldCoreShell>;
}
