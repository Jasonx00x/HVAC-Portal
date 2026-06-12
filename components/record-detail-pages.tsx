"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, Building2, ClipboardList, FileText, Plus } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { importedInvoiceRows } from "@/lib/imported-invoices";

type PropertyRecord = { id: string; name: string; managementCompanyId?: string; address: string; manager: string; phone: string; billingEmail: string; poRule: string; supplier: string; status?: string };
type JobRecord = { id: string; jobNumber: string; propertyId: string; unit: string; serviceType: string; technician: string; status: string; priority?: string; problemReported?: string; diagnosis: string; materials: string; scheduledDate?: string; scheduledTime?: string; poNumber?: string; invoiceStatus?: string; photos?: number };
type InvoiceRecord = { id: string; invoiceNumber: string; jobId?: string; amount: number; status: string; poNumber: string; source?: string; customer?: string; managementCompany?: string; date?: string; serviceDescription?: string; propertyName?: string; cleanupFlags?: string[] };
type SavedRecord = { id: string; module: string; name: string; status: string; owner?: string; notes?: string };
type Workspace = { properties?: PropertyRecord[]; jobs?: JobRecord[]; invoices?: InvoiceRecord[]; records?: SavedRecord[]; importedInvoiceEdits?: Record<string, Partial<InvoiceRecord>>; managementCompanies?: Array<{ id: string; name: string }> };

function workspaceProperties(workspace: Workspace) {
  const properties = workspace.properties ?? [];
  const existing = new Set(properties.map((property) => `${property.name.trim().toLowerCase()}|${property.address.trim().toLowerCase()}`));
  const legacy = (workspace.records ?? [])
    .filter((record) => record.module === "properties")
    .map((record) => ({
      id: record.id,
      managementCompanyId: record.owner?.toLowerCase().includes("jose") ? "mgmt-paradigm" : undefined,
      name: record.name.trim() || "Property name needed",
      address: record.notes || "Address needed",
      manager: record.owner || "Manager needed",
      phone: "Phone needed",
      billingEmail: "Billing email needed",
      poRule: "Confirm PO requirement",
      supplier: "Supplier pickup TBD",
      status: record.status || "Needs cleanup"
    }))
    .filter((property) => {
      const key = `${property.name.trim().toLowerCase()}|${property.address.trim().toLowerCase()}`;
      if (existing.has(key)) return false;
      existing.add(key);
      return true;
    });
  return [...properties, ...legacy];
}

function tone(status = "") {
  const lower = status.toLowerCase();
  if (lower.includes("paid") || lower.includes("completed")) return "success";
  if (lower.includes("waiting") || lower.includes("missing")) return "warning";
  return "info";
}

function DetailTabs({ tabs }: { tabs: string[] }) {
  return <div className="flex flex-wrap gap-2">{tabs.map((tab) => <button className="rounded-md border border-border bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50" key={tab} type="button">{tab}</button>)}</div>;
}

