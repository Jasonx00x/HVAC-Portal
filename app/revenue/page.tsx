import { FieldCoreShell } from "@/components/fieldcore-shell";
import { ProModulePage } from "@/components/pro-module-page";

export default function RevenuePage() {
  return <FieldCoreShell title="Revenue" subtitle="Gross revenue, paid/unpaid revenue, costs, estimated profit, and revenue by property."><ProModulePage module="invoices" /></FieldCoreShell>;
}
