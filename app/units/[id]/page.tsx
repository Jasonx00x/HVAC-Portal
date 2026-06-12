import { DetailPlaceholder } from "@/components/detail-placeholder";
import { FieldCoreShell } from "@/components/fieldcore-shell";

export default function UnitDetailPage() {
  return <FieldCoreShell title="Unit Detail" subtitle="Equipment, job history, materials, invoices, notes, photos, and warranty details."><DetailPlaceholder module="Units" backHref="/units" /></FieldCoreShell>;
}
