import { FieldCoreShell } from "@/components/fieldcore-shell";
import { HvacWorkspace } from "@/components/hvac-workspace";
import { moduleCopy } from "@/lib/fieldcore";

export default function PropertiesPage() {
  return (
    <FieldCoreShell title={moduleCopy.properties.title} subtitle={moduleCopy.properties.subtitle}>
      <HvacWorkspace view="properties" />
    </FieldCoreShell>
  );
}
