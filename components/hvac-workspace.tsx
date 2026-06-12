"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ClipboardList, GripVertical, Moon, Plus, Search, Settings2, SlidersHorizontal, Sun, Trash2, UserRound } from "lucide-react";
import { importedInvoiceRows, importedInvoiceRowSummary } from "@/lib/imported-invoices";
import { Badge, Card } from "@/components/ui";

type ManagementCompany = {
  id: string;
  name: string;
  contact?: string;
  phone?: string;
  email?: string;
};

type PropertyRecord = {
  id: string;
  name: string;
  managementCompanyId?: string;
  address: string;
  manager: string;
  phone: string;
  billingEmail: string;
  poRule: string;
  supplier: string;
  status?: string;
};

type PropertyManagerRecord = {
  id: string;
  name: string;
  company?: string;
  phone: string;
  email: string;
  notes?: string;
  status?: string;
};

type JobRecord = {
  id: string;
  jobNumber: string;
  jobType?: "commercial" | "residential";
  residentialClientId?: string;
  propertyId: string;
  unit: string;
  serviceType: string;
  technician: string;
  status: string;
  priority?: string;
  problemReported?: string;
  diagnosis: string;
  materials: string;
  scheduledDate?: string;
  scheduledTime?: string;
  poNumber?: string;
  invoiceStatus?: string;
  clockedIn: boolean;
  photos: number;
};

type CrmSettings = {
  companyName: string;
  companyPhone: string;
  companyAddress: string;
  defaultInvoiceTerms: string;
  defaultMaterialMarkup: number;
  defaultLaborRate: number;
  taxRate: number;
  invoicePrefix: string;
  jobPrefix: string;
  themeMode: "light" | "dark";
};

type InvoiceRecord = {
  id: string;
  invoiceNumber: string;
  jobId?: string;
  amount: number;
  status: string;
  poNumber: string;
  source?: "Portal-created" | "Imported tracker";
  customer?: string;
  managementCompany?: string;
  dueDate?: string;
  date?: string;
  serviceDescription?: string;
  propertyName?: string;
  cleanupFlags?: string[];
};

type SavedRecord = {
  id: string;
  module: string;
  name: string;
  status: string;
  owner?: string;
  notes?: string;
  amount?: number;
  createdAt?: string;
};

type WorkspaceState = {
  managementCompanies?: ManagementCompany[];
  propertyManagers?: PropertyManagerRecord[];
  properties: PropertyRecord[];
  jobs: JobRecord[];
  invoices: InvoiceRecord[];
  serviceTypes: string[];
  workflowSteps?: string[];
  residentialPipelineSteps?: string[];
  settings?: Partial<CrmSettings>;
  records?: SavedRecord[];
  importedInvoiceEdits?: Record<string, Partial<InvoiceRecord>>;
  [key: string]: unknown;
};

const defaultServiceTypes = [
  "Diagnostic",
  "AC Repair",
  "Heating Repair",
  "HVAC Installation",
  "Condenser Replacement",
  "Coil Replacement",
  "Compressor Replacement",
  "Refrigerant Charge",
  "Water Heater Repair",
  "Water Heater Replacement",
  "Thermostat Replacement",
  "Preventive Maintenance",
  "Emergency Service",
  "Duct Work",
  "Duct Cleaning",
  "Other"
];

const statusColumns = ["New", "Scheduled", "Arrived", "In Progress", "Waiting On Parts", "Waiting For Approval", "Completed", "Invoiced", "Paid"];
const technicians = ["Angel Alfaro", "Oscar Alfaro", "Jose Alfaro"];
const priorities = ["Low", "Normal", "High", "Emergency"];
const defaultSettings: CrmSettings = {
  companyName: "Hot & Cool Services",
  companyPhone: "",
  companyAddress: "",
  defaultInvoiceTerms: "Net 30",
  defaultMaterialMarkup: 30,
  defaultLaborRate: 95,
  taxRate: 0,
  invoicePrefix: "INV-2026",
  jobPrefix: "HC-2026",
  themeMode: "light"
};

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function keyFor(value = "") {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function dollars(value: number) {
  return `$${Math.round(value).toLocaleString()}`;
}

function invoiceDateValue(invoice: InvoiceRecord) {
  const value = invoice.date ?? invoice.dueDate ?? "";
  const timestamp = value ? new Date(value).getTime() : 0;
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function startOfWeek(date = new Date()) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  next.setDate(next.getDate() - next.getDay());
  return next;
}

function matchesInvoiceDateFilter(invoice: InvoiceRecord, filter: string, from: string, to: string) {
  if (filter === "all") return true;
  const timestamp = invoiceDateValue(invoice);
  if (!timestamp) return false;
  const date = new Date(timestamp);
  const now = new Date();
  if (filter === "week") {
    const start = startOfWeek(now);
    const end = new Date(start);
    end.setDate(start.getDate() + 7);
    return date >= start && date < end;
  }
  if (filter === "month") {
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  }
  if (filter === "custom") {
    const start = from ? new Date(`${from}T00:00:00`) : null;
    const end = to ? new Date(`${to}T23:59:59`) : null;
    return (!start || date >= start) && (!end || date <= end);
  }
  return true;
}

function normalizeWorkflowSteps(value?: string[], fallback = statusColumns) {
  const steps = value?.length ? value : fallback;
  const seen = new Set<string>();
  const clean = steps
    .map((step) => step.trim())
    .filter((step) => {
      if (!step) return false;
      const key = step.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  return clean.length ? clean : fallback;
}

function normalizeWorkspace(input: Partial<WorkspaceState>): WorkspaceState {
  const managementCompanies = input.managementCompanies?.length
    ? input.managementCompanies
    : [{ id: "mgmt-paradigm", name: "Paradigm Companies", contact: "Needs source data" }];

  const properties = input.properties?.length
    ? input.properties.map((property) => ({
      ...property,
      managementCompanyId: property.managementCompanyId ?? (property.name.includes("Meridian") ? "mgmt-paradigm" : undefined),
      status: property.status ?? "Needs cleanup"
    }))
    : [
      {
        id: "prop-meridian-ballston-commons",
        managementCompanyId: "mgmt-paradigm",
        name: "Meridian at Ballston Commons",
        address: "Address needed",
        manager: "Manager needed",
        phone: "Phone needed",
        billingEmail: "Billing email needed",
        poRule: "Confirm PO requirement",
        supplier: "Supplier pickup TBD",
        status: "Needs data"
      },
      {
        id: "prop-meridian-gallery-place",
        managementCompanyId: "mgmt-paradigm",
        name: "Meridian at Gallery Place",
        address: "Address needed",
        manager: "Manager needed",
        phone: "Phone needed",
        billingEmail: "Billing email needed",
        poRule: "Confirm PO requirement",
        supplier: "Supplier pickup TBD",
        status: "Needs data"
      }
    ];
  const legacyProperties = (input.records ?? [])
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
    }));
  const propertyKeys = new Set(properties.map((property) => `${keyFor(property.name)}|${keyFor(property.address)}`));
  const mergedProperties = [
    ...properties,
    ...legacyProperties.filter((property) => {
      const key = `${keyFor(property.name)}|${keyFor(property.address)}`;
      if (propertyKeys.has(key)) return false;
      propertyKeys.add(key);
      return true;
    })
  ];
  const managerKeys = new Set<string>();
  const propertyManagers = [
    ...(Array.isArray(input.propertyManagers) ? input.propertyManagers : mergedProperties
      .filter((property) => property.manager && !property.manager.toLowerCase().includes("needed"))
      .map((property) => ({
        id: `pm-${property.id}`,
        name: property.manager,
        company: managementCompanies.find((company) => company.id === property.managementCompanyId)?.name ?? "",
        phone: property.phone || "Phone needed",
        email: property.billingEmail || "Email needed",
        notes: `Linked from ${property.name}`,
        status: "Active"
      })))
  ].filter((manager) => {
    const key = keyFor(`${manager.name}|${manager.phone}|${manager.email}`);
    if (managerKeys.has(key)) return false;
    managerKeys.add(key);
    return true;
  });
  const settings = { ...defaultSettings, ...(input.settings ?? {}) };

  return {
    ...input,
    managementCompanies,
    propertyManagers,
    properties: mergedProperties,
    jobs: input.jobs ?? [],
    invoices: input.invoices ?? [],
    serviceTypes: input.serviceTypes?.length ? input.serviceTypes : defaultServiceTypes,
    workflowSteps: normalizeWorkflowSteps(input.workflowSteps),
    residentialPipelineSteps: normalizeWorkflowSteps(input.residentialPipelineSteps, ["Lead", "Scheduled", "In Progress", "Needs Invoice", "Invoiced", "Paid"]),
    settings
  };
}

function statusTone(status: string) {
  const lower = status.toLowerCase();
  if (lower.includes("paid") || lower.includes("completed")) return "success";
  if (lower.includes("waiting") || lower.includes("overdue")) return "warning";
  if (lower.includes("cancel")) return "danger";
  return "info";
}

function priorityClass(priority = "Normal") {
  if (priority === "Emergency") return "border-l-accent";
  if (priority === "High") return "border-l-orange-500";
  if (priority === "Low") return "border-l-slate-300";
  return "border-l-primary";
}

