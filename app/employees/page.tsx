import { FieldCoreShell } from "@/components/fieldcore-shell";
import { ProModulePage } from "@/components/pro-module-page";
import { moduleCopy } from "@/lib/fieldcore";

export default function EmployeesPage() {
  return <FieldCoreShell title={moduleCopy.employees.title} subtitle={moduleCopy.employees.subtitle}><ProModulePage module="employees" /></FieldCoreShell>;
}
