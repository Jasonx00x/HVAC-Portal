import { FieldCoreShell } from "@/components/fieldcore-shell";
import { ProModulePage } from "@/components/pro-module-page";
import { moduleCopy } from "@/lib/fieldcore";

export default function InventoryPage() {
  return <FieldCoreShell title={moduleCopy.inventory.title} subtitle={moduleCopy.inventory.subtitle}><ProModulePage module="inventory" /></FieldCoreShell>;
}