function SelectBox({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <span className="text-xs font-bold uppercase text-muted">{label}</span>
      <button className="mt-1 flex w-full items-center justify-between rounded-md border border-border bg-white px-3 py-2 text-left text-sm font-semibold" onClick={() => setOpen((current) => !current)} type="button">
        <span className="truncate">{value || `Select ${label.toLowerCase()}`}</span>
        <span className="text-muted">▾</span>
      </button>
      {open ? (
        <div className="absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-md border border-border bg-white p-1 shadow-lg">
          {options.map((option) => (
            <button className={`block w-full rounded px-3 py-2 text-left text-sm hover:bg-slate-50 ${option === value ? "bg-cyan-50 text-primary" : ""}`} key={option} onClick={() => { onChange(option); setOpen(false); }} type="button">
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function HvacWorkspace({ view, canManageSettings = false }: { view: "jobs" | "calendar" | "properties" | "invoices" | "settings" | "residential"; canManageSettings?: boolean }) {
  const [state, setState] = useState<WorkspaceState>(normalizeWorkspace({}));
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("Ready");
  const [saving, setSaving] = useState(false);
  const [loadingWorkspace, setLoadingWorkspace] = useState(true);
  const [jobForm, setJobForm] = useState({
    propertyId: "",
    unit: "",
    serviceType: "Diagnostic",
    technician: "Angel Alfaro",
    priority: "Normal",
    scheduledDate: new Date().toISOString().slice(0, 10),
    scheduledTime: "09:00",
    problemReported: "",
    poNumber: ""
  });
  const [serviceTypeDraft, setServiceTypeDraft] = useState("");
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [editingManagerId, setEditingManagerId] = useState<string | null>(null);
  const [invoiceFilter, setInvoiceFilter] = useState("all");
  const [invoiceDateFilter, setInvoiceDateFilter] = useState("all");
  const [invoiceSort, setInvoiceSort] = useState("newest");
  const [invoiceDateFrom, setInvoiceDateFrom] = useState("");
  const [invoiceDateTo, setInvoiceDateTo] = useState("");
  const [workflowDraft, setWorkflowDraft] = useState("");
  const [residentialWorkflowDraft, setResidentialWorkflowDraft] = useState("");
  const [calendarDate, setCalendarDate] = useState(new Date().toISOString().slice(0, 10));
  const [propertyDraft, setPropertyDraft] = useState({
    name: "",
    address: "",
    manager: "",
    phone: "",
    billingEmail: "",
    poRule: "Confirm PO requirement",
    supplier: "Supplier pickup TBD",
    managementCompany: "Paradigm Companies"
  });
  const [managerDraft, setManagerDraft] = useState({
    name: "",
    company: "Paradigm Companies",
    phone: "",
    email: "",
    notes: ""
  });
  const [residentialForm, setResidentialForm] = useState({
    name: "",
    owner: "",
    notes: "",
    status: "Lead"
  });

  useEffect(() => {
    async function loadWorkspace() {
      try {
        const response = await fetch("/api/workspace", { cache: "no-store" });
        if (response.ok) {
          const loaded = normalizeWorkspace(await response.json());
          setState(loaded);
          setJobForm((current) => ({ ...current, propertyId: loaded.properties[0]?.id ?? "", serviceType: loaded.serviceTypes[0] ?? "Diagnostic" }));
        }
      } finally {
        setLoadingWorkspace(false);
      }
    }
    void loadWorkspace();
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = state.settings?.themeMode === "dark" ? "dark" : "light";
  }, [state.settings?.themeMode]);

  async function save(next: WorkspaceState, message: string) {
    const normalizedNext = normalizeWorkspace(next);
    setSaving(true);
    setState(normalizedNext);
    await fetch("/api/workspace", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(normalizedNext)
    });
    setNotice(message);
    setSaving(false);
  }

  const propertyById = useMemo(() => new Map(state.properties.map((property) => [property.id, property])), [state.properties]);
  const managementById = useMemo(() => new Map((state.managementCompanies ?? []).map((company) => [company.id, company])), [state.managementCompanies]);
  const pipelineSteps = normalizeWorkflowSteps(state.workflowSteps);
  const residentialPipelineSteps = normalizeWorkflowSteps(state.residentialPipelineSteps, ["Lead", "Scheduled", "In Progress", "Needs Invoice", "Invoiced", "Paid"]);
  const residentialRecords = (state.records ?? []).filter((record) => record.module === "residential");
  const residentialById = useMemo(() => new Map(residentialRecords.map((record) => [record.id, record])), [residentialRecords]);
  const accountNameForJob = (job: JobRecord) => job.jobType === "residential"
    ? residentialById.get(job.residentialClientId ?? "")?.name ?? "Residential client"
    : propertyById.get(job.propertyId)?.name ?? "Property TBD";
  const filteredJobs = useMemo(() => {
    const needle = query.toLowerCase();
    return state.jobs.filter((job) => {
      const accountName = job.jobType === "residential"
        ? residentialById.get(job.residentialClientId ?? "")?.name ?? "Residential client"
        : propertyById.get(job.propertyId)?.name ?? "Property TBD";
      return `${job.jobNumber} ${accountName} ${job.unit} ${job.serviceType} ${job.technician} ${job.problemReported ?? ""}`.toLowerCase().includes(needle);
    });
  }, [propertyById, query, residentialById, state.jobs]);

  const legacyInvoices: InvoiceRecord[] = (state.records ?? [])
    .filter((record) => record.module === "invoices")
    .map((record) => ({
      id: record.id,
      invoiceNumber: record.name,
      amount: 0,
      status: record.status,
      poNumber: record.notes || "",
      source: "Portal-created",
      customer: record.owner || "Legacy invoice record"
    }));
  const importedInvoices: InvoiceRecord[] = importedInvoiceRows.map((row) => {
    const id = row.id;
    return {
      id,
      invoiceNumber: row.invoiceNumber,
      amount: row.amount,
      status: row.status,
      poNumber: row.poNumber,
      source: "Imported tracker",
      customer: row.customer,
      managementCompany: row.managementCompany,
      date: row.date,
      serviceDescription: row.serviceDescription,
      propertyName: row.propertyName,
      cleanupFlags: row.cleanupFlags,
      ...(state.importedInvoiceEdits?.[id] ?? {})
    };
  });
  const allInvoices = [...state.invoices.map((invoice) => ({ ...invoice, source: invoice.source ?? "Portal-created" as const })), ...legacyInvoices, ...importedInvoices];
  const invoicePropertyNames = useMemo(() => Array.from(new Set(importedInvoices.map((invoice) => invoice.propertyName).filter((name): name is string => Boolean(name && !name.toLowerCase().includes("needs"))))).sort((a, b) => a.localeCompare(b)), [importedInvoices]);
  const propertyRevenueByName = useMemo(() => {
    const totals = new Map<string, { revenue: number; cleanup: number; invoices: number }>();
    for (const invoice of allInvoices) {
      const key = invoice.propertyName ?? invoice.customer ?? "Needs mapping";
      const current = totals.get(key) ?? { revenue: 0, cleanup: 0, invoices: 0 };
      current.revenue += invoice.amount;
      current.invoices += 1;
      if (invoice.status !== "Paid" || invoice.poNumber === "Needs cleanup" || invoice.cleanupFlags?.length) current.cleanup += 1;
      totals.set(key, current);
    }
    return totals;
  }, [allInvoices]);
  const residentialInvoices = (state.records ?? []).filter((record) => record.module === "residential-invoices");

  if (loadingWorkspace) {
    return (
      <div className="space-y-4">
        <div className="h-24 animate-pulse rounded-lg border border-border bg-white" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => <div className="h-28 animate-pulse rounded-lg border border-border bg-white" key={item} />)}
        </div>
        <div className="h-96 animate-pulse rounded-lg border border-border bg-white" />
      </div>
    );
  }

  function createJob() {
    if (!jobForm.propertyId || !jobForm.problemReported.trim()) {
      setNotice("Property and problem reported are required.");
      return;
    }
    const nextNumber = `${state.settings?.jobPrefix ?? "HC-2026"}-${String(1001 + state.jobs.length).padStart(4, "0")}`;
    const job: JobRecord = {
      id: createId("job"),
      jobNumber: nextNumber,
      jobType: "commercial",
      propertyId: jobForm.propertyId,
      unit: jobForm.unit || "Unit needed",
      serviceType: jobForm.serviceType,
      technician: jobForm.technician,
      status: pipelineSteps.includes("Scheduled") ? "Scheduled" : pipelineSteps[0] ?? "New",
      priority: jobForm.priority,
      problemReported: jobForm.problemReported,
      scheduledDate: jobForm.scheduledDate,
      scheduledTime: jobForm.scheduledTime,
      poNumber: jobForm.poNumber,
      invoiceStatus: "Not invoiced",
      diagnosis: "",
      materials: "",
      clockedIn: false,
      photos: 0
    };
    void save({ ...state, jobs: [job, ...state.jobs] }, `Created ${job.jobNumber}`);
    setJobForm((current) => ({ ...current, unit: "", problemReported: "", poNumber: "" }));
  }

  function updateJob(jobId: string, patch: Partial<JobRecord>, message = "Job updated") {
    const currentJob = state.jobs.find((job) => job.id === jobId);
    const shouldMoveResidentialToInvoice =
      patch.status === "Completed" &&
      currentJob?.jobType === "residential" &&
      currentJob.residentialClientId;

    void save({
      ...state,
      jobs: state.jobs.map((job) => job.id === jobId ? { ...job, ...patch } : job),
      records: shouldMoveResidentialToInvoice
        ? (state.records ?? []).map((record) => record.id === currentJob.residentialClientId ? { ...record, status: "Needs Invoice" } : record)
        : state.records
    }, message);
  }

  function deleteJob(jobId: string) {
    const job = state.jobs.find((item) => item.id === jobId);
    void save({
      ...state,
      jobs: state.jobs.filter((item) => item.id !== jobId),
      invoices: state.invoices.filter((invoice) => invoice.jobId !== jobId)
    }, `Deleted ${job?.jobNumber ?? "job"}`);
  }

  function moveJobToStatus(jobId: string, status: string) {
    updateJob(jobId, { status }, `Moved job to ${status}`);
  }

  function createInvoiceFromJob(job: JobRecord) {
    const invoice: InvoiceRecord = {
      id: createId("inv"),
      invoiceNumber: `${state.settings?.invoicePrefix ?? "INV-2026"}-${String(5001 + state.invoices.length)}`,
      jobId: job.id,
      amount: 0,
      status: "Draft",
      poNumber: job.poNumber ?? "",
      source: "Portal-created"
    };
    void save({
      ...state,
      invoices: [invoice, ...state.invoices],
      jobs: state.jobs.map((item) => item.id === job.id ? { ...item, status: "Invoiced", invoiceStatus: "Draft" } : item)
    }, `Created ${invoice.invoiceNumber}`);
  }

  function createBlankInvoice() {
    const invoice: InvoiceRecord = {
      id: createId("inv"),
      invoiceNumber: `${state.settings?.invoicePrefix ?? "INV-2026"}-${String(5001 + state.invoices.length).padStart(4, "0")}`,
      amount: 0,
      status: "Draft",
      poNumber: "",
      source: "Portal-created",
      customer: "Customer needed",
      propertyName: "Property needed",
      date: new Date().toISOString().slice(0, 10),
      serviceDescription: "Description needed"
    };
    void save({ ...state, invoices: [invoice, ...state.invoices] }, `Created ${invoice.invoiceNumber}`);
    setEditingInvoiceId(invoice.id);
  }

  function addServiceType() {
    if (!canManageSettings) return;
    const next = serviceTypeDraft.trim();
    if (!next || state.serviceTypes.some((item) => item.toLowerCase() === next.toLowerCase())) return;
    void save({ ...state, serviceTypes: [...state.serviceTypes, next].sort((a, b) => a.localeCompare(b)) }, `Added service type: ${next}`);
    setServiceTypeDraft("");
  }

  function removeServiceType(serviceType: string) {
    if (!canManageSettings) return;
    void save({ ...state, serviceTypes: state.serviceTypes.filter((item) => item !== serviceType) }, `Removed service type: ${serviceType}`);
  }

  function addWorkflowStep() {
    if (!canManageSettings) return;
    const next = workflowDraft.trim();
    if (!next) return;
    if (pipelineSteps.some((step) => step.toLowerCase() === next.toLowerCase())) {
      setNotice(`${next} already exists.`);
      setWorkflowDraft("");
      return;
    }
    void save({ ...state, workflowSteps: [...pipelineSteps, next] }, `Added workflow step: ${next}`);
    setWorkflowDraft("");
  }

  function addResidentialWorkflowStep() {
    if (!canManageSettings) return;
    const next = residentialWorkflowDraft.trim();
    if (!next) return;
    if (residentialPipelineSteps.some((step) => step.toLowerCase() === next.toLowerCase())) {
      setNotice(`${next} already exists.`);
      setResidentialWorkflowDraft("");
      return;
    }
    void save({ ...state, residentialPipelineSteps: [...residentialPipelineSteps, next] }, `Added residential step: ${next}`);
    setResidentialWorkflowDraft("");
  }

  function renameWorkflowStepAt(index: number, nextStep: string, mode: "commercial" | "residential" = "commercial") {
    if (!canManageSettings) return;
    const steps = mode === "residential" ? normalizeWorkflowSteps(state.residentialPipelineSteps, ["Lead", "Scheduled", "In Progress", "Needs Invoice", "Invoiced", "Paid"]) : pipelineSteps;
    const oldStep = steps[index];
    if (!oldStep) return;
    const clean = nextStep.trim();
    if (!clean || clean === oldStep) return;
    const existing = steps.find((step, stepIndex) => step.toLowerCase() === clean.toLowerCase() && stepIndex !== index);
    if (existing) {
      void save({
        ...state,
        [mode === "residential" ? "residentialPipelineSteps" : "workflowSteps"]: steps.filter((_, stepIndex) => stepIndex !== index),
        jobs: state.jobs.map((job) => job.status === oldStep ? { ...job, status: existing } : job)
      }, `Merged ${oldStep} into ${existing}`);
      return;
    }
    void save({
      ...state,
      [mode === "residential" ? "residentialPipelineSteps" : "workflowSteps"]: steps.map((step, stepIndex) => stepIndex === index ? clean : step),
      jobs: state.jobs.map((job) => job.status === oldStep ? { ...job, status: clean } : job)
    }, `Renamed workflow step to ${clean}`);
  }

  function removeWorkflowStepAt(index: number, mode: "commercial" | "residential" = "commercial") {
    if (!canManageSettings) return;
    const steps = mode === "residential" ? normalizeWorkflowSteps(state.residentialPipelineSteps, ["Lead", "Scheduled", "In Progress", "Needs Invoice", "Invoiced", "Paid"]) : pipelineSteps;
    const stepToRemove = steps[index];
    if (!stepToRemove) return;
    if (steps.length <= 1) {
      setNotice("Keep at least one workflow step.");
      return;
    }
    const fallback = steps[index - 1] ?? steps[index + 1] ?? steps[0];
    void save({
      ...state,
      [mode === "residential" ? "residentialPipelineSteps" : "workflowSteps"]: steps.filter((_, stepIndex) => stepIndex !== index),
      jobs: state.jobs.map((job) => job.status === stepToRemove ? { ...job, status: fallback } : job)
    }, `Removed workflow step: ${stepToRemove}`);
  }

  function moveWorkflowStep(index: number, direction: -1 | 1, mode: "commercial" | "residential" = "commercial") {
    if (!canManageSettings) return;
    const steps = mode === "residential" ? normalizeWorkflowSteps(state.residentialPipelineSteps, ["Lead", "Scheduled", "In Progress", "Needs Invoice", "Invoiced", "Paid"]) : pipelineSteps;
    const target = index + direction;
    if (target < 0 || target >= steps.length) return;
    const next = [...steps];
    [next[index], next[target]] = [next[target], next[index]];
    void save({ ...state, [mode === "residential" ? "residentialPipelineSteps" : "workflowSteps"]: next }, "Workflow order updated");
  }

  function updateSettings(patch: Partial<CrmSettings>) {
    void save({ ...state, settings: { ...defaultSettings, ...(state.settings ?? {}), ...patch } }, "Settings updated");
  }

  function createResidentialClient() {
    const name = residentialForm.name.trim();
    if (!name) {
      setNotice("Residential client name is required.");
      return;
    }
    const record: SavedRecord = {
      id: createId("res"),
      module: "residential",
      name,
      owner: residentialForm.owner || "Contact needed",
      notes: residentialForm.notes || "Address/equipment notes needed",
      status: residentialForm.status || residentialPipelineSteps[0],
      createdAt: new Date().toISOString()
    };
    void save({ ...state, records: [record, ...(state.records ?? [])] }, `Added residential client: ${name}`);
    setResidentialForm((current) => ({ ...current, name: "", owner: "", notes: "", status: residentialPipelineSteps[0] ?? "Lead" }));
  }

  function updateResidentialRecord(recordId: string, patch: Partial<SavedRecord>) {
    void save({
      ...state,
      records: (state.records ?? []).map((record) => record.id === recordId ? { ...record, ...patch } : record)
    }, "Residential record updated");
  }

  function deleteResidentialRecord(recordId: string) {
    const record = residentialRecords.find((item) => item.id === recordId);
    void save({
      ...state,
      records: (state.records ?? []).filter((item) => item.id !== recordId && item.owner !== record?.name)
    }, `Deleted ${record?.name ?? "residential record"}`);
  }

  function createResidentialInvoice(client: SavedRecord) {
    const invoice: SavedRecord = {
      id: createId("res-inv"),
      module: "residential-invoices",
      name: `${state.settings?.invoicePrefix ?? "INV-2026"}-R${String(1001 + residentialInvoices.length)}`,
      owner: client.name,
      notes: `Residential invoice for ${client.name}`,
      status: "Draft",
      amount: 0,
      createdAt: new Date().toISOString()
    };
    void save({
      ...state,
      records: [invoice, ...(state.records ?? [])].map((record) => record.id === client.id ? { ...record, status: "Invoiced" } : record)
    }, `Created residential invoice: ${invoice.name}`);
  }

  function createResidentialJob(client: SavedRecord) {
    const nextNumber = `${state.settings?.jobPrefix ?? "HC-2026"}-R${String(1001 + state.jobs.length).padStart(4, "0")}`;
    const job: JobRecord = {
      id: createId("job"),
      jobNumber: nextNumber,
      jobType: "residential",
      residentialClientId: client.id,
      propertyId: "",
      unit: "Residential",
      serviceType: state.serviceTypes[0] ?? "Diagnostic",
      technician: "Angel Alfaro",
      status: pipelineSteps.includes("Scheduled") ? "Scheduled" : pipelineSteps[0] ?? "New",
      priority: "Normal",
      problemReported: client.notes || `Residential service for ${client.name}`,
      scheduledDate: new Date().toISOString().slice(0, 10),
      scheduledTime: "09:00",
      poNumber: "",
      invoiceStatus: "Not invoiced",
      diagnosis: "",
      materials: "",
      clockedIn: false,
      photos: 0
    };
    void save({
      ...state,
      jobs: [job, ...state.jobs],
      records: (state.records ?? []).map((record) => record.id === client.id ? { ...record, status: "Scheduled" } : record)
    }, `Created residential job: ${job.jobNumber}`);
  }

  function updateProperty(propertyId: string, patch: Partial<PropertyRecord>) {
    void save({
      ...state,
      properties: state.properties.map((property) => property.id === propertyId ? { ...property, ...patch } : property)
    }, "Property updated");
  }

  function createProperty() {
    const name = propertyDraft.name.trim();
    if (!name) {
      setNotice("Property name is required.");
      return;
    }
    const managementCompanyId = state.managementCompanies?.find((company) => company.name === propertyDraft.managementCompany)?.id ?? state.managementCompanies?.[0]?.id;
    const property: PropertyRecord = {
      id: createId("prop"),
      managementCompanyId,
      name,
      address: propertyDraft.address || "Address needed",
      manager: propertyDraft.manager || "Manager needed",
      phone: propertyDraft.phone || "Phone needed",
      billingEmail: propertyDraft.billingEmail || "Billing email needed",
      poRule: propertyDraft.poRule || "Confirm PO requirement",
      supplier: propertyDraft.supplier || "Supplier pickup TBD",
      status: "Active"
    };
    void save({ ...state, properties: [property, ...state.properties] }, `Created property: ${property.name}`);
    setEditingPropertyId(property.id);
    setPropertyDraft((current) => ({ ...current, name: "", address: "", manager: "", phone: "", billingEmail: "" }));
  }

  function createPropertyManager() {
    const name = managerDraft.name.trim();
    if (!name) {
      setNotice("Property manager name is required.");
      return;
    }
    const manager: PropertyManagerRecord = {
      id: createId("pm"),
      name,
      company: managerDraft.company,
      phone: managerDraft.phone || "Phone needed",
      email: managerDraft.email || "Email needed",
      notes: managerDraft.notes,
      status: "Active"
    };
    void save({ ...state, propertyManagers: [manager, ...(state.propertyManagers ?? [])] }, `Added manager: ${manager.name}`);
    setManagerDraft((current) => ({ ...current, name: "", phone: "", email: "", notes: "" }));
    setEditingManagerId(manager.id);
  }

  function updatePropertyManager(managerId: string, patch: Partial<PropertyManagerRecord>) {
    void save({
      ...state,
      propertyManagers: (state.propertyManagers ?? []).map((manager) => manager.id === managerId ? { ...manager, ...patch } : manager)
    }, "Property manager updated");
  }

  function deletePropertyManager(managerId: string) {
    const manager = state.propertyManagers?.find((item) => item.id === managerId);
    void save({ ...state, propertyManagers: (state.propertyManagers ?? []).filter((item) => item.id !== managerId) }, `Deleted ${manager?.name ?? "manager"}`);
  }

  function deleteInvoice(invoiceId: string) {
    const invoice = state.invoices.find((item) => item.id === invoiceId);
    const legacyInvoice = (state.records ?? []).find((record) => record.id === invoiceId && record.module === "invoices");
    if (!invoice && !legacyInvoice) {
      setNotice("Imported tracker invoices cannot be deleted here.");
      return;
    }

    void save({
      ...state,
      invoices: state.invoices.filter((item) => item.id !== invoiceId),
      records: (state.records ?? []).filter((record) => record.id !== invoiceId),
      jobs: state.jobs.map((job) => job.id === invoice?.jobId ? { ...job, invoiceStatus: "Not invoiced", status: job.status === "Invoiced" ? "Completed" : job.status } : job)
    }, `Deleted ${invoice?.invoiceNumber ?? legacyInvoice?.name ?? "invoice"}`);
  }

  function updateInvoice(invoiceId: string, patch: Partial<InvoiceRecord>) {
    const portalInvoice = state.invoices.find((item) => item.id === invoiceId);
    const legacyInvoice = (state.records ?? []).find((record) => record.id === invoiceId && record.module === "invoices");

    if (portalInvoice) {
      void save({
        ...state,
        invoices: state.invoices.map((invoice) => invoice.id === invoiceId ? { ...invoice, ...patch, amount: Number(patch.amount ?? invoice.amount) } : invoice)
      }, "Invoice updated");
      return;
    }

    if (legacyInvoice) {
      void save({
        ...state,
        records: (state.records ?? []).map((record) => record.id === invoiceId ? {
          ...record,
          name: patch.invoiceNumber ?? record.name,
          status: patch.status ?? record.status,
          owner: patch.customer ?? record.owner,
          notes: patch.poNumber ?? record.notes
        } : record)
      }, "Legacy invoice updated");
      return;
    }

    void save({
      ...state,
      importedInvoiceEdits: {
        ...(state.importedInvoiceEdits ?? {}),
        [invoiceId]: {
          ...(state.importedInvoiceEdits?.[invoiceId] ?? {}),
          ...patch,
          amount: patch.amount === undefined ? state.importedInvoiceEdits?.[invoiceId]?.amount : Number(patch.amount)
        }
      }
    }, "Imported invoice cleanup updated");
  }

  if (view === "residential") {
    const visibleResidentialRecords = residentialRecords.filter((record) => `${record.name} ${record.owner ?? ""} ${record.notes ?? ""}`.toLowerCase().includes(query.toLowerCase()));
    return (
      <div className="space-y-6">
        <Toolbar title="Residential CRM" query={query} setQuery={setQuery} actionLabel="Add Residential Client" onAction={createResidentialClient} />
        <div className="grid gap-4 md:grid-cols-4">
          <Metric label="Residential clients" value={residentialRecords.length.toString()} />
          <Metric label="Needs invoice" value={residentialRecords.filter((record) => record.status === "Needs Invoice").length.toString()} />
          <Metric label="Residential invoices" value={residentialInvoices.length.toString()} />
          <Metric label="Residential paid" value={residentialInvoices.filter((record) => record.status === "Paid").length.toString()} />
        </div>
        <Card className="p-5">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label><span className="text-xs font-bold uppercase text-muted">Client name *</span><input className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setResidentialForm((current) => ({ ...current, name: event.target.value }))} value={residentialForm.name} /></label>
            <label><span className="text-xs font-bold uppercase text-muted">Phone / email</span><input className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setResidentialForm((current) => ({ ...current, owner: event.target.value }))} value={residentialForm.owner} /></label>
            <SelectBox label="Pipeline status" value={residentialForm.status} onChange={(status) => setResidentialForm((current) => ({ ...current, status }))} options={residentialPipelineSteps} />
            <button className="mt-5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white" onClick={createResidentialClient} type="button">Save Client</button>
            <label className="md:col-span-2 xl:col-span-4"><span className="text-xs font-bold uppercase text-muted">Address / equipment / notes</span><textarea className="mt-1 min-h-20 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setResidentialForm((current) => ({ ...current, notes: event.target.value }))} value={residentialForm.notes} /></label>
          </div>
        </Card>
        <section className="grid gap-4 xl:grid-cols-3 2xl:grid-cols-6">
          {residentialPipelineSteps.map((status) => (
            <div
              className="min-h-48 rounded-lg border border-border bg-white p-3"
              key={status}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                const recordId = event.dataTransfer.getData("text/plain");
                if (recordId) updateResidentialRecord(recordId, { status });
              }}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-sm font-bold">{status}</p>
                <span className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-muted">{visibleResidentialRecords.filter((record) => record.status === status).length}</span>
              </div>
              <div className="space-y-2">
                {visibleResidentialRecords.filter((record) => record.status === status).map((record) => (
                  <article className="cursor-grab rounded-md border border-border bg-slate-50 p-3 text-xs shadow-sm" draggable key={record.id} onDragStart={(event) => event.dataTransfer.setData("text/plain", record.id)}>
                    <p className="font-bold">{record.name}</p>
                    <p className="mt-1 text-muted">{record.owner || "Contact needed"}</p>
                    <p className="mt-1 line-clamp-2">{record.notes || "No notes yet"}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {record.status !== "Invoiced" && record.status !== "Paid" ? <button className="rounded bg-primary px-2 py-1 font-semibold text-white" onClick={() => createResidentialJob(record)} type="button">Create Job</button> : null}
                      {record.status === "Needs Invoice" ? <button className="rounded bg-primary px-2 py-1 font-semibold text-white" onClick={() => createResidentialInvoice(record)} type="button">Invoice</button> : null}
                      <button className="rounded border border-rose-200 bg-white px-2 py-1 font-semibold text-accent" onClick={() => deleteResidentialRecord(record.id)} type="button">Delete</button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </section>
        <Card className="overflow-x-auto">
          <div className="grid min-w-[920px] grid-cols-[1fr_1fr_120px_140px_160px] gap-3 border-b border-border bg-slate-50 p-4 text-xs font-bold uppercase text-muted">
            <span>Invoice</span><span>Client</span><span>Amount</span><span>Status</span><span>Actions</span>
          </div>
          {residentialInvoices.length === 0 ? <EmptyState title="No residential invoices yet" detail="Move a residential client to Needs Invoice, then create an invoice from that client card." /> : null}
          {residentialInvoices.map((invoice) => (
            <div className="grid min-w-[920px] grid-cols-[1fr_1fr_120px_140px_160px] gap-3 border-b border-border p-4 text-sm" key={invoice.id}>
              <p className="font-semibold">{invoice.name}</p>
              <p>{invoice.owner}</p>
              <p>${Number(invoice.amount ?? 0).toLocaleString()}</p>
              <SelectBox label="Status" value={invoice.status} onChange={(status) => updateResidentialRecord(invoice.id, { status })} options={["Draft", "Sent", "Paid", "Overdue", "Canceled"]} />
              <button className="rounded-md border border-rose-200 px-3 py-2 text-xs font-semibold text-accent hover:bg-rose-50" onClick={() => updateResidentialRecord(invoice.id, { status: "Canceled" })} type="button">Cancel Invoice</button>
            </div>
          ))}
        </Card>
      </div>
    );
  }

  if (view === "settings") {
    const settings = { ...defaultSettings, ...(state.settings ?? {}) };
    return (
      <div className="space-y-6">
        <Card className="p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold"><Settings2 className="h-5 w-5 text-primary" /> Company settings</h3>
              <p className="mt-1 text-sm text-muted">Saved CRM defaults used by jobs, invoices, pricing, and the portal appearance.</p>
            </div>
            <div className="flex rounded-md border border-border p-1">
              <button className={`inline-flex items-center gap-2 rounded px-3 py-2 text-sm font-semibold ${settings.themeMode === "light" ? "bg-primary text-white" : "hover:bg-slate-50"}`} onClick={() => updateSettings({ themeMode: "light" })} type="button"><Sun className="h-4 w-4" /> Light</button>
              <button className={`inline-flex items-center gap-2 rounded px-3 py-2 text-sm font-semibold ${settings.themeMode === "dark" ? "bg-primary text-white" : "hover:bg-slate-50"}`} onClick={() => updateSettings({ themeMode: "dark" })} type="button"><Moon className="h-4 w-4" /> Dark</button>
            </div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <EditableField label="Company name" value={settings.companyName} onChange={(value) => updateSettings({ companyName: value })} />
            <EditableField label="Company phone" value={settings.companyPhone} onChange={(value) => updateSettings({ companyPhone: value })} />
            <EditableField label="Company address" value={settings.companyAddress} onChange={(value) => updateSettings({ companyAddress: value })} />
            <EditableField label="Invoice terms" value={settings.defaultInvoiceTerms} onChange={(value) => updateSettings({ defaultInvoiceTerms: value })} />
            <NumberField label="Material markup %" value={settings.defaultMaterialMarkup} onChange={(value) => updateSettings({ defaultMaterialMarkup: value })} />
            <NumberField label="Default labor rate" value={settings.defaultLaborRate} onChange={(value) => updateSettings({ defaultLaborRate: value })} />
            <NumberField label="Tax rate %" value={settings.taxRate} onChange={(value) => updateSettings({ taxRate: value })} />
            <EditableField label="Invoice prefix" value={settings.invoicePrefix} onChange={(value) => updateSettings({ invoicePrefix: value })} />
            <EditableField label="Job prefix" value={settings.jobPrefix} onChange={(value) => updateSettings({ jobPrefix: value })} />
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold"><GripVertical className="h-5 w-5 text-primary" /> Job workflow steps</h3>
              <p className="mt-1 text-sm text-muted">These are the CRM pipeline columns. Removing a step moves those jobs into the first remaining step.</p>
            </div>
            <Badge tone="info">{pipelineSteps.length} steps</Badge>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-[1fr_auto]">
            <input className="rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setWorkflowDraft(event.target.value)} placeholder="Add workflow step, like Awaiting Inspection" value={workflowDraft} />
            <button className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white" onClick={addWorkflowStep} type="button">Add Step</button>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {pipelineSteps.map((step, index) => (
              <WorkflowStepEditor
                key={`${step}-${index}`}
                canMoveDown={index < pipelineSteps.length - 1}
                canMoveUp={index > 0}
                onMoveDown={() => moveWorkflowStep(index, 1)}
                onMoveUp={() => moveWorkflowStep(index, -1)}
                onRemove={() => removeWorkflowStepAt(index)}
                onRename={(value) => renameWorkflowStepAt(index, value)}
                step={step}
              />
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold"><UserRound className="h-5 w-5 text-primary" /> Residential pipeline steps</h3>
              <p className="mt-1 text-sm text-muted">Separate CRM pipeline for residential clients and residential invoices.</p>
            </div>
            <Badge tone="info">{residentialPipelineSteps.length} steps</Badge>
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-[1fr_auto]">
            <input className="rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setResidentialWorkflowDraft(event.target.value)} placeholder="Add residential step, like Estimate Sent" value={residentialWorkflowDraft} />
            <button className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white" onClick={addResidentialWorkflowStep} type="button">Add Step</button>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {residentialPipelineSteps.map((step, index) => (
              <WorkflowStepEditor
                key={`res-${step}-${index}`}
                canMoveDown={index < residentialPipelineSteps.length - 1}
                canMoveUp={index > 0}
                onMoveDown={() => moveWorkflowStep(index, 1, "residential")}
                onMoveUp={() => moveWorkflowStep(index, -1, "residential")}
                onRemove={() => removeWorkflowStepAt(index, "residential")}
                onRename={(value) => renameWorkflowStepAt(index, value, "residential")}
                step={step}
              />
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold"><Settings2 className="h-5 w-5 text-primary" /> Service types</h3>
              <p className="mt-1 text-sm text-muted">Admin-controlled master list. Technicians cannot see or edit this section.</p>
            </div>
            <Badge tone={canManageSettings ? "success" : "danger"}>{canManageSettings ? "Editable" : "Restricted"}</Badge>
          </div>
          {canManageSettings ? (
            <div className="mt-5 grid gap-2 sm:grid-cols-[1fr_auto]">
              <input className="rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setServiceTypeDraft(event.target.value)} placeholder="Add service type" value={serviceTypeDraft} />
              <button className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white" onClick={addServiceType} type="button">Add Service</button>
            </div>
          ) : null}
          <div className="mt-5 flex flex-wrap gap-2">
            {state.serviceTypes.map((serviceType) => (
              <button className="rounded-md border border-border px-3 py-2 text-xs font-semibold hover:bg-slate-50" disabled={!canManageSettings} key={serviceType} onClick={() => removeServiceType(serviceType)} type="button">
                {serviceType}{canManageSettings ? " ×" : ""}
              </button>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (view === "calendar") {
    const selectedDate = new Date(`${calendarDate}T00:00:00`);
    const weekStart = new Date(selectedDate);
    weekStart.setDate(selectedDate.getDate() - ((selectedDate.getDay() + 6) % 7));
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + index);
      return {
        label: date.toLocaleDateString(undefined, { weekday: "short" }),
        date: date.toISOString().slice(0, 10),
        dayNumber: date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
      };
    });
    const moveWeek = (daysToMove: number) => {
      const next = new Date(`${calendarDate}T00:00:00`);
      next.setDate(next.getDate() + daysToMove);
      setCalendarDate(next.toISOString().slice(0, 10));
    };
    return (
      <div className="space-y-6">
        <Toolbar title="Calendar / Dispatch" query={query} setQuery={setQuery} actionLabel="New Work Order" />
        <section className="grid gap-3 md:grid-cols-[auto_auto_auto_1fr]">
          <button className="rounded-md border border-border bg-white px-4 py-3 text-sm font-semibold hover:bg-slate-50" onClick={() => setCalendarDate(new Date().toISOString().slice(0, 10))} type="button">Today</button>
          <button className="rounded-md border border-border bg-white px-4 py-3 text-sm font-semibold hover:bg-slate-50" onClick={() => moveWeek(-7)} type="button">Previous Week</button>
          <button className="rounded-md border border-border bg-white px-4 py-3 text-sm font-semibold hover:bg-slate-50" onClick={() => moveWeek(7)} type="button">Next Week</button>
          <label className="rounded-md border border-border bg-white px-4 py-2 text-sm font-semibold">
            <span className="mr-3 text-muted">Jump to</span>
            <input className="bg-transparent outline-none" onChange={(event) => setCalendarDate(event.target.value)} type="date" value={calendarDate} />
          </label>
        </section>
        <Card className="overflow-x-auto">
          <div className="grid min-w-[980px] grid-cols-7 border-b border-border bg-slate-50 text-sm font-semibold">
            {days.map((day) => <div className="border-r border-border p-3" key={day.date}>{day.label}<span className="ml-2 text-xs text-muted">{day.dayNumber}</span></div>)}
          </div>
          <div className="grid min-h-96 min-w-[980px] grid-cols-7">
            {days.map((day) => (
              <div
                className="space-y-2 border-r border-border p-3"
                key={day.date}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  const jobId = event.dataTransfer.getData("text/plain");
                  if (jobId) updateJob(jobId, { scheduledDate: day.date }, "Job rescheduled");
                }}
              >
                {filteredJobs.filter((job) => job.scheduledDate === day.date).map((job) => (
                    <Link
                      className={`block cursor-grab rounded-md border-l-4 bg-white p-3 text-xs shadow-soft ${priorityClass(job.priority)}`}
                      draggable
                      href={`/jobs/${job.id}`}
                      key={job.id}
                      onDragStart={(event) => event.dataTransfer.setData("text/plain", job.id)}
                    >
                      <p className="font-bold">{job.scheduledTime || "Time TBD"} · {job.jobNumber}</p>
                      <p className="mt-1 text-muted">{accountNameForJob(job)} · {job.unit}</p>
                      <p className="mt-1">{job.technician}</p>
                    </Link>
                ))}
              </div>
            ))}
          </div>
        </Card>
        <DispatchColumns jobs={filteredJobs} propertyById={propertyById} />
      </div>
    );
  }

  if (view === "properties") {
    const visibleProperties = state.properties.filter((property) => `${property.name} ${property.manager} ${property.address}`.toLowerCase().includes(query.toLowerCase()));
    return (
      <div className="space-y-6">
        <Toolbar title="Properties / Accounts" query={query} setQuery={setQuery} actionLabel="New Property" onAction={createProperty} />
        <Card className="p-5">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label><span className="text-xs font-bold uppercase text-muted">Property name *</span><input className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setPropertyDraft((current) => ({ ...current, name: event.target.value }))} value={propertyDraft.name} /></label>
            <label><span className="text-xs font-bold uppercase text-muted">Address</span><input className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setPropertyDraft((current) => ({ ...current, address: event.target.value }))} value={propertyDraft.address} /></label>
            <label><span className="text-xs font-bold uppercase text-muted">Manager</span><input className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setPropertyDraft((current) => ({ ...current, manager: event.target.value }))} value={propertyDraft.manager} /></label>
            <label><span className="text-xs font-bold uppercase text-muted">Phone</span><input className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setPropertyDraft((current) => ({ ...current, phone: event.target.value }))} value={propertyDraft.phone} /></label>
            <label><span className="text-xs font-bold uppercase text-muted">Billing email</span><input className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setPropertyDraft((current) => ({ ...current, billingEmail: event.target.value }))} value={propertyDraft.billingEmail} /></label>
            <label><span className="text-xs font-bold uppercase text-muted">PO rule</span><input className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setPropertyDraft((current) => ({ ...current, poRule: event.target.value }))} value={propertyDraft.poRule} /></label>
            <label><span className="text-xs font-bold uppercase text-muted">Supplier pickup</span><input className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setPropertyDraft((current) => ({ ...current, supplier: event.target.value }))} value={propertyDraft.supplier} /></label>
            <SelectBox label="Management company" value={propertyDraft.managementCompany} onChange={(managementCompany) => setPropertyDraft((current) => ({ ...current, managementCompany }))} options={(state.managementCompanies ?? []).map((company) => company.name)} />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">Add new buildings here. Staff can edit manager, phone, billing, PO, and supplier pickup details later.</p>
            <button className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white" onClick={createProperty} type="button">Save Property</button>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold"><UserRound className="h-5 w-5 text-primary" /> Property managers</h3>
              <p className="mt-1 text-sm text-muted">Add, edit, and remove manager contacts used for building communication and approvals.</p>
            </div>
            <Badge tone="info">{state.propertyManagers?.length ?? 0} contacts</Badge>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <label><span className="text-xs font-bold uppercase text-muted">Name *</span><input className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setManagerDraft((current) => ({ ...current, name: event.target.value }))} value={managerDraft.name} /></label>
            <SelectBox label="Company" value={managerDraft.company} onChange={(company) => setManagerDraft((current) => ({ ...current, company }))} options={(state.managementCompanies ?? []).map((company) => company.name)} />
            <label><span className="text-xs font-bold uppercase text-muted">Phone</span><input className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setManagerDraft((current) => ({ ...current, phone: event.target.value }))} value={managerDraft.phone} /></label>
            <label><span className="text-xs font-bold uppercase text-muted">Email</span><input className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setManagerDraft((current) => ({ ...current, email: event.target.value }))} value={managerDraft.email} /></label>
            <button className="mt-5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white" onClick={createPropertyManager} type="button">Save Manager</button>
            <label className="md:col-span-2 xl:col-span-5"><span className="text-xs font-bold uppercase text-muted">Notes</span><input className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setManagerDraft((current) => ({ ...current, notes: event.target.value }))} value={managerDraft.notes} /></label>
          </div>
          <div className="mt-5 divide-y divide-border rounded-lg border border-border">
            {(state.propertyManagers ?? []).length === 0 ? <p className="p-4 text-sm text-muted">No property managers saved yet.</p> : null}
            {(state.propertyManagers ?? []).map((manager) => (
              <div className="p-4" key={manager.id}>
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="font-semibold">{manager.name}</p>
                    <p className="mt-1 text-sm text-muted">{manager.company || "Company needed"} · {manager.phone} · {manager.email}</p>
                    {manager.notes ? <p className="mt-1 text-sm text-muted">{manager.notes}</p> : null}
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded-md border border-border px-3 py-2 text-xs font-semibold text-primary hover:bg-cyan-50" onClick={() => setEditingManagerId((current) => current === manager.id ? null : manager.id)} type="button">{editingManagerId === manager.id ? "Close" : "Edit"}</button>
                    <button className="rounded-md border border-rose-200 px-3 py-2 text-xs font-semibold text-accent hover:bg-rose-50" onClick={() => deletePropertyManager(manager.id)} type="button">Delete</button>
                  </div>
                </div>
                {editingManagerId === manager.id ? (
                  <div className="mt-4 grid gap-3 bg-slate-50 p-4 md:grid-cols-2 xl:grid-cols-4">
                    <EditableField label="Name" value={manager.name} onChange={(value) => updatePropertyManager(manager.id, { name: value })} />
                    <EditableField label="Company" value={manager.company ?? ""} onChange={(value) => updatePropertyManager(manager.id, { company: value })} />
                    <EditableField label="Phone" value={manager.phone} onChange={(value) => updatePropertyManager(manager.id, { phone: value })} />
                    <EditableField label="Email" value={manager.email} onChange={(value) => updatePropertyManager(manager.id, { email: value })} />
                    <label className="md:col-span-2 xl:col-span-4"><span className="text-xs font-bold uppercase text-muted">Notes</span><input className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => updatePropertyManager(manager.id, { notes: event.target.value })} value={manager.notes ?? ""} /></label>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </Card>
        <div className="grid gap-4 md:grid-cols-4">
          <Metric label="Properties" value={state.properties.length.toString()} />
          <Metric label="Management companies" value={(state.managementCompanies ?? []).length.toString()} />
          <Metric label="Needs contact data" value={state.properties.filter((property) => `${property.address} ${property.manager} ${property.phone}`.toLowerCase().includes("needed")).length.toString()} />
          <Metric label="Matched invoice properties" value={invoicePropertyNames.length.toString()} />
        </div>
        <Card className="overflow-hidden">
          <div className="grid min-w-[1120px] grid-cols-[1.2fr_1fr_1fr_0.6fr_0.7fr_170px] gap-3 border-b border-border bg-slate-50 p-4 text-xs font-bold uppercase text-muted">
            <span>Property</span><span>Management company</span><span>Manager</span><span>Revenue</span><span>Cleanup</span><span>Actions</span>
          </div>
          {visibleProperties.length === 0 ? <EmptyState title="No properties found" detail="Add a property or clear the search to see all buildings." /> : null}
          {visibleProperties.map((property) => (
            <div className="border-b border-border" key={property.id}>
              <div className="grid min-w-[1120px] grid-cols-[1.2fr_1fr_1fr_0.6fr_0.7fr_170px] gap-3 p-4 text-sm">
                <div><p className="font-semibold">{property.name}</p><p className="text-muted">{property.address}</p></div>
                <p>{managementById.get(property.managementCompanyId ?? "")?.name ?? "Needs mapping"}</p>
                <p>{property.manager} · {property.phone}</p>
                <p>{dollars(propertyRevenueByName.get(property.name)?.revenue ?? 0)}</p>
                <p>{propertyRevenueByName.get(property.name)?.cleanup ?? 0} items</p>
                <div className="flex flex-wrap gap-2">
                  <button className="font-semibold text-primary" onClick={() => setEditingPropertyId((current) => current === property.id ? null : property.id)} type="button">
                    {editingPropertyId === property.id ? "Close" : "Edit"}
                  </button>
                  <Link className="font-semibold text-primary" href={`/properties/${property.id}`}>Open</Link>
                </div>
              </div>
              {editingPropertyId === property.id ? (
                <div className="grid gap-3 bg-slate-50 p-4 md:grid-cols-2 xl:grid-cols-3">
                  <EditableField label="Property name" value={property.name} onChange={(value) => updateProperty(property.id, { name: value })} />
                  <EditableField label="Address" value={property.address} onChange={(value) => updateProperty(property.id, { address: value })} />
                  <EditableField label="Manager" value={property.manager} onChange={(value) => updateProperty(property.id, { manager: value })} />
                  <EditableField label="Phone" value={property.phone} onChange={(value) => updateProperty(property.id, { phone: value })} />
                  <EditableField label="Billing email" value={property.billingEmail} onChange={(value) => updateProperty(property.id, { billingEmail: value })} />
                  <EditableField label="PO rule" value={property.poRule} onChange={(value) => updateProperty(property.id, { poRule: value })} />
                  <EditableField label="Supplier pickup" value={property.supplier} onChange={(value) => updateProperty(property.id, { supplier: value })} />
                  <SelectBox
                    label="Management company"
                    value={managementById.get(property.managementCompanyId ?? "")?.name ?? ""}
                    onChange={(name) => updateProperty(property.id, { managementCompanyId: state.managementCompanies?.find((company) => company.name === name)?.id })}
                    options={(state.managementCompanies ?? []).map((company) => company.name)}
                  />
                </div>
              ) : null}
            </div>
          ))}
        </Card>
      </div>
    );
  }

  if (view === "invoices") {
    const total = allInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
    const unpaid = allInvoices.filter((invoice) => invoice.status !== "Paid").reduce((sum, invoice) => sum + invoice.amount, 0);
    const missingPoCount = allInvoices.filter((invoice) => !invoice.poNumber || invoice.poNumber === "Needs cleanup").length;
    const cleanupCount = allInvoices.filter((invoice) => invoice.status !== "Paid" || invoice.cleanupFlags?.length || !invoice.poNumber || invoice.poNumber === "Needs cleanup").length;
    const visibleInvoices = allInvoices.filter((invoice) => {
      const haystack = `${invoice.invoiceNumber} ${invoice.customer ?? ""} ${invoice.propertyName ?? ""} ${invoice.serviceDescription ?? ""} ${invoice.status} ${invoice.poNumber}`.toLowerCase();
      const matchesSearch = haystack.includes(query.toLowerCase());
      const matchesFilter =
        invoiceFilter === "all"
        || (invoiceFilter === "cleanup" && (invoice.status !== "Paid" || Boolean(invoice.cleanupFlags?.length)))
        || (invoiceFilter === "missing-po" && (!invoice.poNumber || invoice.poNumber === "Needs cleanup"))
        || (invoiceFilter === "unpaid" && invoice.status !== "Paid")
        || (invoiceFilter === "imported" && invoice.source === "Imported tracker")
        || (invoiceFilter === "portal" && invoice.source !== "Imported tracker");
      return matchesSearch && matchesFilter && matchesInvoiceDateFilter(invoice, invoiceDateFilter, invoiceDateFrom, invoiceDateTo);
    }).sort((a, b) => {
      if (invoiceSort === "oldest") return invoiceDateValue(a) - invoiceDateValue(b);
      if (invoiceSort === "amount-high") return b.amount - a.amount;
      if (invoiceSort === "amount-low") return a.amount - b.amount;
      if (invoiceSort === "building") return (a.propertyName ?? a.customer ?? "").localeCompare(b.propertyName ?? b.customer ?? "");
      if (invoiceSort === "status") return a.status.localeCompare(b.status);
      return invoiceDateValue(b) - invoiceDateValue(a);
    });
    const visiblePortalInvoiceIds = new Set(visibleInvoices.filter((invoice) => invoice.source !== "Imported tracker").map((invoice) => invoice.id));
    function deleteVisiblePortalInvoices() {
      if (!query.trim()) {
        setNotice("Search first, then delete visible portal invoices. Imported spreadsheet rows stay protected.");
        return;
      }
      if (visiblePortalInvoiceIds.size === 0) {
        setNotice("No portal-created invoices are visible to delete.");
        return;
      }
      void save({
        ...state,
        invoices: state.invoices.filter((invoice) => !visiblePortalInvoiceIds.has(invoice.id)),
        records: (state.records ?? []).filter((record) => !(record.module === "invoices" && visiblePortalInvoiceIds.has(record.id)))
      }, `Deleted ${visiblePortalInvoiceIds.size} visible portal invoice${visiblePortalInvoiceIds.size === 1 ? "" : "s"}`);
    }
    return (
      <div className="space-y-6">
        <Toolbar title="Invoices" query={query} setQuery={setQuery} actionLabel="Create Invoice" onAction={createBlankInvoice} />
        <div className="flex flex-wrap gap-2">
          {[
            ["all", "All"],
            ["cleanup", "Needs Cleanup"],
            ["missing-po", "Missing PO"],
            ["unpaid", "Unpaid"],
            ["imported", "Imported"],
            ["portal", "Portal Created"]
          ].map(([id, label]) => (
            <button className={`rounded-md border px-3 py-2 text-sm font-semibold ${invoiceFilter === id ? "border-primary bg-cyan-50 text-primary" : "border-border bg-white text-slate-700 hover:bg-slate-50"}`} key={id} onClick={() => setInvoiceFilter(id)} type="button">
              {label}
            </button>
          ))}
        </div>
        <Card className="p-4">
          <div className="grid gap-3 lg:grid-cols-5">
            <SelectBox label="Date range" value={{
              all: "All dates",
              week: "This week",
              month: "This month",
              custom: "Custom range"
            }[invoiceDateFilter] ?? "All dates"} onChange={(label) => {
              const next = {
                "All dates": "all",
                "This week": "week",
                "This month": "month",
                "Custom range": "custom"
              }[label] ?? "all";
              setInvoiceDateFilter(next);
            }} options={["All dates", "This week", "This month", "Custom range"]} />
            <SelectBox label="Sort invoices" value={{
              newest: "Newest first",
              oldest: "Oldest first",
              "amount-high": "Amount high to low",
              "amount-low": "Amount low to high",
              building: "Building / customer",
              status: "Status"
            }[invoiceSort] ?? "Newest first"} onChange={(label) => {
              const next = {
                "Newest first": "newest",
                "Oldest first": "oldest",
                "Amount high to low": "amount-high",
                "Amount low to high": "amount-low",
                "Building / customer": "building",
                Status: "status"
              }[label] ?? "newest";
              setInvoiceSort(next);
            }} options={["Newest first", "Oldest first", "Amount high to low", "Amount low to high", "Building / customer", "Status"]} />
            <label>
              <span className="text-xs font-bold uppercase text-muted">From</span>
              <input className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => { setInvoiceDateFrom(event.target.value); setInvoiceDateFilter("custom"); }} type="date" value={invoiceDateFrom} />
            </label>
            <label>
              <span className="text-xs font-bold uppercase text-muted">To</span>
              <input className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => { setInvoiceDateTo(event.target.value); setInvoiceDateFilter("custom"); }} type="date" value={invoiceDateTo} />
            </label>
            <button className="mt-5 rounded-md border border-border px-3 py-2 text-sm font-semibold hover:bg-slate-50" onClick={() => { setInvoiceDateFilter("all"); setInvoiceSort("newest"); setInvoiceDateFrom(""); setInvoiceDateTo(""); }} type="button">
              Reset invoice view
            </button>
          </div>
        </Card>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-white p-4">
          <p className="text-sm text-muted">
            Showing {visibleInvoices.length} invoices sorted by {invoiceSort.replace("-", " ")}. Imported spreadsheet rows are protected from delete.
          </p>
          <button className="rounded-md border border-rose-200 px-3 py-2 text-sm font-semibold text-accent hover:bg-rose-50" onClick={deleteVisiblePortalInvoices} type="button">
            Delete visible portal invoices
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          <Metric label="Total revenue" value={dollars(total)} />
          <Metric label="Imported rows" value={importedInvoiceRowSummary.invoiceCount.toString()} />
          <Metric label="Unpaid / cleanup" value={dollars(unpaid)} />
          <Metric label="Missing PO" value={missingPoCount.toString()} />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Metric label="Portal invoices" value={state.invoices.length.toString()} />
          <Metric label="Cleanup rows" value={cleanupCount.toString()} />
          <Metric label="Matched properties" value={invoicePropertyNames.length.toString()} />
        </div>
        <Card className="overflow-x-auto">
          <div className="grid min-w-[1680px] grid-cols-[120px_130px_110px_220px_1.4fr_110px_130px_130px_210px] gap-4 border-b border-border bg-slate-50 p-4 text-xs font-bold uppercase text-muted">
            <span>Invoice</span><span>Source</span><span>Date</span><span>Property/client</span><span>Description</span><span>Amount</span><span>Status</span><span>PO</span><span>Actions</span>
          </div>
          {visibleInvoices.map((invoice) => {
            const job = state.jobs.find((item) => item.id === invoice.jobId);
            const property = job ? propertyById.get(job.propertyId) : undefined;
            const canDeleteInvoice = invoice.source !== "Imported tracker";
            return (
              <div className="border-b border-border" key={invoice.id}>
                <div className="grid min-w-[1680px] grid-cols-[120px_130px_110px_220px_1.4fr_110px_130px_130px_210px] items-start gap-4 p-4 text-sm">
                  <p className="font-semibold">{invoice.invoiceNumber}</p>
                  <p>{invoice.source}</p>
                  <p>{invoice.date || "Needs date"}</p>
                  <div>
                    <p className="font-medium">{job ? accountNameForJob(job) : property?.name ?? invoice.propertyName ?? invoice.customer ?? "Needs mapping"}</p>
                    <p className="text-xs text-muted">{invoice.customer ?? ""}</p>
                  </div>
                  <p className="leading-5 text-slate-700">{invoice.serviceDescription || "No description"}</p>
                  <p>${invoice.amount.toLocaleString()}</p>
                  <Badge tone={statusTone(invoice.status)}>{invoice.status}</Badge>
                  <p>{invoice.poNumber || "Missing"}</p>
                  <div className="flex items-center gap-2">
                    <button className="min-w-14 rounded-md border border-border px-2.5 py-1.5 text-center text-xs font-semibold text-primary hover:bg-cyan-50" onClick={() => setEditingInvoiceId((current) => current === invoice.id ? null : invoice.id)} type="button">
                      {editingInvoiceId === invoice.id ? "Close" : "Edit"}
                    </button>
                    <Link className="min-w-14 rounded-md border border-border px-2.5 py-1.5 text-center text-xs font-semibold text-primary hover:bg-cyan-50" href={`/invoices/${invoice.id}`}>Open</Link>
                    {canDeleteInvoice ? (
                      <button className="inline-flex min-w-20 items-center justify-center gap-1 rounded-md border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-accent hover:bg-rose-50" onClick={() => deleteInvoice(invoice.id)} type="button">
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    ) : (
                      <span className="min-w-20 rounded-md bg-slate-100 px-2.5 py-1.5 text-center text-xs font-semibold text-muted">Imported</span>
                    )}
                  </div>
                </div>
                {editingInvoiceId === invoice.id ? (
                  <InvoiceEditPanel invoice={invoice} onCancel={() => setEditingInvoiceId(null)} onSave={(patch) => { updateInvoice(invoice.id, patch); setEditingInvoiceId(null); }} />
                ) : null}
              </div>
            );
          })}
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toolbar title="Jobs / Work Orders" query={query} setQuery={setQuery} actionLabel="New Work Order" onAction={createJob} />
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <Metric label="Open jobs" value={state.jobs.filter((job) => !["Completed", "Invoiced", "Paid"].includes(job.status)).length.toString()} />
        <Metric label="Scheduled today" value={state.jobs.filter((job) => job.scheduledDate === new Date().toISOString().slice(0, 10)).length.toString()} />
        <Metric label="Waiting approval" value={state.jobs.filter((job) => job.status === "Waiting For Approval").length.toString()} />
        <Metric label="Waiting parts" value={state.jobs.filter((job) => job.status === "Waiting On Parts").length.toString()} />
        <Metric label="Missing invoice" value={state.jobs.filter((job) => job.status === "Completed" && job.invoiceStatus !== "Draft").length.toString()} />
        <Metric label="Emergency" value={state.jobs.filter((job) => job.priority === "Emergency").length.toString()} />
      </div>
      <Card className="p-5">
        <div className="grid gap-4 lg:grid-cols-4">
          <SelectBox label="Property" value={propertyById.get(jobForm.propertyId)?.name ?? ""} onChange={(name) => setJobForm((current) => ({ ...current, propertyId: state.properties.find((property) => property.name === name)?.id ?? "" }))} options={state.properties.map((property) => property.name)} />
          <SelectBox label="Service type" value={jobForm.serviceType} onChange={(serviceType) => setJobForm((current) => ({ ...current, serviceType }))} options={state.serviceTypes} />
          <SelectBox label="Technician" value={jobForm.technician} onChange={(technician) => setJobForm((current) => ({ ...current, technician }))} options={technicians} />
          <SelectBox label="Priority" value={jobForm.priority} onChange={(priority) => setJobForm((current) => ({ ...current, priority }))} options={priorities} />
          <label><span className="text-xs font-bold uppercase text-muted">Unit</span><input className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm" onChange={(event) => setJobForm((current) => ({ ...current, unit: event.target.value }))} value={jobForm.unit} /></label>
          <label><span className="text-xs font-bold uppercase text-muted">Scheduled date</span><input className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm" onChange={(event) => setJobForm((current) => ({ ...current, scheduledDate: event.target.value }))} type="date" value={jobForm.scheduledDate} /></label>
          <label><span className="text-xs font-bold uppercase text-muted">Time</span><input className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm" onChange={(event) => setJobForm((current) => ({ ...current, scheduledTime: event.target.value }))} type="time" value={jobForm.scheduledTime} /></label>
          <label><span className="text-xs font-bold uppercase text-muted">PO</span><input className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm" onChange={(event) => setJobForm((current) => ({ ...current, poNumber: event.target.value }))} value={jobForm.poNumber} /></label>
          <label className="lg:col-span-3"><span className="text-xs font-bold uppercase text-muted">Problem reported *</span><input className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm" onChange={(event) => setJobForm((current) => ({ ...current, problemReported: event.target.value }))} value={jobForm.problemReported} /></label>
          <button className="mt-5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60" disabled={saving} onClick={createJob} type="button">{saving ? "Saving..." : "Create Work Order"}</button>
        </div>
        <p className="mt-3 text-sm font-semibold text-primary">{notice}</p>
      </Card>
      <Card className="overflow-x-auto">
        <div className="grid min-w-[1260px] grid-cols-[1fr_1.2fr_0.6fr_0.9fr_0.9fr_0.8fr_180px] gap-3 border-b border-border bg-slate-50 p-4 text-xs font-bold uppercase text-muted">
          <span>Job #</span><span>Property / issue</span><span>Unit</span><span>Service</span><span>Status</span><span>Technician</span><span>Actions</span>
        </div>
        {filteredJobs.length === 0 ? <EmptyState title="No jobs yet" detail="Create your first work order to start scheduling technicians." /> : null}
        {filteredJobs.map((job) => (
            <div className="border-b border-border" key={job.id}>
              <div className="grid min-w-[1260px] grid-cols-[1fr_1.2fr_0.6fr_0.9fr_0.9fr_0.8fr_180px] items-start gap-3 p-4 text-sm">
                <p className="font-semibold">{job.jobNumber}</p>
                <div><p className="font-medium">{accountNameForJob(job)}</p><p className="text-muted">{job.problemReported}</p></div>
                <p>{job.unit}</p>
                <p>{job.serviceType}</p>
                <SelectBox label="Status" value={job.status} onChange={(status) => moveJobToStatus(job.id, status)} options={pipelineSteps} />
                <p>{job.technician}</p>
                <div className="flex flex-wrap gap-2">
                  <button className="rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold text-primary hover:bg-cyan-50" onClick={() => setEditingJobId((current) => current === job.id ? null : job.id)} type="button">{editingJobId === job.id ? "Close" : "Edit"}</button>
                  <Link className="rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold text-primary hover:bg-cyan-50" href={`/jobs/${job.id}`}>Open</Link>
                  <button className="rounded-md border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-accent hover:bg-rose-50" onClick={() => deleteJob(job.id)} type="button">Delete</button>
                </div>
              </div>
              {editingJobId === job.id ? (
                <JobEditPanel
                  job={job}
                  pipelineSteps={pipelineSteps}
                  properties={state.properties}
                  serviceTypes={state.serviceTypes}
                  onCancel={() => setEditingJobId(null)}
                  onDelete={() => { deleteJob(job.id); setEditingJobId(null); }}
                  onSave={(patch) => { updateJob(job.id, patch, "Job saved"); setEditingJobId(null); }}
                />
              ) : null}
            </div>
        ))}
      </Card>
      <KanbanBoard jobs={filteredJobs} propertyById={propertyById} pipelineSteps={pipelineSteps} moveJobToStatus={moveJobToStatus} updateJob={updateJob} deleteJob={deleteJob} createInvoiceFromJob={createInvoiceFromJob} />
    </div>
  );
}

