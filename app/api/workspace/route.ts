import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getCurrentAccess, hasPermission, type CurrentAccess } from "@/lib/auth/permissions";
import type { PermissionKey } from "@/lib/fieldcore";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "local-workspace.json");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const workspaceTenantId = process.env.SUPABASE_WORKSPACE_TENANT_ID ?? "00000000-0000-4000-8000-000000000001";

const defaultWorkspace = {
  managementCompanies: [
    {
      id: "mgmt-paradigm",
      name: "Paradigm Companies",
      contact: "Needs source data",
      phone: "Phone needed",
      email: "Email needed"
    }
  ],
  propertyManagers: [],
  properties: [
    {
      id: "prop-meridian-ballston-commons",
      managementCompanyId: "mgmt-paradigm",
      name: "Meridian at Ballston Commons",
      address: "Address needed",
      manager: "Manager needed",
      phone: "Phone needed",
      billingEmail: "Billing email needed",
      poRule: "Confirm PO requirement",
      supplier: "Supplier pickup TBD"
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
      supplier: "Supplier pickup TBD"
    }
  ],
  jobs: [],
  invoices: [],
  workflowSteps: ["New", "Scheduled", "Arrived", "In Progress", "Waiting On Parts", "Waiting For Approval", "Completed", "Invoiced", "Paid"],
  residentialPipelineSteps: ["Lead", "Scheduled", "In Progress", "Needs Invoice", "Invoiced", "Paid"],
  serviceTypes: [
    "Diagnostic",
    "AC Repair",
    "Heating Repair",
    "HVAC Installation",
    "Compressor Replacement",
    "Coil Replacement",
    "Condenser Replacement",
    "Refrigerant Charge",
    "Water Heater Repair",
    "Water Heater Replacement",
    "Thermostat Replacement",
    "Preventive Maintenance",
    "Emergency Service",
    "Duct Work",
    "Duct Cleaning",
    "Other"
  ],
  settings: {
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
  }
};

async function readWorkspace() {
  const sessionWorkspace = await readSessionSupabaseWorkspace();
  if (sessionWorkspace) return normalizeWorkspace(sessionWorkspace as Record<string, unknown>);

  const supabaseWorkspace = await readSupabaseWorkspace();
  if (supabaseWorkspace) return normalizeWorkspace(supabaseWorkspace as Record<string, unknown>);

  try {
    return normalizeWorkspace(JSON.parse(await readFile(dataFile, "utf8")));
  } catch {
    await mkdir(dataDir, { recursive: true });
    await writeFile(dataFile, JSON.stringify(defaultWorkspace, null, 2));
    return defaultWorkspace;
  }
}

function normalizeWorkspace(workspace: Record<string, unknown>) {
  return {
    ...workspace,
    managementCompanies: Array.isArray(workspace.managementCompanies) ? workspace.managementCompanies : defaultWorkspace.managementCompanies,
    propertyManagers: Array.isArray(workspace.propertyManagers) ? workspace.propertyManagers : defaultWorkspace.propertyManagers,
    properties: Array.isArray(workspace.properties) ? workspace.properties : defaultWorkspace.properties,
    jobs: Array.isArray(workspace.jobs) ? workspace.jobs : defaultWorkspace.jobs,
    invoices: Array.isArray(workspace.invoices) ? workspace.invoices : defaultWorkspace.invoices,
    workflowSteps: normalizeWorkflowSteps(workspace.workflowSteps),
    residentialPipelineSteps: normalizeWorkflowSteps(workspace.residentialPipelineSteps, defaultWorkspace.residentialPipelineSteps),
    serviceTypes: Array.isArray(workspace.serviceTypes) && workspace.serviceTypes.length > 0 ? workspace.serviceTypes : defaultWorkspace.serviceTypes,
    settings: { ...defaultWorkspace.settings, ...((workspace.settings && typeof workspace.settings === "object") ? workspace.settings : {}) }
  };
}

