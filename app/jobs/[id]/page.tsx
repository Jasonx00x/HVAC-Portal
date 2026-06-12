import { FieldCoreShell } from "@/components/fieldcore-shell";
import { JobServiceTicket } from "@/components/record-detail-pages";

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <FieldCoreShell title="Job Detail" subtitle="Overview, equipment, property, unit, materials, labor, photos, invoice, PO, approval, profit estimate, and activity log."><JobServiceTicket id={id} /></FieldCoreShell>;
}
