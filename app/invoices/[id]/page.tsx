import { FieldCoreShell } from "@/components/fieldcore-shell";
import { InvoiceAccountDetail } from "@/components/record-detail-pages";

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <FieldCoreShell title="Invoice Detail" subtitle="Customer, job, property, unit, PO number, line items, status, totals, due date, and payment notes."><InvoiceAccountDetail id={id} /></FieldCoreShell>;
}