function Toolbar({ title, query, setQuery, actionLabel, onAction }: { title: string; query: string; setQuery: (query: string) => void; actionLabel: string; onAction?: () => void }) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-white p-5 shadow-soft lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="mt-1 text-sm text-muted">Find the next action, schedule work, and keep billing from slipping.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <label className="flex min-w-72 items-center gap-2 rounded-md border border-border px-3 py-2">
          <Search className="h-4 w-4 text-muted" />
          <input className="min-w-0 flex-1 text-sm outline-none" onChange={(event) => setQuery(event.target.value)} placeholder="Search" value={query} />
        </label>
        <button className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold" type="button"><SlidersHorizontal className="h-4 w-4" /> Filters</button>
        <button className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white" onClick={onAction} type="button"><Plus className="h-4 w-4" /> {actionLabel}</button>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-4">
      <p className="text-sm font-semibold text-muted">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </Card>
  );
}

function EditableField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label>
      <span className="text-xs font-bold uppercase text-muted">{label}</span>
      <input className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => onChange(event.target.value)} value={value} />
    </label>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label>
      <span className="text-xs font-bold uppercase text-muted">{label}</span>
      <input className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => onChange(Number(event.target.value) || 0)} type="number" value={value} />
    </label>
  );
}

function WorkflowStepEditor({
  step,
  canMoveUp,
  canMoveDown,
  onRename,
  onRemove,
  onMoveUp,
  onMoveDown
}: {
  step: string;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onRename: (value: string) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const [draft, setDraft] = useState(step);

  useEffect(() => {
    setDraft(step);
  }, [step]);

  return (
    <div className="rounded-lg border border-border bg-white p-3">
      <label>
        <span className="text-xs font-bold uppercase text-muted">Step name</span>
        <input className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setDraft(event.target.value)} value={draft} />
      </label>
      <div className="mt-3 flex flex-wrap gap-2">
        <button className="rounded-md border border-border px-3 py-2 text-xs font-semibold text-primary hover:bg-cyan-50" disabled={!draft.trim() || draft.trim() === step} onClick={() => onRename(draft)} type="button">Rename</button>
        <button className="rounded-md border border-border px-3 py-2 text-xs font-semibold hover:bg-slate-50 disabled:opacity-40" disabled={!canMoveUp} onClick={onMoveUp} type="button">Move Up</button>
        <button className="rounded-md border border-border px-3 py-2 text-xs font-semibold hover:bg-slate-50 disabled:opacity-40" disabled={!canMoveDown} onClick={onMoveDown} type="button">Move Down</button>
        <button className="inline-flex items-center gap-2 rounded-md border border-rose-200 px-3 py-2 text-xs font-semibold text-accent hover:bg-rose-50" onClick={onRemove} type="button"><Trash2 className="h-3.5 w-3.5" /> Remove Step</button>
      </div>
    </div>
  );
}

