"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Plus, Search, Trash2 } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { moduleCopy, type FieldCoreModule } from "@/lib/fieldcore";
import { importedPropertyInvoices, invoiceImportSummary } from "@/lib/mock-data";

type SavedRecord = {
  id: string;
  module: FieldCoreModule;
  name: string;
  status: string;
  notes: string;
  createdAt: string;
  owner?: string;
  amount?: number;
};

type Workspace = {
  records?: SavedRecord[];
  properties?: Array<{ id: string; name: string; address?: string; manager?: string; phone?: string }>;
  jobs?: Array<{ id: string; status: string; serviceType?: string }>;
  invoices?: Array<{ id: string; amount: number; status: string; poNumber?: string }>;
  serviceTypes?: string[];
  [key: string]: unknown;
};

const config: Record<FieldCoreModule, {
  action: string;
  statuses: string[];
  fields: Array<[keyof FormState, string]>;
  sideTitle: string;
  sideItems: string[];
}> = {
  properties: {
    action: "Add property",
    statuses: ["Active", "Needs contacts", "Needs PO rules", "Inactive"],
    fields: [["name", "Property name"], ["owner", "Property manager"], ["notes", "Address, access, parking, PO rules"]],
    sideTitle: "Property operating file",
    sideItems: ["Manager and billing contacts", "Access and parking instructions", "PO and approval rules", "Preferred supplier pickup"]
  },
  units: {
    action: "Add unit",
    statuses: ["Active", "Needs equipment", "Repeat issue", "Inactive"],
    fields: [["name", "Unit number"], ["owner", "Property"], ["notes", "Floor, section, access notes, tenant notes"]],
    sideTitle: "Unit history should show",
    sideItems: ["Equipment tied to the unit", "Job history and callbacks", "Materials and invoices", "Warranty notes and photos"]
  },
  equipment: {
    action: "Add equipment",
    statuses: ["Active", "Missing model", "Missing serial", "Warranty"],
    fields: [["name", "Equipment name/type"], ["owner", "Brand / model"], ["notes", "Serial, refrigerant, tonnage, warranty, data plate notes"]],
    sideTitle: "Equipment requirements",
    sideItems: ["Model and serial number", "Refrigerant and tonnage", "Install/warranty dates", "Data plate photo"]
  },
  jobs: {
    action: "Create work order",
    statuses: ["New", "Scheduled", "In Progress", "Waiting On Parts", "Waiting For Approval", "Completed"],
    fields: [["name", "Problem reported"], ["owner", "Technician"], ["notes", "Property, unit, equipment, priority, PO, approval notes"]],
    sideTitle: "Work order checklist",
    sideItems: ["Assign technician and schedule", "Add diagnosis and work performed", "Track materials and labor", "Create invoice from job"]
  },
  approvals: {
    action: "Add approval",
    statuses: ["Needs Approval", "Estimate Sent", "Approved", "Denied", "Waiting On Manager", "Waiting On Parts"],
    fields: [["name", "Approval request"], ["owner", "Property / manager"], ["notes", "Estimate, PO, approval notes, follow-up"]],
    sideTitle: "Approval controls",
    sideItems: ["Estimate amount", "Sent date and approved date", "Approved by", "PO requirement"]
  },
  materials: {
    action: "Log material",
    statuses: ["Billable", "Added To Invoice", "Not Billable", "Needs Review"],
    fields: [["name", "Material name"], ["owner", "Supplier"], ["notes", "Quantity, unit cost, billable, invoice status"]],
    sideTitle: "Material alerts",
    sideItems: ["Billable but not invoiced", "Supplier and pickup branch", "Inventory impact", "Receipt/photo document"]
  },
  inventory: {
    action: "Add stock item",
    statuses: ["In Stock", "Low Stock", "Out Of Stock", "High Usage"],
    fields: [["name", "Inventory item"], ["owner", "Supplier"], ["notes", "Quantity, reorder level, unit cost, last purchased"]],
    sideTitle: "Inventory controls",
    sideItems: ["Reorder levels", "Out of stock alerts", "High usage analysis", "Preferred supplier"]
  },
  invoices: {
    action: "Create invoice",
    statuses: ["Draft", "Sent", "Approved", "Paid", "Partial", "Overdue"],
    fields: [["name", "Invoice number"], ["owner", "Customer / property"], ["notes", "Job, PO, due date, labor, materials, total"]],
    sideTitle: "Billing safeguards",
    sideItems: ["Completed job missing invoice", "Invoice missing PO", "Billable material not added", "Overdue follow-up"]
  },
  employees: {
    action: "Add staff member",
    statuses: ["Active", "Invited", "Disabled", "Technician"],
    fields: [["name", "Staff name"], ["owner", "Role / hourly rate"], ["notes", "Phone, email, permissions, last login"]],
    sideTitle: "Staff management",
    sideItems: ["Invite user", "Change role and permissions", "Disable or remove user", "View last login"]
  },
  residential: {
    action: "Add client",
    statuses: ["Active", "Scheduled", "Needs Invoice", "Inactive"],
    fields: [["name", "Client name"], ["owner", "Phone / email"], ["notes", "Address, equipment, job notes"]],
    sideTitle: "Residential flow",
    sideItems: ["Client profile", "Equipment and job history", "Materials and labor", "Invoice and payment status"]
  }
};

