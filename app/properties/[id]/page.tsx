import { FieldCoreShell } from "@/components/fieldcore-shell";
import { PropertyAccountProfile } from "@/components/record-detail-pages";

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <FieldCoreShell title="Property Detail" subtitle="Overview, units, equipment, jobs, invoices, materials, contacts, documents, communication log, revenue, and profit score."><PropertyAccountProfile id={id} /></FieldCoreShell>;
}
