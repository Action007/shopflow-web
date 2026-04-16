import { cookies } from "next/headers";
import {
    COOKIE_CONFIG,
    COOKIE_NAMES,
    TOKEN_EXPIRY,
} from "@/lib/constants/auth";

type AuthCookieSetter = {
    set: (
        name: string,
        value: string,
        options: {
            httpOnly: boolean;
            secure: boolean;
            sameSite: typeof COOKIE_CONFIG.SAME_SITE;
            path: string;
            maxAge: number;
        },
    ) => unknown;
};

type AuthCookieDeleter = {
    delete: (name: string) => unknown;
};

const ACCESS_TOKEN_COOKIE_OPTIONS = {
    httpOnly: COOKIE_CONFIG.HTTPONLY,
    secure: COOKIE_CONFIG.SECURE,
    sameSite: COOKIE_CONFIG.SAME_SITE,
    path: COOKIE_CONFIG.PATH_ROOT,
    maxAge: TOKEN_EXPIRY.ACCESS_TOKEN,
} as const;

const REFRESH_TOKEN_COOKIE_OPTIONS = {
    httpOnly: COOKIE_CONFIG.HTTPONLY,
    secure: COOKIE_CONFIG.SECURE,
    sameSite: COOKIE_CONFIG.SAME_SITE,
    path: COOKIE_CONFIG.PATH_AUTH,
    maxAge: TOKEN_EXPIRY.REFRESH_TOKEN,
} as const;

export function writeAuthCookies(
    cookieTarget: AuthCookieSetter,
    accessToken: string,
    refreshToken: string,
) {
    cookieTarget.set(
        COOKIE_NAMES.ACCESS_TOKEN,
        accessToken,
        ACCESS_TOKEN_COOKIE_OPTIONS,
    );
    cookieTarget.set(
        COOKIE_NAMES.REFRESH_TOKEN,
        refreshToken,
        REFRESH_TOKEN_COOKIE_OPTIONS,
    );
}

export function removeAuthCookies(cookieTarget: AuthCookieDeleter) {
    cookieTarget.delete(COOKIE_NAMES.ACCESS_TOKEN);
    cookieTarget.delete(COOKIE_NAMES.REFRESH_TOKEN);
}

export async function setAuthCookies(
    accessToken: string,
    refreshToken: string,
) {
    const cookieStore = await cookies();
    writeAuthCookies(cookieStore, accessToken, refreshToken);
}

export async function clearAuthCookies() {
    const cookieStore = await cookies();
    removeAuthCookies(cookieStore);
}

export async function getAccessToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;
}
