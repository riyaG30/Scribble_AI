import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const { isAuthenticated } = getKindeServerSession();

    if (request.nextUrl.pathname.startsWith("/api")) {
        // Handle CORS for API requests
        const response = NextResponse.next();
        response.headers.set("Access-Control-Allow-Origin", "*");
        response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        return response;
    }

    // Prevent infinite redirect loop
    if (!(await isAuthenticated())) {
        if (request.nextUrl.pathname !== "/api/auth/login") {
            return NextResponse.redirect(
                new URL("/api/auth/login?post_login_redirect_url=/dashboard", request.url)
            );
        }
    }

    return NextResponse.next();
}

// Apply middleware only to protected routes
export const config = {
    matcher: ["/dashboard", "/api/:path*"],
};