export function JobServiceTicket({ id }: { id: string }) {
  const [workspace, setWorkspace] = useState<Workspace>({});
  useEffect(() => {
    void fetch("/api/workspace", { cache: "no-store" }).then((response) => response.json()).then(setWorkspace);
  }, []);
  const job = workspace.jobs?.find((item) => item.id === id);
  const property = workspace.properties?.find((item) => item.id === job?.propertyId);
  const invoice = workspace.invoices?.find((item) => item.jobId === job?.id);

  if (!job) {
    return <Card className="p-6"><p className="font-semibold">Job not found.</p><Link className="mt-4 inline-flex text-primary" href="/jobs">Back to Jobs</Link></Card>;
  }

  const missingInvoice = job.status === "Completed" && !invoice;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-accent">Service ticket</p>
            <h2 className="mt-1 text-2xl font-bold">{job.jobNumber}</h2>
            <p className="mt-2 text-sm text-muted">{property?.name ?? "Property TBD"} · Unit {job.unit} · {job.scheduledDate ?? "Date TBD"} {job.scheduledTime ?? ""}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge tone={tone(job.status)}>{job.status}</Badge>
            <Badge tone={job.priority === "Emergency" ? "danger" : "info"}>{job.priority ?? "Normal"}</Badge>
          </div>
        </div>
        {missingInvoice ? (
          <div className="mt-5 flex items-center gap-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900">
            <AlertTriangle className="h-4 w-4" />
            Completed job missing invoice.
          </div>
        ) : null}
      </Card>

      <DetailTabs tabs={["Overview", "Diagnosis", "Materials", "Labor", "Photos", "Approval", "Invoice", "Activity Log"]} />

      <section className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <Card className="p-5">
          <h3 className="flex items-center gap-2 font-semibold"><ClipboardList className="h-4 w-4 text-primary" /> Overview</h3>
          <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
            <div><dt className="font-semibold">Issue</dt><dd className="text-muted">{job.problemReported || "Needs issue details"}</dd></div>
            <div><dt className="font-semibold">Service type</dt><dd className="text-muted">{job.serviceType}</dd></div>
            <div><dt className="font-semibold">Technician</dt><dd className="text-muted">{job.technician}</dd></div>
            <div><dt className="font-semibold">PO</dt><dd className="text-muted">{job.poNumber || "Missing"}</dd></div>
            <div><dt className="font-semibold">Diagnosis</dt><dd className="text-muted">{job.diagnosis || "Not added yet"}</dd></div>
            <div><dt className="font-semibold">Materials</dt><dd className="text-muted">{job.materials || "No materials logged"}</dd></div>
          </dl>
        </Card>
        <Card className="p-5">
          <h3 className="flex items-center gap-2 font-semibold"><FileText className="h-4 w-4 text-primary" /> Invoice</h3>
          <p className="mt-3 text-sm text-muted">{invoice ? `${invoice.invoiceNumber} · ${invoice.status} · $${invoice.amount.toLocaleString()}` : "No invoice connected yet."}</p>
          <button className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white" type="button"><Plus className="h-4 w-4" /> Create invoice from job</button>
        </Card>
      </section>
      <Card className="p-5">
        <h3 className="flex items-center gap-2 font-semibold"><Activity className="h-4 w-4 text-primary" /> Activity Log</h3>
        <div className="mt-4 space-y-3 text-sm">
          {["Job created", `Assigned to ${job.technician}`, `Status: ${job.status}`].map((event) => <p className="rounded-md border border-border p-3" key={event}>{event}</p>)}
        </div>
      </Card>
    </div>
  );
}

export function PropertyAccountProfile({ id }: { id: string }) {
  const [workspace, setWorkspace] = useState<Workspace>({});
  useEffect(() => {
    void fetch("/api/workspace", { cache: "no-store" }).then((response) => response.json()).then(setWorkspace);
  }, []);
  const properties = workspaceProperties(workspace);
  const property = properties.find((item) => item.id === id);
  const company = workspace.managementCompanies?.find((item) => item.id === property?.managementCompanyId);
  const jobs = useMemo(() => workspace.jobs?.filter((job) => job.propertyId === id) ?? [], [id, workspace.jobs]);

  if (!property) {
    return <Card className="p-6"><p className="font-semibold">Property not found.</p><Link className="mt-4 inline-flex text-primary" href="/properties">Back to Properties</Link></Card>;
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-accent">Property account</p>
            <h2 className="mt-1 text-2xl font-bold">{property.name}</h2>
            <p className="mt-2 text-sm text-muted">{company?.name ?? "Management company needed"} · {property.address}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white" href="/jobs">New Job</Link>
            <button className="rounded-md border border-border px-3 py-2 text-sm font-semibold" type="button">Edit Property</button>
          </div>
        </div>
      </Card>
      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Open jobs" value={jobs.filter((job) => !["Completed", "Invoiced", "Paid"].includes(job.status)).length.toString()} />
        <Metric label="Units" value="Needs data" />
        <Metric label="Equipment" value="Needs data" />
        <Metric label="Health score" value={jobs.length > 0 ? "Review" : "Needs data"} />
      </div>
      <DetailTabs tabs={["Overview", "Units", "Equipment", "Jobs", "Invoices", "Contacts", "Notes", "Documents", "Communication Log"]} />
      <section className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <Card className="p-5">
          <h3 className="flex items-center gap-2 font-semibold"><Building2 className="h-4 w-4 text-primary" /> Overview</h3>
          <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
            <div><dt className="font-semibold">Manager</dt><dd className="text-muted">{property.manager}</dd></div>
            <div><dt className="font-semibold">Phone</dt><dd className="text-muted">{property.phone}</dd></div>
            <div><dt className="font-semibold">Billing email</dt><dd className="text-muted">{property.billingEmail}</dd></div>
            <div><dt className="font-semibold">PO requirements</dt><dd className="text-muted">{property.poRule}</dd></div>
            <div><dt className="font-semibold">Preferred supplier</dt><dd className="text-muted">{property.supplier}</dd></div>
            <div><dt className="font-semibold">Access notes</dt><dd className="text-muted">Needs source data</dd></div>
          </dl>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold">Communication Log</h3>
          <p className="mt-3 text-sm text-muted">No communication logged yet.</p>
          <button className="mt-4 rounded-md border border-border px-3 py-2 text-sm font-semibold" type="button">Add follow-up</button>
        </Card>
      </section>
    </div>
  );
}

