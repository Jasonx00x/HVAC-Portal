import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  DollarSign,
  FilePlus2,
  PackageSearch,
  ShieldCheck,
  TrendingUp
} from "lucide-react";
import { RevenueChart, StatusChart } from "@/components/dashboard-charts";
import { Sidebar } from "@/components/sidebar";
import { TechnicianMobile } from "@/components/technician-mobile";
import { Badge, Card, SectionTitle } from "@/components/ui";
import { alerts, jobs, metrics, properties } from "@/lib/mock-data";
import type { StatusTone } from "@/lib/types";

const quickActions = [
  { label: "Create job", icon: ClipboardList },
  { label: "Create invoice", icon: FilePlus2 },
  { label: "Add material", icon: PackageSearch },
  { label: "Review approvals", icon: ShieldCheck }
];

function toneForStatus(status: string): StatusTone | "danger" {
  if (status.includes("Completed") || status.includes("Paid")) return "success";
  if (status.includes("Waiting")) return "warning";
  if (status.includes("Emergency")) return "danger";
  return "info";
}

export default function Home() {
  return (
    <main className="min-h-screen lg:flex">
      <Sidebar />
      <section className="min-w-0 flex-1">
        <header className="border-b border-border bg-white px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-accent">Hot & Cool Command Center</p>
              <h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">Owner operations dashboard</h1>
              <p className="mt-2 max-w-3xl text-sm text-muted">
                Apartment-first HVAC workflow for properties, units, equipment, jobs, materials, hours, invoices, revenue, and profit.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button className="inline-flex items-center gap-2 rounded-md border border-border bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50" key={action.label} type="button">
                    <Icon className="h-4 w-4" />
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {metrics.map((metric) => (
              <Card className="p-5" key={metric.label}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-muted">{metric.label}</p>
                    <p className="mt-2 text-3xl font-bold text-foreground">{metric.value}</p>
                    <p className="mt-2 text-sm text-muted">{metric.detail}</p>
                  </div>
                  <Badge tone={metric.tone}>{metric.tone}</Badge>
                </div>
              </Card>
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
            <Card className="p-5">
              <div className="mb-4 flex items-center justify-between gap-4">
                <SectionTitle subtitle="Revenue compared with labor and material costs." title="Revenue and cost trend" />
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <RevenueChart />
            </Card>
            <Card className="p-5">
              <div className="mb-4 flex items-center justify-between gap-4">
                <SectionTitle subtitle="Current job load by operational status." title="Jobs by status" />
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <StatusChart />
            </Card>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
            <Card className="overflow-hidden">
              <div className="border-b border-border p-5">
                <div className="flex items-center justify-between gap-4">
                  <SectionTitle subtitle="Money leaks and operational blockers that need attention." title="Smart alerts" />
                  <AlertTriangle className="h-5 w-5 text-accent" />
                </div>
              </div>
              <div className="divide-y divide-border">
                {alerts.map((alert) => (
                  <article className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between" key={alert.title}>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-foreground">{alert.title}</h3>
                        <Badge tone={alert.priority === "High" ? "danger" : alert.priority === "Medium" ? "warning" : "neutral"}>{alert.priority}</Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted">{alert.detail}</p>
                    </div>
                    <Badge tone="info">{alert.category}</Badge>
                  </article>
                ))}
              </div>
            </Card>

            <TechnicianMobile />
          </section>

          <section className="grid gap-6 2xl:grid-cols-[1.2fr_0.8fr]">
            <Card className="overflow-hidden">
              <div className="border-b border-border p-5">
                <SectionTitle subtitle="Apartment and residential work orders connected to billing." title="Active work orders" />
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-[860px] w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-muted">
                    <tr>
                      <th className="px-5 py-3">Job</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3">Property / Unit</th>
                      <th className="px-5 py-3">Service</th>
                      <th className="px-5 py-3">Technician</th>
                      <th className="px-5 py-3">PO</th>
                      <th className="px-5 py-3">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {jobs.map((job) => (
                      <tr key={job.jobNumber}>
                        <td className="px-5 py-4 font-semibold">{job.jobNumber}</td>
                        <td className="px-5 py-4">
                          <Badge tone={toneForStatus(job.status)}>{job.status}</Badge>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium">{job.property}</p>
                          <p className="text-muted">Unit {job.unit}</p>
                        </td>
                        <td className="px-5 py-4">{job.serviceType}</td>
                        <td className="px-5 py-4">{job.technician}</td>
                        <td className="px-5 py-4">{job.poNumber ?? <span className="text-accent">Missing</span>}</td>
                        <td className="px-5 py-4">{job.invoiceStatus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="border-b border-border p-5">
                <SectionTitle subtitle="Property memory: rules, equipment patterns, unpaid balance, and profitability." title="Property performance" />
              </div>
              <div className="divide-y divide-border">
                {properties.map((property) => (
                  <article className="p-5" key={property.name}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold">{property.name}</h3>
                        <p className="mt-1 text-sm text-muted">Manager: {property.manager}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold uppercase text-muted">Profit score</p>
                        <p className="text-2xl font-bold text-primary">{property.profitScore}</p>
                      </div>
                    </div>
                    <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                      <div>
                        <dt className="font-semibold">Refrigerants</dt>
                        <dd className="text-muted">{property.refrigerants}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Water heaters</dt>
                        <dd className="text-muted">{property.commonWaterHeaters}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold">Unpaid balance</dt>
                        <dd className="text-accent">{property.unpaidBalance}</dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>
            </Card>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["Completed missing invoice", "1", "Create invoice from job"],
              ["Materials not billed", "1", "Add billable line item"],
              ["Overdue invoices", "3", "Follow up with billing contact"],
              ["Employee hours this week", "86.5", "Approve pending timesheets"]
            ].map(([label, value, detail]) => (
              <Card className="p-5" key={label}>
                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-cyan-50 p-2 text-primary">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted">{label}</p>
                    <p className="mt-1 text-2xl font-bold">{value}</p>
                    <p className="mt-1 text-sm text-muted">{detail}</p>
                  </div>
                </div>
              </Card>
            ))}
          </section>
        </div>
      </section>
    </main>
  );
}
