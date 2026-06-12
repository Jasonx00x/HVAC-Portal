import { FieldCoreShell } from "@/components/fieldcore-shell";
import { HvacWorkspace } from "@/components/hvac-workspace";
import { moduleCopy } from "@/lib/fieldcore";

export default function ResidentialPage() {
  return <FieldCoreShell title={moduleCopy.residential.title} subtitle={moduleCopy.residential.subtitle}><HvacWorkspace view="residential" /></FieldCoreShell>;
}
