import { FieldCoreShell } from "@/components/fieldcore-shell";
import { HvacWorkspace } from "@/components/hvac-workspace";
import { moduleCopy } from "@/lib/fieldcore";

export default function InvoicesPage() {
  return <FieldCoreShell title={moduleCopy.invoices.title} subtitle={moduleCopy.invoices.subtitle}><HvacWorkspace view="invoices" /></FieldCoreShell>;
}
