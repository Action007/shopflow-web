import { cookies } from "next/headers";
import { api, type FetchOptions } from "./api";

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get("access_token")?.value;
}

async function withAuth(options: FetchOptions = {}): Promise<FetchOptions> {
    const token = await getToken();
    return {
        ...options,
        headers: {
            ...options.headers,
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        cache: "no-store", // Authenticated data is always dynamic
    };
}

export async function apiAuthGet<T>(
    endpoint: string,
    options: FetchOptions = {},
): Promise<T> {
    return api<T>(endpoint, { ...(await withAuth(options)), method: "GET" });
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
    });
}

export async function apiAuthDelete<T>(
    endpoint: string,
    options: FetchOptions = {},
): Promise<T> {
    return api<T>(endpoint, { ...(await withAuth(options)), method: "DELETE" });
}