type FormState = {
  name: string;
  status: string;
  owner: string;
  notes: string;
};

function id(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function needsValue(value?: string) {
  return !value || value.toLowerCase().includes("needed") || value.toLowerCase().includes("tbd") || value.toLowerCase().includes("confirm");
}

function moduleMetrics(module: FieldCoreModule, workspace: Workspace, recordCount: number): Array<[string, string, string]> {
  const moduleRecords = workspace.records?.filter((record) => record.module === module) ?? [];
  const properties = workspace.properties ?? [];
  const jobs = workspace.jobs ?? [];
  const invoices = workspace.invoices ?? [];
  const openJobs = jobs.filter((job) => !["Completed", "Invoiced", "Paid", "Canceled"].includes(job.status)).length;
  const blockedJobs = jobs.filter((job) => job.status.toLowerCase().includes("waiting")).length;
  const localInvoiceTotal = invoices.reduce((sum, invoice) => sum + (Number(invoice.amount) || 0), 0);
  const missingContacts = properties.filter((property) => needsValue(property.address) || needsValue(property.manager) || needsValue(property.phone)).length;

  if (module === "properties") {
    return [
      ["Saved properties", properties.length.toString(), "Editable local Hot & Cool property profiles"],
      ["Need contact data", missingContacts.toString(), "Address, manager, or phone missing"],
      ["Invoice customer clues", importedPropertyInvoices.length.toString(), "From the uploaded invoice tracker"]
    ];
  }

  if (module === "jobs") {
    return [
      ["Saved jobs", jobs.length.toString(), "Local jobs created in this portal"],
      ["Open jobs", openJobs.toString(), "Not completed, invoiced, paid, or canceled"],
      ["Waiting items", blockedJobs.toString(), "Waiting on parts or approval"]
    ];
  }

  if (module === "invoices") {
    return [
      ["Local invoice total", `$${localInvoiceTotal.toLocaleString()}`, "Created in this portal"],
      ["Imported tracker", invoiceImportSummary.totalRevenue, `${invoiceImportSummary.invoiceCount} invoices from workbook`],
      ["Blank/unpaid", invoiceImportSummary.unpaidOrBlank, "Needs payment status cleanup"]
    ];
  }

  if (module === "employees") {
    return [
      ["Known staff", "3", "Jose Alfaro, Angel Alfaro, Oscar Alfaro"],
      ["Saved staff records", recordCount.toString(), "Editable staff/admin entries"],
      ["Permissions", "Local only", "Supabase roles are ready after migration"]
    ];
  }

  return [
    ["Saved records", recordCount.toString(), `Local ${moduleCopy[module].title.toLowerCase()} records`],
    ["Needs source data", moduleRecords.length === 0 ? "Yes" : "Review", "Add only verified Hot & Cool information"],
    ["Backend", "Local JSON", "Supabase writes are not enabled yet"]
  ];
}

export function ProModulePage({ module }: { module: FieldCoreModule }) {
  const copy = moduleCopy[module];
  const moduleConfig = config[module];
  const [workspace, setWorkspace] = useState<Workspace>({});
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("Ready");
  const [form, setForm] = useState<FormState>({
    name: "",
    status: moduleConfig.statuses[0],
    owner: "",
    notes: ""
  });

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/workspace");
      setWorkspace(await response.json());
    }
    void load();
  }, []);

  const records = useMemo(() => {
    const source = (workspace.records ?? []).filter((record) => record.module === module);
    if (!query.trim()) return source;
    const needle = query.toLowerCase();
    return source.filter((record) => `${record.name} ${record.owner ?? ""} ${record.notes}`.toLowerCase().includes(needle));
  }, [workspace.records, module, query]);

  const metrics = useMemo(() => moduleMetrics(module, workspace, records.length), [module, records.length, workspace]);

  async function save(next: Workspace, message: string) {
    setWorkspace(next);
    await fetch("/api/workspace", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next)
    });
    setNotice(message);
  }

  async function addRecord() {
    if (!form.name.trim()) {
      setNotice(`${copy.primary} is required`);
      return;
    }

    const record: SavedRecord = {
      id: id(module),
      module,
      name: form.name,
      status: form.status,
      owner: form.owner,
      notes: form.notes,
      createdAt: new Date().toISOString()
    };

    await save({ ...workspace, records: [record, ...(workspace.records ?? [])] }, `Saved ${form.name}`);
    setForm({ name: "", status: moduleConfig.statuses[0], owner: "", notes: "" });
  }

  async function updateStatus(recordId: string, status: string) {
    await save({
      ...workspace,
      records: (workspace.records ?? []).map((record) => record.id === recordId ? { ...record, status } : record)
    }, `Marked ${status}`);
  }

  async function deleteRecord(recordId: string) {
    await save({
      ...workspace,
      records: (workspace.records ?? []).filter((record) => record.id !== recordId)
    }, "Deleted record");
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        {metrics.map(([label, value, detail]) => (
          <Card className="p-5" key={label}>
            <p className="text-sm font-semibold text-muted">{label}</p>
            <p className="mt-2 text-2xl font-bold">{value}</p>
            <p className="mt-1 text-sm text-muted">{detail}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card className="overflow-hidden">
          <div className="border-b border-border p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-lg font-semibold">{copy.title} workspace</h3>
                <p className="mt-1 text-sm text-muted">{copy.subtitle}</p>
              </div>
              <Badge tone="info">{notice}</Badge>
            </div>
            <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_220px]">
              <label className="flex items-center gap-2 rounded-md border border-border px-3 py-2">
                <Search className="h-4 w-4 text-muted" />
                <input className="min-w-0 flex-1 text-sm outline-none" onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${copy.title.toLowerCase()}`} value={query} />
              </label>
              <div className="rounded-md border border-border px-3 py-2 text-sm text-muted">{records.length} records shown</div>
            </div>
          </div>

          <div className="grid gap-4 border-b border-border bg-slate-50 p-5 lg:grid-cols-2">
            {moduleConfig.fields.map(([key, label]) => (
              <label className={key === "notes" ? "lg:col-span-2" : ""} key={key}>
                <span className="text-xs font-bold uppercase text-muted">{label}</span>
                <input className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} value={form[key]} />
              </label>
            ))}
            <div className="lg:col-span-2">
              <span className="text-xs font-bold uppercase text-muted">Status</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {moduleConfig.statuses.map((status) => (
                  <button className={`rounded-md border px-3 py-2 text-xs font-semibold ${form.status === status ? "border-primary bg-cyan-50 text-primary" : "border-border bg-white hover:bg-slate-50"}`} key={status} onClick={() => setForm((current) => ({ ...current, status }))} type="button">
                    {status}
                  </button>
                ))}
              </div>
            </div>
            <button className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white lg:col-span-2" onClick={addRecord} type="button">
              <Plus className="h-4 w-4" />
              {moduleConfig.action}
            </button>
          </div>

          <div className="divide-y divide-border">
            {records.length === 0 ? <p className="p-6 text-sm text-muted">No records yet. Add one above to test this module.</p> : null}
            {records.map((record) => (
              <article className="p-5" key={record.id}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold">{record.name}</h4>
                      <Badge tone={["Paid", "Completed", "Active", "Approved", "In Stock"].includes(record.status) ? "success" : "warning"}>{record.status}</Badge>
                    </div>
                    <p className="mt-1 text-sm font-medium text-slate-600">{record.owner}</p>
                    <p className="mt-2 max-w-3xl text-sm text-muted">{record.notes || "No notes yet"}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {moduleConfig.statuses.slice(0, 3).map((status) => (
                      <button className="rounded-md border border-border px-3 py-2 text-xs font-semibold hover:bg-slate-50" key={status} onClick={() => updateStatus(record.id, status)} type="button">
                        {status}
                      </button>
                    ))}
                    <button className="rounded-md border border-border px-3 py-2 text-xs font-semibold text-accent hover:bg-rose-50" onClick={() => deleteRecord(record.id)} type="button">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Card>

        <aside className="space-y-4">
          <Card className="p-5">
            <h3 className="font-semibold">{moduleConfig.sideTitle}</h3>
            <div className="mt-4 space-y-3">
              {moduleConfig.sideItems.map((item) => (
                <div className="flex gap-3 rounded-md border border-border p-3 text-sm" key={item}>
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="font-semibold">Next operational step</h3>
            <p className="mt-2 text-sm text-muted">Connect this module to normalized Supabase tables after the baseline migration is applied. Current records are still saved through the workspace bridge for local testing.</p>
            <button className="mt-4 inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white" onClick={() => setNotice("Next step noted")} type="button">
              Review data model
              <ArrowRight className="h-4 w-4" />
            </button>
          </Card>
        </aside>
      </section>
    </div>
  );
}
