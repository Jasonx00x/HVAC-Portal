import Link from "next/link";
import { AlertTriangle, CalendarDays, ClipboardList, DollarSign, FileText, HardHat, PackageSearch, TrendingUp } from "lucide-react";
import { RevenueChart, StatusChart } from "@/components/dashboard-charts";
import { FieldCoreShell } from "@/components/fieldcore-shell";
import { Badge, Card, SectionTitle } from "@/components/ui";
import { alerts, importedPropertyInvoices, invoiceImportSummary, metrics } from "@/lib/mock-data";

const actionCards = [
  { title: "Book work", detail: "Schedule jobs, assign technicians, and manage blocked work.", href: "/calendar", icon: CalendarDays },
  { title: "Create work order", detail: "Open a job with property, unit, equipment, PO, and approval status.", href: "/jobs", icon: ClipboardList },
  { title: "Invoice completed jobs", detail: "Catch missing invoices, missing POs, and unpaid balances.", href: "/invoices", icon: FileText },
  { title: "Technician portal", detail: "Mobile field flow for today's assigned jobs.", href: "/technician/today", icon: HardHat }
];

export default function DashboardPage() {
  return (
    <FieldCoreShell
      title="Hot & Cool Command Center"
      subtitle="Owner-level command view for revenue, unpaid balances, job blockers, technician workload, and invoice leakage."
    >
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {actionCards.map((action) => {
            const Icon = action.icon;
            return (
              <Link className="rounded-lg border border-border bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg" href={action.href} key={action.title}>
                <Icon className="h-5 w-5 text-primary" />
                <h3 className="mt-4 font-semibold">{action.title}</h3>
                <p className="mt-2 text-sm text-muted">{action.detail}</p>
              </Link>
            );
          })}
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {metrics.map((metric) => (
            <Card className="p-5" key={metric.label}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-muted">{metric.label}</p>
                  <p className="mt-2 text-3xl font-bold">{metric.value}</p>
                  <p className="mt-2 text-sm text-muted">{metric.detail}</p>
                </div>
                <Badge tone={metric.tone}>{metric.tone}</Badge>
              </div>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <SectionTitle subtitle="Imported invoice tracker only. Job costs still need real labor/material data." title="Revenue trend" />
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <RevenueChart />
          </Card>
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <SectionTitle subtitle="Paid versus blank/unpaid status from the uploaded tracker." title="Invoice status" />
              <ClipboardList className="h-5 w-5 text-primary" />
            </div>
            <StatusChart />
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <Card className="overflow-hidden">
            <div className="border-b border-border p-5">
              <div className="flex items-center justify-between">
                <SectionTitle subtitle="Money leaks and operational blockers that should be resolved first." title="Priority alerts" />
                <AlertTriangle className="h-5 w-5 text-accent" />
              </div>
            </div>
            <div className="divide-y divide-border">
              {alerts.slice(0, 5).map((alert) => (
                <article className="p-5" key={alert.title}>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{alert.title}</h3>
                    <Badge tone={alert.priority === "High" ? "danger" : "warning"}>{alert.priority}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted">{alert.detail}</p>
                </article>
              ))}
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="border-b border-border p-5">
              <SectionTitle subtitle={invoiceImportSummary.dateRange} title="Imported invoice tracker" />
            </div>
            <div className="grid grid-cols-3 gap-3 border-b border-border p-5 text-sm">
              <div>
                <p className="text-muted">Invoices</p>
                <p className="mt-1 text-xl font-bold">{invoiceImportSummary.invoiceCount}</p>
              </div>
              <div>
                <p className="text-muted">Total</p>
                <p className="mt-1 text-xl font-bold">{invoiceImportSummary.totalRevenue}</p>
              </div>
              <div>
                <p className="text-muted">Blank/unpaid</p>
                <p className="mt-1 text-xl font-bold text-accent">{invoiceImportSummary.unpaidOrBlank}</p>
              </div>
            </div>
            <div className="divide-y divide-border">
              {importedPropertyInvoices.slice(0, 5).map((item) => (
                <article className="p-4" key={item.customer}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">{item.customer}</p>
                      <p className="mt-1 text-xs text-muted">{item.topServices}</p>
                    </div>
                    <p className="text-sm font-bold">{item.total}</p>
                  </div>
                </article>
              ))}
            </div>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card className="p-5">
            <DollarSign className="h-5 w-5 text-primary" />
            <h3 className="mt-3 font-semibold">Owner finance</h3>
            <p className="mt-2 text-sm text-muted">Revenue, unpaid balances, PO gaps, and property profit are owner/admin surfaces.</p>
          </Card>
          <Card className="p-5">
            <PackageSearch className="h-5 w-5 text-primary" />
            <h3 className="mt-3 font-semibold">Office operations</h3>
            <p className="mt-2 text-sm text-muted">Staff manage schedules, properties, approvals, inventory, materials, and invoice prep.</p>
          </Card>
          <Card className="p-5">
            <HardHat className="h-5 w-5 text-primary" />
            <h3 className="mt-3 font-semibold">Technician field app</h3>
            <p className="mt-2 text-sm text-muted">Technicians get a simplified mobile flow for today&apos;s jobs, reports, photos, labor, and materials.</p>
          </Card>
        </section>
      </div>
    </FieldCoreShell>
  );
}
