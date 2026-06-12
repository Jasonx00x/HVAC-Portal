import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default async function UnauthorizedPage({
  searchParams
}: {
  searchParams: Promise<{ permission?: string; reason?: string }>;
}) {
  const params = await searchParams;
  const detail = params.reason === "account_status"
    ? "This account is disabled or suspended."
    : `This account does not have ${params.permission ?? "the required permission"}.`;
  const homeHref = params.permission === "technician_portal_only" ? "/technician/today" : "/dashboard";
  const homeLabel = params.permission === "technician_portal_only" ? "Technician Portal" : "Dashboard";

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4">
      <section className="w-full max-w-lg rounded-xl border border-border bg-white p-6 text-center shadow-soft">
        <ShieldAlert className="mx-auto h-10 w-10 text-accent" />
        <h1 className="mt-4 text-2xl font-bold">Access blocked</h1>
        <p className="mt-2 text-sm text-muted">{detail}</p>
        <div className="mt-6 flex justify-center gap-2">
          <Link className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white" href={homeHref}>{homeLabel}</Link>
          <Link className="rounded-md border border-border px-4 py-2 text-sm font-semibold" href="/logout">Logout</Link>
        </div>
      </section>
    </main>
  );
}
