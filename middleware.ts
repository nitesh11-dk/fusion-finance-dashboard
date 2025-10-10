import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET!;

// ✅ Helper to verify token
async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(JWT_SECRET)
        );
        return payload;
    } catch {
        return null;
    }
}

// ✅ Middleware function
export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get("token")?.value;

    // Allow public routes (like login, signup, API, static files, etc.)
    const publicPaths = ["/login", "/register", "/api"];
    if (publicPaths.some((path) => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    // Verify token for protected routes
    const isValid = token ? await verifyToken(token) : null;

    // ❌ Redirect to login if no valid token
    if (!isValid) {
        const loginUrl = new URL("/login", req.url);
        return NextResponse.redirect(loginUrl);
    }

    // ✅ Continue if authenticated
    return NextResponse.next();
}

// ✅ Only run middleware on selected routes
export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
