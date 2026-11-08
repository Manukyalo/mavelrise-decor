import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames, skipping internal Next.js files and static assets
  matcher: ["/", "/(en|sw)/:path*", "/((?!_next|_vercel|.*\\..*).*)"],
};
