import { cookies } from "next/headers";
import { apiAuthGet } from "./api-auth";
import {
    COOKIE_NAMES,
    COOKIE_CONFIG,
    TOKEN_EXPIRY,
} from "@/lib/constants/auth";
import type { User } from "@/types/user";
import { API_ROUTES } from "./constants/routes";

export async function setAuthCookies(
    accessToken: string,
    refreshToken: string,
) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
        httpOnly: COOKIE_CONFIG.HTTPONLY,
        secure: COOKIE_CONFIG.SECURE,
        sameSite: COOKIE_CONFIG.SAME_SITE,
        path: COOKIE_CONFIG.PATH_ROOT,
        maxAge: TOKEN_EXPIRY.ACCESS_TOKEN,
    });
    cookieStore.set(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
        httpOnly: COOKIE_CONFIG.HTTPONLY,
        secure: COOKIE_CONFIG.SECURE,
        sameSite: COOKIE_CONFIG.SAME_SITE,
        path: COOKIE_CONFIG.PATH_AUTH,
        maxAge: TOKEN_EXPIRY.REFRESH_TOKEN,
    });
}

export async function clearAuthCookies() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAMES.ACCESS_TOKEN);
    cookieStore.delete(COOKIE_NAMES.REFRESH_TOKEN);
}

export async function getAccessToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;
}

export async function getCurrentUser(): Promise<User | null> {
    const token = await getAccessToken();
    if (!token) return null;

    try {
        return await apiAuthGet<User>(API_ROUTES.USER.ME);
    } catch {
        return null;
    }
}
