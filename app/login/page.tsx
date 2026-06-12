"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { LockKeyhole, Mail } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const next = useMemo(() => {
    const requested = searchParams.get("next") || "/dashboard";
    return requested.startsWith("/") && !requested.startsWith("//") ? requested : "/dashboard";
  }, [searchParams]);
  const notice = searchParams.get("error") || "Use a Supabase Auth account to enter the portal.";

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4">
      <section className="w-full max-w-md rounded-xl border border-border bg-white p-6 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-950 font-bold text-white">FC</div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-accent">FieldCore HVAC</p>
            <h1 className="text-xl font-bold">Sign in</h1>
          </div>
        </div>
        <p className="mt-5 rounded-md bg-slate-50 px-3 py-2 text-sm text-muted">{notice}</p>
        <form action="/auth/sign-in" className="mt-5 space-y-3" method="post">
          <input name="next" type="hidden" value={next} />
          <label className="block">
            <span className="text-xs font-bold uppercase text-muted">Email</span>
            <span className="mt-1 flex items-center gap-2 rounded-md border border-border px-3 py-2">
              <Mail className="h-4 w-4 text-muted" />
              <input autoComplete="email" className="min-w-0 flex-1 text-sm outline-none" name="email" required type="email" />
            </span>
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase text-muted">Password</span>
            <span className="mt-1 flex items-center gap-2 rounded-md border border-border px-3 py-2">
              <LockKeyhole className="h-4 w-4 text-muted" />
              <input autoComplete="current-password" className="min-w-0 flex-1 text-sm outline-none" name="password" required type="password" />
            </span>
          </label>
          <button className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white" type="submit">
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="grid min-h-screen place-items-center bg-slate-100 px-4"><p className="text-sm text-muted">Loading login...</p></main>}>
      <LoginForm />
    </Suspense>
  );
}
