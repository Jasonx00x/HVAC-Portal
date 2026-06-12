import type {
  AdminChecklistItem,
  AlertItem,
  ContractRow,
  DashboardMetric,
  ImportedPropertyInvoice,
  InvoiceImportSummary,
  JobRow,
  PropertyRow,
  ReadinessItem,
  SupplierPickup,
  TechnicianJob,
  WorkflowStage
} from "@/lib/types";

export const metrics: DashboardMetric[] = [
  { label: "Invoice tracker total", value: "$384,486.96", detail: "194 invoices imported from workbook", tone: "success" },
  { label: "Blank / unpaid status", value: "$161,759.00", detail: "Needs payment status cleanup", tone: "warning" },
  { label: "Customer/property clues", value: "6", detail: "Top names found in the invoice tracker", tone: "info" },
  { label: "Missing contact fields", value: "6", detail: "Addresses, managers, phones, billing contacts, and PO rules still need source data", tone: "warning" },
  { label: "Supplier pickup fields", value: "Needs data", detail: "Pickup branch should be confirmed per job/property before dispatch", tone: "neutral" },
  { label: "Current data mode", value: "Local", detail: "Writes are saved locally until Supabase tables are activated", tone: "info" }
];

export const invoiceImportSummary: InvoiceImportSummary = {
  source: "Full_Invoice_Tracker_AutoFit.xlsx",
  invoiceCount: 194,
  totalRevenue: "$384,486.96",
  paidRevenue: "$222,727.96",
  unpaidOrBlank: "$161,759.00",
  dateRange: "Jun 13, 2025 to Jun 5, 2026",
  missingFields: ["Building addresses", "Manager names", "Manager phone numbers", "Billing contacts", "PO numbers", "Supplier pickup branches"]
};

export const importedPropertyInvoices: ImportedPropertyInvoice[] = [
  {
    customer: "Paradigmcos",
    invoiceCount: 113,
    total: "$270,940.96",
    paid: "$212,597.96",
    unpaidOrBlank: "$58,343.00",
    dateRange: "Jun 2025 to Jun 2026",
    topServices: "HVAC replacements, repairs, water heaters",
    action: "Split into exact buildings/units and confirm managers."
  },
  {
    customer: "The Clarendon Apartments",
    invoiceCount: 26,
    total: "$55,985.00",
    paid: "$0.00",
    unpaidOrBlank: "$55,985.00",
    dateRange: "Sep 2025 to Jun 2026",
    topServices: "HVAC replacements, repairs, miscellaneous service",
    action: "Confirm payment status and collect billing contact."
  },
  {
    customer: "Townes at Herndon",
    invoiceCount: 22,
    total: "$20,216.00",
    paid: "$0.00",
    unpaidOrBlank: "$20,216.00",
    dateRange: "Jul 2025 to Jan 2026",
    topServices: "Repairs, water heaters, other service",
    action: "Add property profile and approval/PO rules."
  },
  {
    customer: "Alate Old Town",
    invoiceCount: 20,
    total: "$13,870.00",
    paid: "$0.00",
    unpaidOrBlank: "$13,870.00",
    dateRange: "Jul 2025 to Jan 2026",
    topServices: "Refrigerant, diagnostics, other service",
    action: "Normalize duplicate customer spelling and gather address."
  },
  {
    customer: "Paradigmcos / Ballston",
    invoiceCount: 7,
    total: "$9,025.00",
    paid: "$2,260.00",
    unpaidOrBlank: "$6,765.00",
    dateRange: "Nov 2025 to Jun 2026",
    topServices: "Repairs and HVAC replacements",
    action: "Confirm if this is Meridian at Ballston and assign supplier pickup branch."
  },
  {
    customer: "Ashton at Dulles Corner",
    invoiceCount: 3,
    total: "$5,430.00",
    paid: "$0.00",
    unpaidOrBlank: "$5,430.00",
    dateRange: "Jun 2025 to Jul 2025",
    topServices: "Diagnostics, repairs, condenser replacement",
    action: "Collect manager contact and property rules."
  }
];

export const readinessItems: ReadinessItem[] = [
  {
    label: "Owner dashboard",
    status: "Ready",
    detail: "Revenue, unpaid status, smart alerts, jobs, property performance, and invoice-import summary are visible."
  },
  {
    label: "Admin/staff building setup",
    status: "Ready",
    detail: "Staff can see the exact fields needed for building contacts, billing rules, contracts, and supplier pickup notes."
  },
  {
    label: "Technician field workflow",
    status: "Ready",
    detail: "Technician screen is reduced to stamp in, stamp out, photos, diagnosis report, materials, and completion."
  },
  {
    label: "Invoice history import",
    status: "Ready",
    detail: "Workbook was summarized into top customers/properties, totals, paid amounts, unpaid/blank status, and cleanup actions."
  },
  {
    label: "Building addresses and manager contacts",
    status: "Needs data",
    detail: "Invoice tracker does not contain addresses, manager names, phone numbers, or billing emails."
  },
  {
    label: "Real CRUD forms and login",
    status: "Next build",
    detail: "The schema exists; the next engineering pass should wire forms, authentication, and saved database records."
  }
];

export const workflowStages: WorkflowStage[] = [
  {
    step: "Collect source data",
    owner: "Admin / Jose",
    output: "Invoices, emails, Drive files, POs, receipts, contracts, data plate photos"
  },
  {
    step: "Create building profile",
    owner: "Office staff",
    output: "Address, manager, billing contact, access rules, PO rules, preferred supplier"
  },
  {
    step: "Dispatch job",
    owner: "Owner / office",
    output: "Property, unit, equipment, technician, schedule, approval status"
  },
  {
    step: "Field work",
    owner: "Technician",
    output: "Stamp in/out, photos, diagnosis, work report, materials used"
  },
  {
    step: "Bill and review",
    owner: "Owner / office",
    output: "Invoice, PO check, material billing check, paid status, property profitability"
  }
];