function normalizeWorkflowSteps(value: unknown, fallback = defaultWorkspace.workflowSteps) {
  const steps = Array.isArray(value) && value.length > 0 ? value : fallback;
  const seen = new Set<string>();
  const clean = steps
    .map((step) => String(step).trim())
    .filter((step) => {
      if (!step) return false;
      const key = step.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  return clean.length > 0 ? clean : fallback;
}

export async function GET() {
  const workspace = await readWorkspace();
  const access = await getCurrentAccess();
  if (supabaseUrl && !access.isAuthenticated) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }
  return NextResponse.json(scopeWorkspaceForAccess(workspace, access));
}

export async function PUT(request: Request) {
  const access = await getCurrentAccess();
  if (supabaseUrl && !access.isAuthenticated) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const incomingWorkspace = await request.json();
  const rawWorkspace = access.role === "technician"
    ? mergeTechnicianWorkspaceUpdate(await readWorkspace(), incomingWorkspace, access)
    : incomingWorkspace;
  const workspace = normalizeWorkspace(rawWorkspace as Record<string, unknown>);

  if (access.role !== "technician" && supabaseUrl && !canManageWorkspace(access)) {
    return NextResponse.json({ error: "Missing workspace management permission." }, { status: 403 });
  }

  if (await writeSessionSupabaseWorkspace(workspace)) {
    return NextResponse.json({ ok: true, workspace, backend: "supabase-rls" });
  }

  if (await writeSupabaseWorkspace(workspace)) {
    return NextResponse.json({ ok: true, workspace, backend: "supabase" });
  }

  await mkdir(dataDir, { recursive: true });
  await writeFile(dataFile, JSON.stringify(workspace, null, 2));
  return NextResponse.json({ ok: true, workspace, backend: "local-json" });
}

function canManageWorkspace(access: CurrentAccess) {
  return [
    "manage_properties",
    "manage_units",
    "manage_equipment",
    "manage_jobs",
    "manage_calendar",
    "manage_approvals",
    "manage_materials",
    "manage_inventory",
    "manage_invoices",
    "manage_residential",
    "manage_settings"
  ].some((permission) => hasPermission(access, permission as PermissionKey));
}

function technicianNames(access: CurrentAccess) {
  const names = new Set<string>();
  if (access.fullName) names.add(access.fullName.toLowerCase());
  if (access.email) {
    names.add(access.email.toLowerCase());
    names.add(access.email.split("@")[0].replace(/[._-]+/g, " ").toLowerCase());
  }
  return names;
}

function isAssignedTechnician(job: Record<string, unknown>, access: CurrentAccess) {
  const assigned = String(job.technician ?? "").toLowerCase();
  if (!assigned) return false;
  return technicianNames(access).has(assigned) || Array.from(technicianNames(access)).some((name) => assigned.includes(name) || name.includes(assigned));
}

function scopeWorkspaceForAccess(workspace: Record<string, unknown>, access: CurrentAccess) {
  if (access.role !== "technician") return workspace;
  const jobs = Array.isArray(workspace.jobs) ? workspace.jobs.filter((job) => isAssignedTechnician(job as Record<string, unknown>, access)) : [];
  const propertyIds = new Set(jobs.map((job) => String((job as Record<string, unknown>).propertyId ?? "")).filter(Boolean));
  const properties = Array.isArray(workspace.properties)
    ? workspace.properties.filter((property) => propertyIds.has(String((property as Record<string, unknown>).id ?? "")))
    : [];

  return {
    jobs,
    properties,
    workflowSteps: workspace.workflowSteps,
    residentialPipelineSteps: workspace.residentialPipelineSteps,
    serviceTypes: workspace.serviceTypes
  };
}

function mergeTechnicianWorkspaceUpdate(currentWorkspace: Record<string, unknown>, incomingWorkspace: Record<string, unknown>, access: CurrentAccess) {
  const allowedStatuses = new Set(["Arrived", "In Progress", "Waiting On Parts", "Waiting For Approval", "Completed"]);
  const incomingJobs = Array.isArray(incomingWorkspace.jobs) ? incomingWorkspace.jobs : [];
  const incomingById = new Map(incomingJobs.map((job) => [String((job as Record<string, unknown>).id), job as Record<string, unknown>]));
  const completedResidentialClientIds = new Set<string>();
  const jobs = Array.isArray(currentWorkspace.jobs) ? currentWorkspace.jobs.map((job) => {
    const current = job as Record<string, unknown>;
    const incoming = incomingById.get(String(current.id));
    if (!incoming || !isAssignedTechnician(current, access)) return current;
    const nextStatus = String(incoming.status ?? current.status ?? "");
    const allowedStatus = allowedStatuses.has(nextStatus) ? nextStatus : String(current.status ?? "");
    if (allowedStatus === "Completed" && current.jobType === "residential" && current.residentialClientId) {
      completedResidentialClientIds.add(String(current.residentialClientId));
    }
    return {
      ...current,
      diagnosis: String(incoming.diagnosis ?? current.diagnosis ?? ""),
      materials: String(incoming.materials ?? current.materials ?? ""),
      photos: Number(incoming.photos ?? current.photos ?? 0),
      clockedIn: Boolean(incoming.clockedIn ?? current.clockedIn ?? false),
      status: allowedStatus || current.status
    };
  }) : [];
  const records = Array.isArray(currentWorkspace.records) && completedResidentialClientIds.size > 0
    ? currentWorkspace.records.map((record) => {
      const current = record as Record<string, unknown>;
      return completedResidentialClientIds.has(String(current.id)) && current.module === "residential"
        ? { ...current, status: "Needs Invoice" }
        : current;
    })
    : currentWorkspace.records;

  return { ...currentWorkspace, jobs, records };
}

async function readSessionSupabaseWorkspace() {
  if (!supabaseUrl) return null;
  try {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return null;

    const { data, error } = await supabase
      .from("app_workspaces")
      .select("data")
      .eq("tenant_id", workspaceTenantId)
      .maybeSingle();
    if (error) return null;
    if (data?.data && typeof data.data === "object" && Object.keys(data.data).length > 0) return data.data;
    await writeSessionSupabaseWorkspace(defaultWorkspace);
    return defaultWorkspace;
  } catch {
    return null;
  }
}

async function writeSessionSupabaseWorkspace(workspace: unknown) {
  if (!supabaseUrl) return false;
  try {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return false;

    const { error } = await supabase.from("app_workspaces").upsert({
      tenant_id: workspaceTenantId,
      data: workspace,
      updated_at: new Date().toISOString()
    });
    return !error;
  } catch {
    return false;
  }
}

function supabaseRestHeaders() {
  if (!supabaseServiceRoleKey) return null;
  return {
    apikey: supabaseServiceRoleKey,
    Authorization: `Bearer ${supabaseServiceRoleKey}`,
    "Content-Type": "application/json"
  };
}

async function readSupabaseWorkspace() {
  if (!supabaseUrl || !supabaseServiceRoleKey) return null;
  const headers = supabaseRestHeaders();
  if (!headers) return null;

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/app_workspaces?tenant_id=eq.${workspaceTenantId}&select=data`, {
      headers,
      cache: "no-store"
    });
    if (!response.ok) return null;
    const rows = (await response.json()) as Array<{ data?: unknown }>;
    const data = rows[0]?.data;
    if (data && typeof data === "object" && Object.keys(data).length > 0) return data;
    await writeSupabaseWorkspace(defaultWorkspace);
    return defaultWorkspace;
  } catch {
    return null;
  }
}

async function writeSupabaseWorkspace(workspace: unknown) {
  if (!supabaseUrl || !supabaseServiceRoleKey) return false;
  const headers = supabaseRestHeaders();
  if (!headers) return false;

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/app_workspaces`, {
      method: "POST",
      headers: {
        ...headers,
        Prefer: "resolution=merge-duplicates"
      },
      body: JSON.stringify({
        tenant_id: workspaceTenantId,
        data: workspace,
        updated_at: new Date().toISOString()
      })
    });
    return response.ok;
  } catch {
    return false;
  }
}
