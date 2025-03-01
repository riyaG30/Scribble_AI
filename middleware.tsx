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

    const isAuth = await isAuthenticated();

    if (!isAuth) {
        if (request.nextUrl.pathname !== "/api/auth/login") {
            return NextResponse.redirect(new URL("/api/auth/login", request.url));
        }
    } else {
        // Redirect to the post-login URL if authenticated
        const postLoginRedirectUrl = process.env.KINDE_POST_LOGIN_REDIRECT_URL || "/dashboard";
        if (request.nextUrl.pathname === "/api/auth/login") {
            return NextResponse.redirect(new URL(postLoginRedirectUrl, request.url));
        }
    }

    return NextResponse.next();
}

// Apply middleware only to protected routes
export const config = {
    matcher: ["/dashboard", "/api/:path*"],
};