export function InvoiceAccountDetail({ id }: { id: string }) {
  const [workspace, setWorkspace] = useState<Workspace>({});
  useEffect(() => {
    void fetch("/api/workspace", { cache: "no-store" }).then((response) => response.json()).then(setWorkspace);
  }, []);

  const imported = importedInvoiceRows.find((row) => row.id === id);
  const importedInvoice = imported ? {
    ...imported,
    ...(workspace.importedInvoiceEdits?.[id] ?? {})
  } : undefined;
  const portalInvoice = workspace.invoices?.find((item) => item.id === id);
  const legacyRecord = workspace.records?.find((record) => record.id === id && record.module === "invoices");
  const invoice: InvoiceRecord | undefined = portalInvoice
    ?? (legacyRecord ? {
      id: legacyRecord.id,
      invoiceNumber: legacyRecord.name,
      amount: 0,
      status: legacyRecord.status,
      poNumber: legacyRecord.notes ?? "",
      customer: legacyRecord.owner,
      source: "Portal-created"
    } : undefined)
    ?? (importedInvoice ? {
      id: importedInvoice.id,
      invoiceNumber: importedInvoice.invoiceNumber,
      amount: Number(importedInvoice.amount) || 0,
      status: importedInvoice.status ?? "Needs Cleanup",
      poNumber: importedInvoice.poNumber ?? "",
      customer: importedInvoice.customer,
      managementCompany: importedInvoice.managementCompany,
      date: importedInvoice.date,
      serviceDescription: importedInvoice.serviceDescription,
      propertyName: importedInvoice.propertyName,
      cleanupFlags: importedInvoice.cleanupFlags,
      source: "Imported tracker"
    } : undefined);

  if (!invoice) {
    return <Card className="p-6"><p className="font-semibold">Invoice not found.</p><Link className="mt-4 inline-flex text-primary" href="/invoices">Back to Invoices</Link></Card>;
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-accent">{invoice.source ?? "Portal invoice"}</p>
            <h2 className="mt-1 text-2xl font-bold">{invoice.invoiceNumber}</h2>
            <p className="mt-2 text-sm text-muted">{invoice.propertyName ?? invoice.customer ?? "Customer needed"} · {invoice.date ?? "Date needed"}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge tone={tone(invoice.status)}>{invoice.status}</Badge>
            <Badge tone={invoice.poNumber && invoice.poNumber !== "Needs cleanup" ? "success" : "warning"}>{invoice.poNumber || "Missing PO"}</Badge>
          </div>
        </div>
      </Card>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.7fr]">
        <Card className="p-5">
          <h3 className="flex items-center gap-2 font-semibold"><FileText className="h-4 w-4 text-primary" /> Invoice summary</h3>
          <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
            <div><dt className="font-semibold">Customer</dt><dd className="text-muted">{invoice.customer ?? "Needs cleanup"}</dd></div>
            <div><dt className="font-semibold">Property match</dt><dd className="text-muted">{invoice.propertyName ?? "Needs property match"}</dd></div>
            <div><dt className="font-semibold">Management company</dt><dd className="text-muted">{invoice.managementCompany ?? "Needs mapping"}</dd></div>
            <div><dt className="font-semibold">Amount</dt><dd className="text-muted">${invoice.amount.toLocaleString()}</dd></div>
            <div><dt className="font-semibold">Status</dt><dd className="text-muted">{invoice.status}</dd></div>
            <div><dt className="font-semibold">PO</dt><dd className="text-muted">{invoice.poNumber || "Missing"}</dd></div>
            <div className="md:col-span-2"><dt className="font-semibold">Service description</dt><dd className="text-muted">{invoice.serviceDescription || "No description added"}</dd></div>
          </dl>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold">Cleanup checklist</h3>
          <div className="mt-4 space-y-2 text-sm">
            {(invoice.cleanupFlags?.length ? invoice.cleanupFlags : ["Review property, PO, and payment status before final billing."]).map((flag) => (
              <p className="rounded-md border border-border bg-white p-3" key={flag}>{flag}</p>
            ))}
          </div>
          <Link className="mt-4 inline-flex rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white" href="/invoices">Edit in invoice table</Link>
        </Card>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <Card className="p-4"><p className="text-sm font-semibold text-muted">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></Card>;
}