function InvoiceEditPanel({
  invoice,
  onCancel,
  onSave
}: {
  invoice: InvoiceRecord;
  onCancel: () => void;
  onSave: (patch: Partial<InvoiceRecord>) => void;
}) {
  const [draft, setDraft] = useState({
    invoiceNumber: invoice.invoiceNumber,
    customer: invoice.customer ?? "",
    propertyName: invoice.propertyName ?? "",
    date: invoice.date ?? "",
    serviceDescription: invoice.serviceDescription ?? "",
    amount: String(invoice.amount),
    status: invoice.status,
    poNumber: invoice.poNumber,
    dueDate: invoice.dueDate ?? ""
  });

  return (
    <div className="min-w-[1680px] border-t border-border bg-slate-50 p-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <label>
          <span className="text-xs font-bold uppercase text-muted">Invoice #</span>
          <input className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setDraft((current) => ({ ...current, invoiceNumber: event.target.value }))} value={draft.invoiceNumber} />
        </label>
        <label>
          <span className="text-xs font-bold uppercase text-muted">Customer</span>
          <input className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setDraft((current) => ({ ...current, customer: event.target.value }))} value={draft.customer} />
        </label>
        <label>
          <span className="text-xs font-bold uppercase text-muted">Property match</span>
          <input className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setDraft((current) => ({ ...current, propertyName: event.target.value }))} value={draft.propertyName} />
        </label>
        <label>
          <span className="text-xs font-bold uppercase text-muted">Invoice date</span>
          <input className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setDraft((current) => ({ ...current, date: event.target.value }))} type="date" value={draft.date} />
        </label>
        <label>
          <span className="text-xs font-bold uppercase text-muted">Amount</span>
          <input className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setDraft((current) => ({ ...current, amount: event.target.value }))} type="number" value={draft.amount} />
        </label>
        <SelectBox label="Status" value={draft.status} onChange={(status) => setDraft((current) => ({ ...current, status }))} options={["Draft", "Sent", "Approved", "Paid", "Partial", "Overdue", "Canceled", "Needs Cleanup"]} />
        <label>
          <span className="text-xs font-bold uppercase text-muted">PO number</span>
          <input className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setDraft((current) => ({ ...current, poNumber: event.target.value }))} value={draft.poNumber} />
        </label>
        <label>
          <span className="text-xs font-bold uppercase text-muted">Due date</span>
          <input className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setDraft((current) => ({ ...current, dueDate: event.target.value }))} type="date" value={draft.dueDate} />
        </label>
        <label className="md:col-span-2 xl:col-span-4">
          <span className="text-xs font-bold uppercase text-muted">Service description</span>
          <textarea className="mt-1 min-h-24 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setDraft((current) => ({ ...current, serviceDescription: event.target.value }))} value={draft.serviceDescription} />
        </label>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button className="rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-white" onClick={onCancel} type="button">Cancel</button>
        <button
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white"
          onClick={() => onSave({
            invoiceNumber: draft.invoiceNumber,
            customer: draft.customer,
            propertyName: draft.propertyName,
            date: draft.date,
            serviceDescription: draft.serviceDescription,
            amount: Number(draft.amount) || 0,
            status: draft.status,
            poNumber: draft.poNumber,
            dueDate: draft.dueDate
          })}
          type="button"
        >
          Save invoice
        </button>
      </div>
    </div>
  );
}

