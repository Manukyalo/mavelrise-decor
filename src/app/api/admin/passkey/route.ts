import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "en";

  const response = NextResponse.json({ success: true, redirect: `/${locale}/admin` });
  response.cookies.set("mrd_director_session", "true", {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: "lax",
  });

  return response;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "en";

  const targetUrl = new URL(`/${locale}/admin`, request.url);
  const response = NextResponse.redirect(targetUrl);
  response.cookies.set("mrd_director_session", "true", {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: "lax",
  });

  return response;
}

