import { NextResponse } from "next/server";
import { appSessionCookieName, appSessionCookieOptions, createAppSessionCookie } from "@/lib/auth/session-cookie";
import type { UserRole } from "@/lib/auth/permissions";
import { createClient } from "@/lib/supabase/server";

type LoginProfile = { full_name?: string | null; role?: UserRole | null; status?: string | null };

function safeNext(value: unknown) {
  const next = typeof value === "string" ? value : "/dashboard";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
}

function requestOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (origin?.startsWith("http")) return origin;
  const referer = request.headers.get("referer");
  if (referer?.startsWith("http")) return new URL(referer).origin;
  return new URL(request.url).origin;
}

function loginRedirect(request: Request, error: string) {
  const url = new URL("/login", requestOrigin(request));
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

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  let profile: LoginProfile | null = null;
  if (user) {
    const result = await supabase.from("profiles").select("full_name,role,status").eq("id", user.id).maybeSingle();
    profile = result.data as LoginProfile | null;
  }

  const response = wantsJson
    ? NextResponse.json({ ok: true, next: safeNext(body.next) })
    : NextResponse.redirect(new URL(safeNext(body.next), requestOrigin(request)), { status: 303 });

  if (user) {
    const appSession = await createAppSessionCookie({
      userId: user.id,
      email: user.email ?? email,
      fullName: profile?.full_name ?? user.user_metadata?.full_name ?? user.email ?? email,
      role: profile?.role ?? "technician",
      status: profile?.status ?? "active"
    });
    response.cookies.set(appSessionCookieName, appSession, appSessionCookieOptions());
  }

  return response;
}
