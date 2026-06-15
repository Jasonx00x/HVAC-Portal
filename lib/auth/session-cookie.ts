import type { UserRole } from "@/lib/auth/permissions";
import { cleanEnvValue } from "@/lib/supabase/env";

export const appSessionCookieName = "fieldcore_session";

export type AppSession = {
  userId: string;
  email?: string;
  fullName?: string;
  role: UserRole;
  status?: string;
  exp: number;
};

function sessionSecret() {
  return cleanEnvValue(process.env.FIELDCORE_SESSION_SECRET)
    ?? cleanEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY)
    ?? cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    ?? "fieldcore-local-session";
}

function encodeBase64Url(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function signPayload(payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(sessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  let binary = "";
  new Uint8Array(signature).forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export async function createAppSessionCookie(session: Omit<AppSession, "exp">, maxAgeSeconds = 60 * 60 * 24 * 7) {
  const payload = encodeBase64Url(JSON.stringify({ ...session, exp: Math.floor(Date.now() / 1000) + maxAgeSeconds }));
  const signature = await signPayload(payload);
  return `${payload}.${signature}`;
}

export async function verifyAppSessionCookie(value?: string | null): Promise<AppSession | null> {
  if (!value || !value.includes(".")) return null;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;
  const expected = await signPayload(payload);
  if (expected !== signature) return null;
  try {
    const session = JSON.parse(decodeBase64Url(payload)) as AppSession;
    if (!session.userId || !session.role || !session.exp || session.exp < Math.floor(Date.now() / 1000)) return null;
    return session;
  } catch {
    return null;
  }
}

export function appSessionCookieOptions() {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7
  };
}
