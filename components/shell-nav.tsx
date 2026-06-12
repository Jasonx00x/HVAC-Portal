"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BriefcaseBusiness, CircleDollarSign, Home, Settings, UsersRound } from "lucide-react";

type Route = {
  label: string;
  href: string;
  group: string;
  subgroup?: string;
};

const groupStyles: Record<string, { accent: string; icon: React.ComponentType<{ className?: string }> }> = {
  Home: { accent: "bg-slate-800", icon: Home },
  Work: { accent: "bg-primary", icon: BriefcaseBusiness },
  Accounts: { accent: "bg-violet-500", icon: UsersRound },
  Money: { accent: "bg-success", icon: CircleDollarSign },
  Company: { accent: "bg-accent", icon: Settings }
};

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function ShellNav({ groupedRoutes }: { groupedRoutes: Record<string, Route[]> }) {
  const pathname = usePathname();

  return (
    <>
      {Object.entries(groupedRoutes).map(([group, routes]) => {
        const style = groupStyles[group] ?? groupStyles.Work;
        const Icon = style.icon;
        const subgroupedRoutes = routes.reduce<Record<string, Route[]>>((groups, route) => {
          const subgroup = route.subgroup ?? "Main";
          groups[subgroup] = [...(groups[subgroup] ?? []), route];
          return groups;
        }, {});
        return (
          <div className="mb-5" key={group}>
            <div className="mb-2 flex items-center gap-2 px-3">
              <span className={`h-2 w-2 rounded-full ${style.accent}`} />
              <Icon className="h-3.5 w-3.5 text-muted" />
              <p className="text-[11px] font-bold uppercase tracking-wide text-muted">{group}</p>
            </div>
            <div className="space-y-1">
              {Object.entries(subgroupedRoutes).map(([subgroup, subgroupRoutes]) => (
                <div key={subgroup}>
                  {subgroup !== "Main" ? <p className="px-5 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wide text-muted">{subgroup}</p> : null}
                  {subgroupRoutes.map((route) => {
                    const active = isActive(pathname, route.href);
                    return (
                      <Link
                        className={`relative block rounded-md px-3 py-2 text-sm font-semibold transition ${active ? "bg-slate-100 text-slate-950 shadow-inner" : "text-slate-700 hover:bg-slate-50"}`}
                        href={route.href}
                        key={route.href}
                      >
                        {active ? <span className={`absolute left-0 top-2 h-5 w-1 rounded-r-full ${style.accent}`} /> : null}
                        <span className="pl-2">{route.label}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}

export function MobileShellNav({ routes }: { routes: Route[] }) {
  const pathname = usePathname();

  return (
    <nav className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
      {routes.map((route) => {
        const active = isActive(pathname, route.href);
        return (
          <Link className={`shrink-0 rounded-md border px-3 py-2 text-xs font-semibold ${active ? "border-primary bg-cyan-50 text-primary" : "border-border bg-white text-slate-700"}`} href={route.href} key={route.href}>
            {route.label}
          </Link>
        );
      })}
    </nav>
  );
}