export const alerts: AlertItem[] = [
  {
    title: "Invoice tracker missing contact fields",
    detail: "The imported tracker has customer names and totals, but no addresses, manager phones, billing contacts, or PO column.",
    priority: "High",
    category: "Data cleanup"
  },
  {
    title: "Blank/unpaid invoices need review",
    detail: "$161,759.00 in the imported invoice tracker has blank or unpaid status and needs cleanup before reporting revenue.",
    priority: "High",
    category: "Revenue"
  },
  {
    title: "Property names need normalization",
    detail: "The tracker has customer/property names that need confirmation, including Paradigmcos, Paradigmcos / Ballston, and Alate Old Town spelling variants.",
    priority: "High",
    category: "Data cleanup"
  },
  {
    title: "PO numbers are not in the tracker",
    detail: "The uploaded invoice workbook does not provide reliable PO fields, so PO rules must be gathered from email, Drive, contracts, or property managers.",
    priority: "Medium",
    category: "PO"
  },
  {
    title: "Supplier pickup branches need confirmation",
    detail: "Preferred suppliers can be tracked, but the exact pickup branch should be verified from Jose's account history, receipts, or current stock checks.",
    priority: "Medium",
    category: "Suppliers"
  },
  {
    title: "Equipment data is not imported yet",
    detail: "Model numbers, serial numbers, refrigerant types, and data plate photos must be gathered from field notes, photos, invoices, or future technician entries.",
    priority: "Low",
    category: "Equipment"
  }
];

export const jobs: JobRow[] = [];

export const properties: PropertyRow[] = importedPropertyInvoices.map((item) => ({
  name: item.customer,
  manager: "Needs source data",
  refrigerants: "Needs source data",
  commonWaterHeaters: "Needs source data",
  unpaidBalance: item.unpaidOrBlank,
  profitScore: 0
}));

export const technicianJobs: TechnicianJob[] = [];

export const supplierPickups: SupplierPickup[] = [
  {
    supplier: "United Refrigeration",
    branch: "Capitol Heights / Jessup / Rockville, MD",
    phone: "Confirm by branch",
    bestFor: "Refrigerant, compressors, motors, controls, HVAC/R replacement parts",
    pickupNotes: "Use branch locator or account rep to pick the closest branch with stock before dispatch."
  },
  {
    supplier: "Johnstone Supply",
    branch: "Beltsville, Rosedale, Annapolis, MD area",
    phone: "Confirm local store",
    bestFor: "Capacitors, contactors, filters, tools, general HVAC parts",
    pickupNotes: "Good default for common repair parts and will-call pickup when stock is confirmed."
  },
  {
    supplier: "Carrier Enterprise",
    branch: "Laurel, MD",
    phone: "301-470-1703",
    bestFor: "Carrier/Bryant/Payne equipment, OEM parts, unitary replacement equipment",
    pickupNotes: "Useful when the building equipment is Carrier-family or a matched replacement is needed."
  },
  {
    supplier: "Havtech",
    branch: "Capitol Heights, MD parts counter",
    phone: "Confirm branch",
    bestFor: "Commercial parts, fan motors, belts, coils, controls, PTACs, fan coils",
    pickupNotes: "Better fit for commercial building parts and apartment equipment support."
  },
  {
    supplier: "Aireco",
    branch: "Mid-Atlantic branches",
    phone: "Confirm nearest branch",
    bestFor: "Mid-Atlantic HVAC/R supplies, equipment, parts, training support",
    pickupNotes: "Use as an alternate supplier when primary supplier is out of stock."
  }
];

export const adminChecklist: AdminChecklistItem[] = [
  {
    group: "Building profile",
    items: ["Official property name", "Full service address", "Building phone", "Loading dock / parking rules", "Front desk or access process"]
  },
  {
    group: "Management contacts",
    items: ["Property manager name", "Manager phone and email", "Assistant manager", "Maintenance supervisor", "After-hours emergency contact"]
  },
  {
    group: "Billing and approvals",
    items: ["Billing contact", "Billing email", "PO requirement", "Approval process", "Invoice terms and portal login notes"]
  },
  {
    group: "Equipment standards",
    items: ["Common HVAC brands", "Refrigerant types", "Common water heater models", "Filter sizes", "Known warranty or contract coverage"]
  },
  {
    group: "Suppliers and pickup",
    items: ["Preferred supplier by property", "Pickup branch", "Account number or counter instructions", "Parts usually stocked", "Backup supplier"]
  },
  {
    group: "Source documents",
    items: ["Jose's emails", "Shared Drive folders", "Invoices", "Purchase orders", "Photos of data plates and receipts"]
  }
];

export const contracts: ContractRow[] = [
  {
    property: "Meridian at Ballston",
    contractType: "Service agreement",
    startDate: "Jan 1, 2026",
    endDate: "Dec 31, 2026",
    billingRule: "Net 30, invoice to property AP",
    poRule: "PO required for work over $500",
    status: "Draft info needed"
  }
];

export const revenueByMonth = [
  { month: "Jun 2025", revenue: 5430, cost: 0 },
  { month: "Jul 2025", revenue: 34086, cost: 0 },
  { month: "Sep 2025", revenue: 55985, cost: 0 },
  { month: "Nov 2025", revenue: 9025, cost: 0 },
  { month: "Jan 2026", revenue: 34086, cost: 0 },
  { month: "Jun 2026", revenue: 6103, cost: 0 }
];

export const statusCounts = [
  { name: "Paid", value: 222727.96 },
  { name: "Blank/unpaid", value: 161759 }
];
