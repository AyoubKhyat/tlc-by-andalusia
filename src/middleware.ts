import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const roleRouteMap: Record<string, string[]> = {
  "/admin/users": ["admin"],
  "/admin/settings": ["admin"],
  "/admin/seo": ["admin"],
  "/admin/audit-log": ["admin"],
  "/admin/blog": ["admin"],
  "/admin/testimonials": ["admin"],
  "/admin/gallery": ["admin"],
  "/admin/faq": ["admin"],
  "/admin/chatbot": ["admin"],
  "/admin/events": ["admin"],
  "/admin/timeslots": ["admin"],
  "/admin/programs": ["admin", "receptionist"],
  "/admin/groups": ["admin", "teacher"],
  "/admin/exams": ["admin", "teacher"],
  "/admin/results": ["admin", "teacher"],
  "/admin/attendance": ["admin", "teacher"],
  "/admin/registrations": ["admin", "receptionist"],
  "/admin/bookings": ["admin", "receptionist"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login" || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const token = await getToken({ req: request });
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    const role = (token.role as string) || "admin";
    for (const [route, allowedRoles] of Object.entries(roleRouteMap)) {
      if (pathname.startsWith(route) && !allowedRoles.includes(role)) {
        const dashboardUrl = new URL("/admin", request.url);
        return NextResponse.redirect(dashboardUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
