import { cookies } from "next/headers";
import { api, type FetchOptions } from "./api";
import { COOKIE_NAMES, HEADER_NAMES } from "@/lib/constants/auth";

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;
}

async function withAuth(options: FetchOptions = {}): Promise<FetchOptions> {
    const token = await getToken();
    return {
        ...options,
        redirectOn401: options.redirectOn401 ?? true,
        headers: {
            ...options.headers,
            ...(token && { [HEADER_NAMES.AUTHORIZATION]: `Bearer ${token}` }),
        },
    };
}

export async function apiAuthGet<T>(
    endpoint: string,
    options: FetchOptions = {},
): Promise<T> {
    const hasCacheControls =
        Boolean(options.tags?.length) || options.revalidate !== undefined;

    return api<T>(endpoint, {
        ...(await withAuth(options)),
        method: "GET",
        cache: options.cache ?? (hasCacheControls ? "force-cache" : "no-store"),
    });
}

export async function apiAuthPost<T>(
    endpoint: string,
    data?: unknown,
    options: FetchOptions = {},
): Promise<T> {
    return api<T>(endpoint, {
        ...(await withAuth(options)),
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
        cache: "no-store",
    });
}

export async function apiAuthPatch<T>(
    endpoint: string,
    data: unknown,
    options: FetchOptions = {},
): Promise<T> {
    return api<T>(endpoint, {
        ...(await withAuth(options)),
        method: "PATCH",
        body: JSON.stringify(data),
        cache: "no-store",
    });
}

export async function apiAuthDelete<T>(
    endpoint: string,
    options: FetchOptions = {},
): Promise<T> {
    return api<T>(endpoint, {
        ...(await withAuth(options)),
        method: "DELETE",
        cache: "no-store",
    });
}

export async function apiAuthPostForm<T>(
    endpoint: string,
    data: FormData,
    options: FetchOptions = {},
): Promise<T> {
    return api<T>(endpoint, {
        ...(await withAuth(options)),
        method: "POST",
        body: data,
        cache: "no-store",
    });
}
