import { type NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // 1. Run next-intl middleware first to resolve locale routing
  const response = intlMiddleware(request);

  // Expose the request pathname as a response header so server layouts can
  // detect which route they're rendering (e.g. to suppress the footer on /planner).
  response.headers.set("x-pathname", request.nextUrl.pathname);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase environment variables are missing, proceed with localized response
  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  // 2. Synchronize Supabase authentication state with response cookies
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({ name, value, ...options });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({ name, value: "", ...options });
        response.cookies.set({ name, value: "", ...options });
      },
    },
  });

  // 3. Security Rule: ALWAYS use getUser() server-side (never getSession alone)
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    user = null;
  }

  const { pathname } = request.nextUrl;

  // Determine current locale segment from pathname
  const localeSegment = pathname.split("/")[1];
  const locale = routing.locales.includes(localeSegment as "en" | "sw")
    ? localeSegment
    : routing.defaultLocale;

  // Defined protected and auth routes
  const isProtectedRoute =
    pathname.startsWith(`/${locale}/portal`) ||
    pathname.startsWith(`/portal`) ||
    pathname.startsWith(`/${locale}/admin`) ||
    pathname.startsWith(`/admin`);

  const isAuthRoute =
    pathname.startsWith(`/${locale}/auth/login`) ||
    pathname.startsWith(`/${locale}/auth/register`);

  // 4. Enforce route guarding server-side
  if (isProtectedRoute && !user) {
    const loginUrl = new URL(`/${locale}/auth/login`, request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && user) {
    const nextParam = request.nextUrl.searchParams.get("next");
    const targetUrl = nextParam || `/${locale}/admin`;
    return NextResponse.redirect(new URL(targetUrl, request.url));
  }

  return response;
}

export const config = {
  // Match localized paths and exclude static assets/internal files
  matcher: ["/", "/(en|sw)/:path*", "/((?!_next|_vercel|.*\\..*).*)"],
};
