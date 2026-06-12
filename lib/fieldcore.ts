export const permissions = [
  "view_dashboard",
  "manage_properties",
  "manage_units",
  "manage_equipment",
  "manage_jobs",
  "manage_calendar",
  "manage_approvals",
  "manage_materials",
  "manage_inventory",
  "manage_invoices",
  "view_revenue",
  "view_profit",
  "manage_employees",
  "manage_residential",
  "manage_management_companies",
  "view_reports",
  "manage_settings",
  "manage_staff"
] as const;

export type PermissionKey = (typeof permissions)[number];

export const appRoutes: Array<{ label: string; href: string; group: string; subgroup?: string; permission: PermissionKey }> = [
  { label: "Dashboard", href: "/dashboard", group: "Home", permission: "view_dashboard" },
  { label: "Calendar", href: "/calendar", group: "Work", subgroup: "Schedule", permission: "manage_calendar" },
  { label: "Jobs", href: "/jobs", group: "Work", subgroup: "Schedule", permission: "manage_jobs" },
  { label: "Approvals", href: "/approvals", group: "Work", subgroup: "Blocked Work", permission: "manage_approvals" },
  { label: "Properties", href: "/properties", group: "Accounts", subgroup: "Commercial", permission: "manage_properties" },
  { label: "Units", href: "/units", group: "Accounts", subgroup: "Commercial", permission: "manage_units" },
  { label: "Equipment", href: "/equipment", group: "Accounts", subgroup: "Commercial", permission: "manage_equipment" },
  { label: "Residential CRM", href: "/residential", group: "Accounts", subgroup: "Residential", permission: "manage_residential" },
  { label: "Invoices", href: "/invoices", group: "Money", subgroup: "Billing", permission: "manage_invoices" },
  { label: "Revenue", href: "/revenue", group: "Money", subgroup: "Reports", permission: "view_revenue" },
  { label: "Reports", href: "/reports", group: "Money", subgroup: "Reports", permission: "view_reports" },
  { label: "Materials", href: "/materials", group: "Company", subgroup: "Stock", permission: "manage_materials" },
  { label: "Inventory", href: "/inventory", group: "Company", subgroup: "Stock", permission: "manage_inventory" },
  { label: "Employees", href: "/employees", group: "Company", subgroup: "Team", permission: "manage_employees" },
  { label: "Settings", href: "/settings", group: "Company", subgroup: "Admin", permission: "manage_settings" }
];

export type FieldCoreModule =
  | "properties"
  | "units"
  | "equipment"
  | "jobs"
  | "approvals"
  | "materials"
  | "inventory"
  | "invoices"
  | "employees"
  | "residential";

export const moduleCopy: Record<FieldCoreModule, { title: string; subtitle: string; primary: string }> = {
  properties: {
    title: "Properties",
    subtitle: "Manage apartment buildings, managers, billing rules, access notes, PO rules, and preferred supplier pickup.",
    primary: "Property name"
  },
  units: {
    title: "Units",
    subtitle: "Track units by property, floor, section, access notes, tenant notes, and service history.",
    primary: "Unit number"
  },
  equipment: {
    title: "Equipment",
    subtitle: "Record HVAC equipment, model, serial, refrigerant, warranty, data plate photo status, and related jobs.",
    primary: "Equipment name"
  },
  jobs: {
    title: "Jobs",
    subtitle: "Create and update work orders with technician, property, unit, status, labor, materials, PO, and invoice status.",
    primary: "Job title"
  },
  approvals: {
    title: "Approvals",
    subtitle: "Track estimates, PO requirements, property-manager approvals, delays, and waiting-on-parts decisions.",
    primary: "Approval title"
  },
  materials: {
    title: "Materials",
    subtitle: "Log job materials, billable status, supplier, cost, and whether each item was added to the invoice.",
    primary: "Material name"
  },
  inventory: {
    title: "Inventory",
    subtitle: "Manage stock quantity, reorder levels, unit costs, suppliers, last purchase date, and low-stock alerts.",
    primary: "Inventory item"
  },
  invoices: {
    title: "Invoices",
    subtitle: "Create invoices from jobs, track PO numbers, statuses, due dates, labor, materials, totals, and payments.",
    primary: "Invoice number"
  },
  employees: {
    title: "Employees",
    subtitle: "Manage staff, hourly rates, roles, active status, last login, and technician assignment.",
    primary: "Employee name"
  },
  residential: {
    title: "Residential Clients",
    subtitle: "Support occasional residential customers separately from apartment properties.",
    primary: "Client name"
  }
};
