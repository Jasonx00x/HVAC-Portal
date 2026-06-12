export type StatusTone = "neutral" | "success" | "warning" | "danger" | "info";

export type DashboardMetric = {
  label: string;
  value: string;
  detail: string;
  tone: StatusTone;
};

export type AlertItem = {
  title: string;
  detail: string;
  priority: "High" | "Medium" | "Low";
  category: string;
};

export type JobRow = {
  jobNumber: string;
  status: string;
  priority: string;
  property: string;
  unit: string;
  technician: string;
  serviceType: string;
  scheduled: string;
  poNumber?: string;
  invoiceStatus?: string;
};

export type PropertyRow = {
  name: string;
  manager: string;
  refrigerants: string;
  commonWaterHeaters: string;
  unpaidBalance: string;
  profitScore: number;
};

export type TechnicianJob = {
  jobNumber: string;
  status: string;
  address: string;
  unit: string;
  issue: string;
  equipment: string;
  propertyNotes: string;
};

export type SupplierPickup = {
  supplier: string;
  branch: string;
  phone: string;
  bestFor: string;
  pickupNotes: string;
};

export type AdminChecklistItem = {
  group: string;
  items: string[];
};

export type ContractRow = {
  property: string;
  contractType: string;
  startDate: string;
  endDate: string;
  billingRule: string;
  poRule: string;
  status: string;
};

export type InvoiceImportSummary = {
  source: string;
  invoiceCount: number;
  totalRevenue: string;
  paidRevenue: string;
  unpaidOrBlank: string;
  dateRange: string;
  missingFields: string[];
};

export type ImportedPropertyInvoice = {
  customer: string;
  invoiceCount: number;
  total: string;
  paid: string;
  unpaidOrBlank: string;
  dateRange: string;
  topServices: string;
  action: string;
};

export type ReadinessItem = {
  label: string;
  status: "Ready" | "Needs data" | "Next build";
  detail: string;
};

export type WorkflowStage = {
  step: string;
  owner: string;
  output: string;
};
