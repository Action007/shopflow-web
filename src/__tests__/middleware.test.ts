import { beforeEach, describe, expect, it, vi } from "vitest";

const { redirectMock, nextMock } = vi.hoisted(() => ({
    redirectMock: vi.fn(),
    nextMock: vi.fn(),
}));

vi.mock("next/server", () => ({
    NextResponse: {
        redirect: redirectMock,
        next: nextMock,
    },
}));

function makeResponse() {
    return {
        cookies: {
            set: vi.fn(),
        },
    };
}

function makeRequest(
    pathname: string,
    cookies: Record<string, string> = {},
) {
    return {
        url: `http://localhost:3000${pathname}`,
        nextUrl: {
            pathname,
        },
        cookies: {
            get: (name: string) =>
                cookies[name] ? { value: cookies[name] } : undefined,
        },
    };
}

describe("middleware", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetModules();
        vi.stubEnv("API_URL", "http://localhost:3000/api/v1");
        redirectMock.mockImplementation(() => makeResponse());
        nextMock.mockImplementation(() => makeResponse());
    });

    it("redirects unauthenticated users from protected routes to login with callback", async () => {
        const { middleware } = await import("../middleware");

        await middleware(makeRequest("/checkout") as never);

        const redirectUrl = redirectMock.mock.calls[0][0];
        expect(redirectUrl.toString()).toContain("/login");
        expect(redirectUrl.toString()).toContain("callbackUrl=%2Fcheckout");
    });

    it("redirects authenticated users away from auth routes", async () => {
        const { middleware } = await import("../middleware");

        await middleware(
            makeRequest("/login", { access_token: "token" }) as never,
        );

        const redirectUrl = redirectMock.mock.calls[0][0];
        expect(redirectUrl.toString()).toBe("http://localhost:3000/");
    });

    it("refreshes tokens and continues request when only refresh token exists", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({
                    data: {
                        accessToken: "new-access",
                        refreshToken: "new-refresh",
                    },
                }),
            }),
        );

        const { middleware } = await import("../middleware");

        const response = await middleware(
            makeRequest("/orders", { refresh_token: "refresh-only" }) as never,
        );

        expect(nextMock).toHaveBeenCalled();
        expect(response.cookies.set).toHaveBeenCalledTimes(2);
    });

    it("redirects protected routes when refresh fails", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: false,
            }),
        );

        const { middleware } = await import("../middleware");

        await middleware(
            makeRequest("/orders", { refresh_token: "bad-refresh" }) as never,
        );

        const redirectUrl = redirectMock.mock.calls[0][0];
        expect(redirectUrl.toString()).toContain("/login");
        expect(redirectUrl.toString()).toContain("callbackUrl=%2Forders");
    });
});
