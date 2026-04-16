import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
    ROUTES,
    PROTECTED_ROUTES,
    AUTH_ROUTES,
} from "@/lib/constants/routes";
import {
    COOKIE_NAMES,
    ENV_VARS,
} from "@/lib/constants/auth";
import { writeAuthCookies } from "@/lib/auth-cookies";

const protectedRoutes = PROTECTED_ROUTES;
const authRoutes = AUTH_ROUTES;

const API_URL = ENV_VARS.API_URL;

async function tryRefreshTokens(
    refreshToken: string,
): Promise<{ accessToken: string; refreshToken: string } | null> {
    if (!API_URL) {
        console.error(
            "[Proxy] API_URL is not defined — cannot refresh tokens.",
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
            console.error("[Proxy] Unexpected refresh response shape:", body);
            return null;
        }

        return {
            accessToken: body.data.accessToken,
            refreshToken: body.data.refreshToken,
        };
    } catch (err) {
        console.error("[Proxy] Token refresh request failed:", err);
        return null;
    }
}

export async function proxy(request: NextRequest) {
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

    if (isProtected && !isAuthenticated) {
        const loginUrl = new URL(ROUTES.LOGIN, request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (isAuthRoute && isAuthenticated) {
        const response = NextResponse.redirect(
            new URL(ROUTES.HOME, request.url),
        );
        if (newTokens) {
            writeAuthCookies(
                response.cookies,
                newTokens.accessToken,
                newTokens.refreshToken,
            );
        }
        return response;
    }

    const response = NextResponse.next();
    if (newTokens) {
        writeAuthCookies(
            response.cookies,
            newTokens.accessToken,
            newTokens.refreshToken,
        );
    }
    return response;
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|icon|favicon.ico).*)"],
};
