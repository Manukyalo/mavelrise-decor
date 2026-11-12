import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isDirector = searchParams.get("access") === "director" || searchParams.get("key") === "director";

  const targetUrl = new URL("/en/admin", request.url);
  const response = NextResponse.redirect(targetUrl);

  if (isDirector) {
    response.cookies.set("mrd_director_session", "true", {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "lax",
    });
  }

  return response;
}

