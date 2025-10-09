import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromToken } from "@/lib/auth";

export async function middleware(req) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const pathname = req.nextUrl.pathname;

  const isProtectedRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  // ✅ If token exists, validate it
  if (token) {
    const payload = await getUserFromToken(token);

    if (!payload) {
      // invalid token -> redirect to login
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // ✅ Role-based restriction
    if (pathname.startsWith("/admin") && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (pathname.startsWith("/dashboard") && payload.role !== "supervisor") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // ✅ Prevent logged-in users from accessing login/register
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // ✅ Allow access to "/" and protected routes for valid token
    const response = NextResponse.next();
    response.headers.set("x-user-id", payload.id);
    response.headers.set("x-user-role", payload.role);
    return response;
  } else {
    // ✅ No token -> redirect to login if trying to access protected or "/" route
    if (isProtectedRoute || pathname === "/") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // ✅ Allow public access to login/register for non-logged users
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/register", "/dashboard/:path*", "/admin/:path*"],
};
