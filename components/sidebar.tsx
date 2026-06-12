import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ClipboardCheck,
  FileText,
  Gauge,
  HardHat,
  Home,
  Package,
  ReceiptText,
  Settings,
  Thermometer,
  Users,
  Warehouse
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: Gauge, href: "#dashboard" },
  { label: "Properties", icon: Building2, href: "#building-records" },
  { label: "Units", icon: Home, href: "#job-board" },
  { label: "Equipment", icon: Thermometer, href: "#job-board" },
  { label: "Jobs", icon: BriefcaseBusiness, href: "#create-job" },
  { label: "Calendar", icon: CalendarDays, href: "#job-board" },
  { label: "Approvals", icon: ClipboardCheck, href: "#smart-alerts" },
  { label: "Materials", icon: Package, href: "#job-board" },
  { label: "Inventory", icon: Warehouse, href: "#supplier-pickup" },
  { label: "Invoices", icon: ReceiptText, href: "#create-invoice" },
  { label: "Revenue", icon: BarChart3, href: "#invoice-tracker" },
  { label: "Employees", icon: HardHat, href: "#technician-view" },
  { label: "Residential", icon: Users, href: "#admin-data" },
  { label: "Reports", icon: FileText, href: "#invoice-tracker" },
  { label: "Settings", icon: Settings, href: "#local-workspace" }
];

export function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-border bg-white lg:block">
      <div className="border-b border-border px-6 py-5">
        <p className="text-xs font-bold uppercase tracking-wide text-accent">FieldCore HVAC</p>
        <h1 className="mt-1 text-xl font-bold text-foreground">Hot & Cool Command Center</h1>
      </div>
      <nav className="space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.label === "Dashboard";
          return (
            <a
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium ${
                active ? "bg-primary text-white" : "text-slate-700 hover:bg-slate-100"
              }`}
              href={item.href}
              key={item.label}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
