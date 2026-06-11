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
