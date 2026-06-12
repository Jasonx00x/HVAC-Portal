import { FieldCoreShell } from "@/components/fieldcore-shell";
import { ProModulePage } from "@/components/pro-module-page";
import { moduleCopy } from "@/lib/fieldcore";

export default function MaterialsPage() {
  return <FieldCoreShell title={moduleCopy.materials.title} subtitle={moduleCopy.materials.subtitle}><ProModulePage module="materials" /></FieldCoreShell>;
}
