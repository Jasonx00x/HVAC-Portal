import { FieldCoreShell } from "@/components/fieldcore-shell";
import { ProModulePage } from "@/components/pro-module-page";
import { moduleCopy } from "@/lib/fieldcore";

export default function EquipmentPage() {
  return <FieldCoreShell title={moduleCopy.equipment.title} subtitle={moduleCopy.equipment.subtitle}><ProModulePage module="equipment" /></FieldCoreShell>;
}
