import { FieldCoreShell } from "@/components/fieldcore-shell";
import { ProModulePage } from "@/components/pro-module-page";

export default function ReportsPage() {
  return <FieldCoreShell title="Reports" subtitle="Revenue, property revenue, employee hours, materials, unpaid invoice, overdue invoice, open jobs, profit, approvals, and parts waiting reports."><ProModulePage module="invoices" /></FieldCoreShell>;
}
