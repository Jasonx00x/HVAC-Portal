import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function safeNext(value: unknown) {
  const next = typeof value === "string" ? value : "/dashboard";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
}

function loginRedirect(request: Request, error: string) {
  const url = new URL("/login", request.url);
  url.searchParams.set("error", error);
  return NextResponse.redirect(url, { status: 303 });
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  const wantsJson = contentType.includes("application/json");
  let body: { email?: string; password?: string; next?: string };
  try {
    if (wantsJson) {
      body = await request.json();
    } else {
      const form = await request.formData();
      body = {
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? ""),
        next: String(form.get("next") ?? "/dashboard")
      };
    }
  } catch {
    return wantsJson
      ? NextResponse.json({ error: "Invalid login request." }, { status: 400 })
      : loginRedirect(request, "Invalid login request.");
  }

  const email = body.email?.trim();
  const password = body.password;
  if (!email || !password) {
    return wantsJson
      ? NextResponse.json({ error: "Email and password are required." }, { status: 400 })
      : loginRedirect(request, "Email and password are required.");
  }

  let supabase: Awaited<ReturnType<typeof createClient>>;
  try {
    supabase = await createClient();
  } catch {
    return wantsJson
      ? NextResponse.json({ error: "Supabase is not configured." }, { status: 500 })
      : loginRedirect(request, "Supabase is not configured.");
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return wantsJson
      ? NextResponse.json({ error: error.message }, { status: 401 })
      : loginRedirect(request, error.message);
  }

  if (wantsJson) return NextResponse.json({ ok: true, next: safeNext(body.next) });
  return NextResponse.redirect(new URL(safeNext(body.next), request.url), { status: 303 });
}
