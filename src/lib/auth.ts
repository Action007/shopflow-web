import { cookies } from "next/headers";
import { apiGet } from "./api";
import type { User } from "@/types/user";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
};

export async function setAuthCookies(
    accessToken: string,
    refreshToken: string,
) {
    const cookieStore = await cookies();
    cookieStore.set(ACCESS_TOKEN_KEY, accessToken, {
        ...cookieOptions,
        maxAge: 60 * 15, // 15 minutes
    });
    cookieStore.set(REFRESH_TOKEN_KEY, refreshToken, {
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });
}

export async function clearAuthCookies() {
    const cookieStore = await cookies();
    cookieStore.delete(ACCESS_TOKEN_KEY);
    cookieStore.delete(REFRESH_TOKEN_KEY);
}

export async function getAccessToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(ACCESS_TOKEN_KEY)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(REFRESH_TOKEN_KEY)?.value;
}

export async function getCurrentUser(): Promise<User | null> {
    const token = await getAccessToken();
    if (!token) return null;

    try {
        return await apiGet<User>("/auth/profile", {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        });
    } catch {
        return null;
    }
}
