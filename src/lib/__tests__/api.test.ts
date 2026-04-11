import { beforeEach, describe, expect, it, vi } from "vitest";

const { redirectMock } = vi.hoisted(() => ({
    redirectMock: vi.fn(),
}));

const { cookiesMock } = vi.hoisted(() => ({
    cookiesMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
    redirect: redirectMock,
}));

vi.mock("next/headers", () => ({
    cookies: cookiesMock,
}));

describe("api helpers", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.unstubAllEnvs();
        vi.stubEnv("API_URL", "http://localhost:3000/api/v1");
    });

    it("apiPost returns response data on success", async () => {
        vi.resetModules();
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({
                    success: true,
                    data: { id: "1" },
                }),
            }),
        );

        const { apiPost } = await import("../api");

        await expect(apiPost("/products", { name: "Laptop" })).resolves.toEqual({
            id: "1",
        });
    });

    it("api redirects on 401 when redirectOn401 is true", async () => {
        vi.resetModules();
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: false,
                status: 401,
                statusText: "Unauthorized",
                json: async () => ({
                    success: false,
                    statusCode: 401,
                    message: "Unauthorized",
                    timestamp: "2024-01-01",
                    path: "/me",
                }),
            }),
        );

        const { apiGet } = await import("../api");

        await expect(
            apiGet("/me", { redirectOn401: true }),
        ).rejects.toThrow("Unauthorized");
        expect(redirectMock).toHaveBeenCalledWith("/login");
    });

    it("api throws ApiClientError for non-ok responses", async () => {
        vi.resetModules();
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: false,
                status: 400,
                statusText: "Bad Request",
                json: async () => ({
                    success: false,
                    statusCode: 400,
                    message: "Invalid payload",
                    errors: { email: ["Invalid"] },
                    timestamp: "2024-01-01",
                    path: "/auth/login",
                }),
            }),
        );

        const { ApiClientError, apiPost } = await import("../api");

        await expect(apiPost("/auth/login", {})).rejects.toBeInstanceOf(
            ApiClientError,
        );
    });

    it("apiAuthPost adds bearer token from cookies", async () => {
        vi.resetModules();
        cookiesMock.mockResolvedValue({
            get: (name: string) =>
                name === "access_token" ? { value: "token-123" } : undefined,
        });

        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                success: true,
                data: { ok: true },
            }),
        });
        vi.stubGlobal("fetch", fetchMock);

        const { apiAuthPost } = await import("../api-auth");

        await apiAuthPost("/cart", { productId: "prod-1" });

        expect(fetchMock).toHaveBeenCalledWith(
            "http://localhost:3000/api/v1/cart",
            expect.objectContaining({
                method: "POST",
                headers: expect.objectContaining({
                    Authorization: "Bearer token-123",
                    "Content-Type": "application/json",
                }),
            }),
        );
    });
});
