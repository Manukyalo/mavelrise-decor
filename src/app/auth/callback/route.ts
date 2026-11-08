import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/en/portal";

  if (code) {
    try {
      const supabase = await createServerSupabaseClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(new URL(next, requestUrl.origin));
      }
    } catch (err) {
      console.error("Auth callback exchange failure:", err);
    }
  }

  // Fallback to login with error
  return NextResponse.redirect(
    new URL(`/en/auth/login?error=${encodeURIComponent("Verification link expired or invalid")}`, requestUrl.origin)
  );
}