function JobEditPanel({
  job,
  properties,
  serviceTypes,
  pipelineSteps,
  onCancel,
  onDelete,
  onSave
}: {
  job: JobRecord;
  properties: PropertyRecord[];
  serviceTypes: string[];
  pipelineSteps: string[];
  onCancel: () => void;
  onDelete: () => void;
  onSave: (patch: Partial<JobRecord>) => void;
}) {
  const [draft, setDraft] = useState({
    propertyId: job.propertyId,
    unit: job.unit,
    serviceType: job.serviceType,
    technician: job.technician,
    status: job.status,
    priority: job.priority ?? "Normal",
    scheduledDate: job.scheduledDate ?? "",
    scheduledTime: job.scheduledTime ?? "",
    poNumber: job.poNumber ?? "",
    problemReported: job.problemReported ?? "",
    diagnosis: job.diagnosis,
    materials: job.materials
  });
  const selectedProperty = properties.find((property) => property.id === draft.propertyId);

  return (
    <div className="min-w-[1260px] border-t border-border bg-slate-50 p-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <SelectBox label="Property" value={selectedProperty?.name ?? ""} onChange={(name) => setDraft((current) => ({ ...current, propertyId: properties.find((property) => property.name === name)?.id ?? current.propertyId }))} options={properties.map((property) => property.name)} />
        <SelectBox label="Service type" value={draft.serviceType} onChange={(serviceType) => setDraft((current) => ({ ...current, serviceType }))} options={serviceTypes} />
        <SelectBox label="Status" value={draft.status} onChange={(status) => setDraft((current) => ({ ...current, status }))} options={pipelineSteps} />
        <SelectBox label="Technician" value={draft.technician} onChange={(technician) => setDraft((current) => ({ ...current, technician }))} options={technicians} />
        <SelectBox label="Priority" value={draft.priority} onChange={(priority) => setDraft((current) => ({ ...current, priority }))} options={priorities} />
        <label><span className="text-xs font-bold uppercase text-muted">Unit</span><input className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setDraft((current) => ({ ...current, unit: event.target.value }))} value={draft.unit} /></label>
        <label><span className="text-xs font-bold uppercase text-muted">Scheduled date</span><input className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setDraft((current) => ({ ...current, scheduledDate: event.target.value }))} type="date" value={draft.scheduledDate} /></label>
        <label><span className="text-xs font-bold uppercase text-muted">Scheduled time</span><input className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setDraft((current) => ({ ...current, scheduledTime: event.target.value }))} type="time" value={draft.scheduledTime} /></label>
        <label><span className="text-xs font-bold uppercase text-muted">PO number</span><input className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setDraft((current) => ({ ...current, poNumber: event.target.value }))} value={draft.poNumber} /></label>
        <label className="md:col-span-2 xl:col-span-4"><span className="text-xs font-bold uppercase text-muted">Problem reported</span><input className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setDraft((current) => ({ ...current, problemReported: event.target.value }))} value={draft.problemReported} /></label>
        <label className="md:col-span-2"><span className="text-xs font-bold uppercase text-muted">Diagnosis / report</span><textarea className="mt-1 min-h-24 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setDraft((current) => ({ ...current, diagnosis: event.target.value }))} value={draft.diagnosis} /></label>
        <label className="md:col-span-2"><span className="text-xs font-bold uppercase text-muted">Materials</span><textarea className="mt-1 min-h-24 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary" onChange={(event) => setDraft((current) => ({ ...current, materials: event.target.value }))} value={draft.materials} /></label>
      </div>
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <button className="rounded-md border border-rose-200 px-4 py-2 text-sm font-semibold text-accent hover:bg-rose-50" onClick={onDelete} type="button">Delete job</button>
        <button className="rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-white" onClick={onCancel} type="button">Cancel</button>
        <button className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white" onClick={() => onSave(draft)} type="button">Save job</button>
      </div>
    </div>
  );
}

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="p-8 text-center">
      <ClipboardList className="mx-auto h-8 w-8 text-muted" />
      <p className="mt-3 font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted">{detail}</p>
    </div>
  );
}

