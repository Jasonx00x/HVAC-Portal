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
  { label: "Dashboard", icon: Gauge },
  { label: "Properties", icon: Building2 },
  { label: "Units", icon: Home },
  { label: "Equipment", icon: Thermometer },
  { label: "Jobs", icon: BriefcaseBusiness },
  { label: "Calendar", icon: CalendarDays },
  { label: "Approvals", icon: ClipboardCheck },
  { label: "Materials", icon: Package },
  { label: "Inventory", icon: Warehouse },
  { label: "Invoices", icon: ReceiptText },
  { label: "Revenue", icon: BarChart3 },
  { label: "Employees", icon: HardHat },
  { label: "Residential", icon: Users },
  { label: "Reports", icon: FileText },
  { label: "Settings", icon: Settings }
];

export function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-border bg-white lg:block">
      <div className="border-b border-border px-6 py-5">
        <p className="text-xs font-bold uppercase tracking-wide text-accent">Hot & Cool Services</p>
        <h1 className="mt-1 text-xl font-bold text-foreground">HVAC Portal</h1>
      </div>
      <nav className="space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.label === "Dashboard";
          return (
            <button
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium ${
                active ? "bg-primary text-white" : "text-slate-700 hover:bg-slate-100"
              }`}
              key={item.label}
              type="button"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
