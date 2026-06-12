import { FieldCoreShell } from "@/components/fieldcore-shell";
import { HvacWorkspace } from "@/components/hvac-workspace";
import { moduleCopy } from "@/lib/fieldcore";

export default function JobsPage() {
  return (
    <FieldCoreShell title={moduleCopy.jobs.title} subtitle={moduleCopy.jobs.subtitle}>
      <HvacWorkspace view="jobs" />
    </FieldCoreShell>
  );
}
