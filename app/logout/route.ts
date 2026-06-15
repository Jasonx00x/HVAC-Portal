import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { appSessionCookieName } from "@/lib/auth/session-cookie";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const cookieStore = await cookies();
  cookieStore.delete(appSessionCookieName);
  redirect("/login");
}
