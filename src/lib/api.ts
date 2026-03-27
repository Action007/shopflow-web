const API_URL = process.env.API_URL;

if (!API_URL) {
    throw new Error("API_URL environment variable is not set");
}

interface ApiResponse<T> {
    success: boolean;
    data: T;
    timestamp: string;
}

interface ApiError {
    success: boolean;
    statusCode: number;
    message: string;
    errors?: Record<string, string[]>;
    timestamp: string;
    path: string;
}

export interface FetchOptions extends Omit<RequestInit, "headers"> {
    headers?: Record<string, string>;
    tags?: string[];
    revalidate?: number | false;
}

export class ApiClientError extends Error {
    constructor(
        message: string,
        public statusCode: number,
        public fieldErrors?: Record<string, string[]>,
    ) {
        super(message);
        this.name = "ApiClientError";
    }
}

export async function api<T>(
    endpoint: string,
    options: FetchOptions = {},
): Promise<T> {
    const { tags, revalidate, headers = {}, ...fetchOptions } = options;

    const url = `${API_URL}${endpoint}`;

    // Build next config — merge tags and revalidate into a single object
    const nextConfig: { tags?: string[]; revalidate?: number | false } = {};
    if (tags) nextConfig.tags = tags;
    if (revalidate !== undefined) nextConfig.revalidate = revalidate;

    const res = await fetch(url, {
        ...fetchOptions,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        ...(Object.keys(nextConfig).length > 0 && { next: nextConfig }),
    });

    if (!res.ok) {
        const errorBody: ApiError = await res.json().catch(() => ({
            success: false,
            statusCode: res.status,
            message: res.statusText,
            timestamp: new Date().toISOString(),
            path: endpoint,
        }));

        throw new ApiClientError(
            errorBody.message,
            errorBody.statusCode,
            errorBody.errors,
        );
    }

    const body: ApiResponse<T> = await res.json();
    return body.data;
}

// Convenience methods for public (unauthenticated) requests
export async function apiGet<T>(
    endpoint: string,
    options: FetchOptions = {},
): Promise<T> {
    return api<T>(endpoint, { ...options, method: "GET" });
}

export async function apiPost<T>(
    endpoint: string,
    data?: unknown,
    options: FetchOptions = {},
): Promise<T> {
    return api<T>(endpoint, {
        ...options,
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
    });
}

export async function apiPatch<T>(
    endpoint: string,
    data: unknown,
    options: FetchOptions = {},
): Promise<T> {
    return api<T>(endpoint, {
        ...options,
        method: "PATCH",
        body: JSON.stringify(data),
    });
}

export async function apiDelete<T>(
    endpoint: string,
    options: FetchOptions = {},
): Promise<T> {
    return api<T>(endpoint, { ...options, method: "DELETE" });
}
