import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/cart", "/checkout", "/orders"];
const authRoutes = ["/login", "/register"];

const API_URL = process.env.API_URL;

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("access_token")?.value;
    const refreshToken = request.cookies.get("refresh_token")?.value;

    let isAuthenticated = !!accessToken;

    // If no access token but refresh token exists, try to refresh
    if (!accessToken && refreshToken && API_URL) {
        try {
            const res = await fetch(`${API_URL}/auth/refresh`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken }),
            });

            if (res.ok) {
                const body = await res.json();
                const { accessToken: newAccess, refreshToken: newRefresh } =
                    body.data;

                // Create response and set new cookies
                const response = NextResponse.next();
                response.cookies.set("access_token", newAccess, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    path: "/",
                    maxAge: 60 * 15,
                });
                response.cookies.set("refresh_token", newRefresh, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    path: "/",
                    maxAge: 60 * 60 * 24 * 7,
                });

                isAuthenticated = true;

                // For protected routes, continue with new cookies
                const isProtected = protectedRoutes.some((route) =>
                    pathname.startsWith(route),
                );
                const isAuthRoute = authRoutes.some((route) =>
                    pathname.startsWith(route),
                );

                if (isAuthRoute) {
                    const redirectResponse = NextResponse.redirect(
                        new URL("/", request.url),
                    );
                    redirectResponse.cookies.set("access_token", newAccess, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "lax",
                        path: "/",
                        maxAge: 60 * 15,
                    });
                    redirectResponse.cookies.set("refresh_token", newRefresh, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "lax",
                        path: "/",
                        maxAge: 60 * 60 * 24 * 7,
                    });
                    return redirectResponse;
                }

                return response;
            }
        } catch {
            // Refresh failed — treat as unauthenticated
        }
    }

    // Protected routes — redirect to login if not authenticated
    const isProtected = protectedRoutes.some((route) =>
        pathname.startsWith(route),
    );
    if (isProtected && !isAuthenticated) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Auth routes — redirect to home if already authenticated
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
    if (isAuthRoute && isAuthenticated) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
