import { DetailPlaceholder } from "@/components/detail-placeholder";
import { FieldCoreShell } from "@/components/fieldcore-shell";

export default function EquipmentDetailPage() {
  return <FieldCoreShell title="Equipment Detail" subtitle="Model, serial, refrigerant, warranty, data plate photo, and related jobs."><DetailPlaceholder module="Equipment" backHref="/equipment" /></FieldCoreShell>;
}
