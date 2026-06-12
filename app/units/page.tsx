import { FieldCoreShell } from "@/components/fieldcore-shell";
import { ProModulePage } from "@/components/pro-module-page";
import { moduleCopy } from "@/lib/fieldcore";

export default function UnitsPage() {
  return <FieldCoreShell title={moduleCopy.units.title} subtitle={moduleCopy.units.subtitle}><ProModulePage module="units" /></FieldCoreShell>;
}
