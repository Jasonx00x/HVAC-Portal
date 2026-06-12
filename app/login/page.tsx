"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LockKeyhole, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = useMemo(() => searchParams.get("next") || "/dashboard", [searchParams]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("Use a Supabase Auth account to enter the portal.");
  const [loading, setLoading] = useState(false);

  async function signIn() {
    setLoading(true);
    setNotice("Signing in...");
    let supabase: ReturnType<typeof createClient>;
    try {
      supabase = createClient();
    } catch {
      setNotice("Supabase is not configured yet. Add the Supabase URL and anon key in Netlify environment variables, then redeploy.");
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setNotice(error.message);
      setLoading(false);
      return;
    }
    router.push(next);
    router.refresh();
  }

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
        <div className="mt-5 space-y-3">
          <label className="block">
            <span className="text-xs font-bold uppercase text-muted">Email</span>
            <span className="mt-1 flex items-center gap-2 rounded-md border border-border px-3 py-2">
              <Mail className="h-4 w-4 text-muted" />
              <input className="min-w-0 flex-1 text-sm outline-none" onChange={(event) => setEmail(event.target.value)} type="email" value={email} />
            </span>
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase text-muted">Password</span>
            <span className="mt-1 flex items-center gap-2 rounded-md border border-border px-3 py-2">
              <LockKeyhole className="h-4 w-4 text-muted" />
              <input className="min-w-0 flex-1 text-sm outline-none" onChange={(event) => setPassword(event.target.value)} type="password" value={password} />
            </span>
          </label>
          <button className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60" disabled={loading || !email || !password} onClick={signIn} type="button">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>
        <Link className="mt-4 block text-center text-sm font-semibold text-primary" href="/setup">Setup / role diagnostics</Link>
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
