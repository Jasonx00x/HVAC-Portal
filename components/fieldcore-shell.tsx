import Link from "next/link";
import { getCurrentAccess, hasPermission, visibleRoutes } from "@/lib/auth/permissions";
import { MobileShellNav, ShellNav } from "@/components/shell-nav";
import { Badge } from "@/components/ui";

export async function FieldCoreShell({
  children,
  title,
  subtitle
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  const access = await getCurrentAccess();
  const routes = visibleRoutes(access);
  const groupedRoutes = routes.reduce<Record<string, typeof routes>>((groups, route) => {
    groups[route.group] = [...(groups[route.group] ?? []), route];
    return groups;
  }, {});

  return (
    <main className="min-h-screen bg-background text-foreground lg:flex">
      <aside className="hidden w-72 shrink-0 border-r border-border bg-white lg:block">
        <div className="border-b border-border px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">FC</div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-accent">FieldCore HVAC</p>
              <h1 className="text-base font-bold">Hot & Cool</h1>
            </div>
          </div>
          <p className="mt-4 rounded-md bg-slate-50 p-3 text-xs leading-5 text-muted">HVAC Operations & Service Management</p>
          <div className="mt-3 rounded-md border border-border p-3 text-xs">
            <p className="font-bold">{access.fullName || access.email || "Signed in"}</p>
            <p className="mt-1 capitalize text-muted">{access.role.replace("_", " ")}</p>
          </div>
        </div>
        <nav className="px-3 py-4">
          <ShellNav groupedRoutes={groupedRoutes} />
          {hasPermission(access, "manage_jobs") ? (
            <Link className="block rounded-md bg-slate-900 px-3 py-2.5 text-sm font-semibold text-white" href="/technician/today">
              Technician Portal
            </Link>
          ) : null}
        </nav>
      </aside>
      <section className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 border-b border-border bg-white/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-bold uppercase tracking-wide text-accent">FieldCore HVAC</p>
                <Badge tone="info">Hot & Cool workspace</Badge>
                <Badge tone={access.role === "technician" ? "warning" : "success"}>{access.role.replace("_", " ")}</Badge>
              </div>
              <h2 className="mt-1 text-2xl font-bold">{title}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{subtitle}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {hasPermission(access, "manage_staff") ? (
                <Link className="rounded-md border border-border px-3 py-2 text-sm font-semibold hover:bg-slate-50" href="/settings/staff">Staff</Link>
              ) : null}
              {hasPermission(access, "manage_jobs") ? (
                <Link className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white" href="/jobs">New work order</Link>
              ) : null}
              <Link className="rounded-md border border-border px-3 py-2 text-sm font-semibold hover:bg-slate-50" href="/logout">Logout</Link>
            </div>
          </div>
          <MobileShellNav routes={routes} />
        </header>
        <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </section>
    </main>
  );
}
