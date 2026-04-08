import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
    ROUTES,
    PROTECTED_ROUTES,
    AUTH_ROUTES,
} from "@/lib/constants/routes";
import {
    COOKIE_NAMES,
    COOKIE_CONFIG,
    TOKEN_EXPIRY,
    ENV_VARS,
} from "@/lib/constants/auth";

const protectedRoutes = PROTECTED_ROUTES;
const authRoutes = AUTH_ROUTES;

const API_URL = ENV_VARS.API_URL;

function setAuthCookies(
    response: NextResponse,
    accessToken: string,
    refreshToken: string,
): void {
    response.cookies.set(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
        httpOnly: COOKIE_CONFIG.HTTPONLY,
        secure: COOKIE_CONFIG.SECURE,
        sameSite: COOKIE_CONFIG.SAME_SITE,
        path: COOKIE_CONFIG.PATH_ROOT,
        maxAge: TOKEN_EXPIRY.ACCESS_TOKEN,
    });
    response.cookies.set(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
        httpOnly: COOKIE_CONFIG.HTTPONLY,
        secure: COOKIE_CONFIG.SECURE,
        sameSite: COOKIE_CONFIG.SAME_SITE,
        path: COOKIE_CONFIG.PATH_AUTH,
        maxAge: TOKEN_EXPIRY.REFRESH_TOKEN,
    });
}

async function tryRefreshTokens(
    refreshToken: string,
): Promise<{ accessToken: string; refreshToken: string } | null> {
    if (!API_URL) {
        console.error(
            "[Middleware] API_URL is not defined — cannot refresh tokens.",
        );
        return null;
    }

    try {
        const res = await fetch(`${API_URL}/auth/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: `refresh_token=${refreshToken}`,
            },
        });

        if (!res.ok) return null;

        const body = await res.json();

        if (!body?.data?.accessToken || !body?.data?.refreshToken) {
            console.error(
                "[Middleware] Unexpected refresh response shape:",
                body,
            );
            return null;
        }

        return {
            accessToken: body.data.accessToken,
            refreshToken: body.data.refreshToken,
        };
    } catch (err) {
        console.error("[Middleware] Token refresh request failed:", err);
        return null;
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;
    const refreshToken = request.cookies.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;

    const isProtected = protectedRoutes.some((route) =>
        pathname.startsWith(route),
    );
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    let isAuthenticated = !!accessToken;
    let newTokens: { accessToken: string; refreshToken: string } | null = null;

    if (!accessToken && refreshToken) {
        newTokens = await tryRefreshTokens(refreshToken);
        isAuthenticated = newTokens !== null;
    }

    // Unauthenticated user hitting a protected route
    if (isProtected && !isAuthenticated) {
        const loginUrl = new URL(ROUTES.LOGIN, request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Authenticated user hitting an auth route
    if (isAuthRoute && isAuthenticated) {
        const response = NextResponse.redirect(
            new URL(ROUTES.HOME, request.url),
        );
        if (newTokens) {
            setAuthCookies(
                response,
                newTokens.accessToken,
                newTokens.refreshToken,
            );
        }
        return response;
    }

    // Default: allow request through, attach refreshed cookies if needed
    const response = NextResponse.next();
    if (newTokens) {
        setAuthCookies(response, newTokens.accessToken, newTokens.refreshToken);
    }
    return response;
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
