import type { AlertItem, DashboardMetric, JobRow, PropertyRow, TechnicianJob } from "@/lib/types";

export const metrics: DashboardMetric[] = [
  { label: "Monthly revenue", value: "$42,780", detail: "+18% from last month", tone: "success" },
  { label: "Unpaid invoices", value: "$13,420", detail: "5 invoices need follow-up", tone: "warning" },
  { label: "Open jobs", value: "18", detail: "7 scheduled today", tone: "info" },
  { label: "Waiting approval", value: "6", detail: "$9,850 in pending estimates", tone: "warning" },
  { label: "Material cost", value: "$7,140", detail: "June month to date", tone: "neutral" },
  { label: "Estimated profit", value: "$21,360", detail: "49.9% blended margin", tone: "success" }
];

export const alerts: AlertItem[] = [
  {
    title: "Completed job missing invoice",
    detail: "HC-2026-1001 at Meridian Apartments, Unit 315 is completed but not fully invoiced.",
    priority: "High",
    category: "Revenue"
  },
  {
    title: "Billable material not added to invoice",
    detail: "45/5 MFD Dual Capacitor was marked billable but is missing from invoice INV-2026-0501.",
    priority: "High",
    category: "Materials"
  },
  {
    title: "PO number needed before billing",
    detail: "Compressor replacement estimate for Meridian Apartments needs PO before ordering.",
    priority: "Medium",
    category: "PO"
  },
  {
    title: "Inventory below reorder level",
    detail: "R-410A cylinder quantity is 1. Reorder level is 2.",
    priority: "Medium",
    category: "Inventory"
  },
  {
    title: "Equipment missing data plate photo",
    detail: "Water heater in Potomac View Unit 427 needs a data plate photo.",
    priority: "Low",
    category: "Equipment"
  }
];

export const jobs: JobRow[] = [
  {
    jobNumber: "HC-2026-1001",
    status: "Completed",
    priority: "High",
    property: "Meridian Apartments",
    unit: "315",
    technician: "Angel Alfaro",
    serviceType: "AC Repair",
    scheduled: "Jun 10, 9:00 AM",
    poNumber: "PO-78322",
    invoiceStatus: "Sent"
  },
  {
    jobNumber: "HC-2026-1002",
    status: "Waiting for Approval",
    priority: "Normal",
    property: "Meridian Apartments",
    unit: "315",
    technician: "Oscar Alfaro",
    serviceType: "Compressor Replacement",
    scheduled: "Today, 1:00 PM",
    invoiceStatus: "Not invoiced"
  },
  {
    jobNumber: "HC-2026-1003",
    status: "Scheduled",
    priority: "Emergency",
    property: "Capitol Row",
    unit: "B-204",
    technician: "Angel Alfaro",
    serviceType: "Water Heater Repair",
    scheduled: "Today, 3:30 PM",
    invoiceStatus: "Not invoiced"
  },
  {
    jobNumber: "HC-2026-1004",
    status: "Waiting on Parts",
    priority: "Normal",
    property: "Potomac View",
    unit: "427",
    technician: "Oscar Alfaro",
    serviceType: "Coil Replacement",
    scheduled: "Jun 12, 10:00 AM",
    poNumber: "PO-78190",
    invoiceStatus: "Not invoiced"
  }
];

export const properties: PropertyRow[] = [
  {
    name: "Meridian Apartments",
    manager: "Elena Brooks",
    refrigerants: "R-410A, R-22",
    commonWaterHeaters: "Bradford White 40 gal electric",
    unpaidBalance: "$4,820",
    profitScore: 87
  },
  {
    name: "Capitol Row",
    manager: "Marcus Reed",
    refrigerants: "R-410A",
    commonWaterHeaters: "AO Smith 50 gal gas",
    unpaidBalance: "$1,240",
    profitScore: 76
  },
  {
    name: "Potomac View",
    manager: "Sofia Kim",
    refrigerants: "R-410A, R-32",
    commonWaterHeaters: "Rheem 40 gal electric",
    unpaidBalance: "$7,360",
    profitScore: 62
  }
];

export const technicianJobs: TechnicianJob[] = [
  {
    jobNumber: "HC-2026-1002",
    status: "Waiting for Approval",
    address: "1400 Meridian Pl NW, Washington, DC",
    unit: "315",
    issue: "Outdoor unit trips breaker. Compressor grounded.",
    equipment: "Goodman condenser, R-410A, 2.5 ton",
    propertyNotes: "Check in at front desk. Loading area before 10 AM."
  },
  {
    jobNumber: "HC-2026-1003",
    status: "Scheduled",
    address: "88 Capitol Row SE, Washington, DC",
    unit: "B-204",
    issue: "Tenant reports no hot water.",
    equipment: "AO Smith 50 gal gas water heater",
    propertyNotes: "Use service elevator. Work hours end at 5 PM."
  }
];

export const revenueByMonth = [
  { month: "Jan", revenue: 28200, cost: 13300 },
  { month: "Feb", revenue: 31800, cost: 14900 },
  { month: "Mar", revenue: 29750, cost: 13850 },
  { month: "Apr", revenue: 36400, cost: 15900 },
  { month: "May", revenue: 39200, cost: 17100 },
  { month: "Jun", revenue: 42780, cost: 21420 }
];

export const statusCounts = [
  { name: "Scheduled", value: 7 },
  { name: "In Progress", value: 3 },
  { name: "Waiting Parts", value: 4 },
  { name: "Waiting Approval", value: 6 },
  { name: "Completed", value: 8 }
];
