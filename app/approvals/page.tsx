import { FieldCoreShell } from "@/components/fieldcore-shell";
import { ProModulePage } from "@/components/pro-module-page";
import { moduleCopy } from "@/lib/fieldcore";

export default function ApprovalsPage() {
  return <FieldCoreShell title={moduleCopy.approvals.title} subtitle={moduleCopy.approvals.subtitle}><ProModulePage module="approvals" /></FieldCoreShell>;
}