function KanbanBoard({
  jobs,
  propertyById,
  pipelineSteps,
  moveJobToStatus,
  updateJob,
  deleteJob,
  createInvoiceFromJob
}: {
  jobs: JobRecord[];
  propertyById: Map<string, PropertyRecord>;
  pipelineSteps: string[];
  moveJobToStatus: (jobId: string, status: string) => void;
  updateJob: (jobId: string, patch: Partial<JobRecord>, message?: string) => void;
  deleteJob: (jobId: string) => void;
  createInvoiceFromJob: (job: JobRecord) => void;
}) {
  return (
    <section className="grid gap-4 xl:grid-cols-4 2xl:grid-cols-8">
      {pipelineSteps.map((status) => (
        <div
          className="min-h-48 rounded-lg border border-border bg-white p-3"
          key={status}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            const jobId = event.dataTransfer.getData("text/plain");
            if (jobId) moveJobToStatus(jobId, status);
          }}
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-sm font-bold">{status}</p>
            <span className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-muted">{jobs.filter((job) => job.status === status).length}</span>
          </div>
          <div className="space-y-2">
            {jobs.filter((job) => job.status === status).map((job) => (
              <article
                className={`cursor-grab rounded-md border-l-4 bg-slate-50 p-3 text-xs shadow-sm active:cursor-grabbing ${priorityClass(job.priority)}`}
                draggable
                key={job.id}
                onDragStart={(event) => event.dataTransfer.setData("text/plain", job.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold">{job.jobNumber}</p>
                  <GripVertical className="h-4 w-4 text-muted" />
                </div>
                <p className="mt-1 text-muted">{propertyById.get(job.propertyId)?.name ?? "Property TBD"}</p>
                <p className="mt-1">{job.serviceType}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {pipelineSteps.filter((nextStatus) => nextStatus !== status).slice(0, 2).map((nextStatus) => (
                    <button className="rounded border border-border bg-white px-2 py-1 font-semibold" key={nextStatus} onClick={() => updateJob(job.id, { status: nextStatus }, `${job.jobNumber} moved to ${nextStatus}`)} type="button">{nextStatus}</button>
                  ))}
                  {job.status === "Completed" ? <button className="rounded bg-primary px-2 py-1 font-semibold text-white" onClick={() => createInvoiceFromJob(job)} type="button">Invoice</button> : null}
                  <button className="rounded border border-rose-200 bg-white px-2 py-1 font-semibold text-accent" onClick={() => deleteJob(job.id)} type="button">Delete</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function DispatchColumns({ jobs, propertyById }: { jobs: JobRecord[]; propertyById: Map<string, PropertyRecord> }) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {technicians.map((technician) => (
        <Card className="p-4" key={technician}>
          <div className="flex items-center gap-2">
            <UserRound className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">{technician}</h3>
          </div>
          <div className="mt-4 space-y-2">
            {jobs.filter((job) => job.technician === technician).map((job) => (
              <Link className="block rounded-md border border-border p-3 text-sm hover:bg-slate-50" href={`/jobs/${job.id}`} key={job.id}>
                <p className="font-semibold">{job.scheduledTime || "Time TBD"} · {job.serviceType}</p>
                <p className="mt-1 text-muted">{propertyById.get(job.propertyId)?.name ?? "Property TBD"} · {job.unit}</p>
              </Link>
            ))}
            {jobs.filter((job) => job.technician === technician).length === 0 ? <p className="text-sm text-muted">No jobs assigned.</p> : null}
          </div>
        </Card>
      ))}
    </section>
  );
}
