import { beforeEach, describe, expect, it, vi } from "vitest";
import { ERRORS } from "@/lib/constants/errors";
import { ROUTES } from "@/lib/constants/routes";

const { apiPostMock, setAuthCookiesMock, clearAuthCookiesMock } = vi.hoisted(
    () => ({
        apiPostMock: vi.fn(),
        setAuthCookiesMock: vi.fn(),
        clearAuthCookiesMock: vi.fn(),
    }),
);

const { redirectMock, revalidatePathMock } = vi.hoisted(() => ({
    redirectMock: vi.fn(),
    revalidatePathMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
    redirect: redirectMock,
}));

vi.mock("next/cache", () => ({
    revalidatePath: revalidatePathMock,
}));

vi.mock("@/lib/api", async () => {
    class MockApiClientError extends Error {
        constructor(
            message: string,
            public statusCode: number,
            public fieldErrors?: Record<string, string[]>,
        ) {
            super(message);
            this.name = "ApiClientError";
        }
    }

    return {
        apiPost: apiPostMock,
        ApiClientError: MockApiClientError,
    };
});

vi.mock("@/lib/auth", () => ({
    setAuthCookies: setAuthCookiesMock,
    clearAuthCookies: clearAuthCookiesMock,
}));

import { ApiClientError } from "@/lib/api";
import { loginAction, logoutAction, registerAction } from "../auth";

function makeFormData(
    values: Record<string, string>,
): FormData {
    const formData = new FormData();

    for (const [key, value] of Object.entries(values)) {
        formData.set(key, value);
    }

    return formData;
}

describe("auth actions", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("loginAction", () => {
        it("returns field errors for invalid input", async () => {
            const result = await loginAction(
                { success: false },
                makeFormData({
                    email: "bad-email",
                    password: "123",
                }),
            );

            expect(result.success).toBe(false);
            expect(result.fieldErrors?.email?.[0]).toBeTruthy();
            expect(result.fieldErrors?.password?.[0]).toBeTruthy();
            expect(result.values).toEqual({
                email: "bad-email",
                password: "123",
            });
            expect(apiPostMock).not.toHaveBeenCalled();
        });

        it("returns invalid credentials message for 401 responses", async () => {
            apiPostMock.mockRejectedValueOnce(
                new ApiClientError("Unauthorized", 401),
            );

            const result = await loginAction(
                { success: false },
                makeFormData({
                    email: "user@example.com",
                    password: "123456",
                }),
            );

            expect(result).toEqual({
                success: false,
                message: ERRORS.AUTH.INVALID_CREDENTIALS,
                values: {
                    email: "user@example.com",
                    password: "123456",
                },
            });
        });

        it("sets auth cookies and redirects to callback url on success", async () => {
            apiPostMock.mockResolvedValueOnce({
                accessToken: "access",
                refreshToken: "refresh",
            });

            await loginAction(
                { success: false },
                makeFormData({
                    email: "user@example.com",
                    password: "123456",
                    callbackUrl: "/orders",
                }),
            );

            expect(setAuthCookiesMock).toHaveBeenCalledWith("access", "refresh");
            expect(revalidatePathMock).toHaveBeenCalledWith(ROUTES.HOME, "layout");
            expect(redirectMock).toHaveBeenCalledWith("/orders");
        });

        it("returns generic message for unexpected login errors", async () => {
            apiPostMock.mockRejectedValueOnce(new Error("boom"));

            const result = await loginAction(
                { success: false },
                makeFormData({
                    email: "user@example.com",
                    password: "123456",
                }),
            );

            expect(result).toEqual({
                success: false,
                message: ERRORS.AUTH.GENERIC,
                values: {
                    email: "user@example.com",
                    password: "123456",
                },
            });
        });
    });

    describe("registerAction", () => {
        it("returns field errors for invalid registration input", async () => {
            const result = await registerAction(
                { success: false },
                makeFormData({
                    firstName: "",
                    lastName: "",
                    email: "bad-email",
                    password: "123",
                    confirmPassword: "456",
                }),
            );

            expect(result.success).toBe(false);
            expect(result.fieldErrors?.firstName?.[0]).toBeTruthy();
            expect(result.fieldErrors?.lastName?.[0]).toBeTruthy();
            expect(result.fieldErrors?.email?.[0]).toBeTruthy();
            expect(result.fieldErrors?.password?.[0]).toBeTruthy();
            expect(result.fieldErrors?.confirmPassword?.[0]).toBeTruthy();
            expect(result.values).toEqual({
                firstName: "",
                lastName: "",
                email: "bad-email",
                password: "123",
                confirmPassword: "456",
            });
        });

        it("returns api field errors for conflict responses", async () => {
            apiPostMock.mockRejectedValueOnce(
                new ApiClientError("Conflict", 409, {
                    email: [ERRORS.AUTH.EMAIL_ALREADY_EXISTS],
                }),
            );

            const result = await registerAction(
                { success: false },
                makeFormData({
                    firstName: "Jane",
                    lastName: "Doe",
                    email: "jane@example.com",
                    password: "password123",
                    confirmPassword: "password123",
                }),
            );

            expect(result).toEqual({
                success: false,
                message: ERRORS.AUTH.EMAIL_ALREADY_EXISTS,
                fieldErrors: {
                    email: [ERRORS.AUTH.EMAIL_ALREADY_EXISTS],
                },
                values: {
                    firstName: "Jane",
                    lastName: "Doe",
                    email: "jane@example.com",
                    password: "password123",
                    confirmPassword: "password123",
                },
            });
        });

        it("sets auth cookies and redirects to home by default on success", async () => {
            apiPostMock.mockResolvedValueOnce({
                accessToken: "access",
                refreshToken: "refresh",
            });

            await registerAction(
                { success: false },
                makeFormData({
                    firstName: "Jane",
                    lastName: "Doe",
                    email: "jane@example.com",
                    password: "password123",
                    confirmPassword: "password123",
                }),
            );

            expect(setAuthCookiesMock).toHaveBeenCalledWith("access", "refresh");
            expect(revalidatePathMock).toHaveBeenCalledWith(ROUTES.HOME, "layout");
            expect(redirectMock).toHaveBeenCalledWith(ROUTES.HOME);
        });

        it("returns generic message for unexpected registration errors", async () => {
            apiPostMock.mockRejectedValueOnce(new Error("boom"));

            const result = await registerAction(
                { success: false },
                makeFormData({
                    firstName: "Jane",
                    lastName: "Doe",
                    email: "jane@example.com",
                    password: "password123",
                    confirmPassword: "password123",
                }),
            );

            expect(result).toEqual({
                success: false,
                message: ERRORS.AUTH.GENERIC,
                values: {
                    firstName: "Jane",
                    lastName: "Doe",
                    email: "jane@example.com",
                    password: "password123",
                    confirmPassword: "password123",
                },
            });
        });
    });

    describe("logoutAction", () => {
        it("clears auth cookies and redirects to login", async () => {
            await logoutAction();

            expect(clearAuthCookiesMock).toHaveBeenCalled();
            expect(revalidatePathMock).toHaveBeenCalledWith(ROUTES.HOME, "layout");
            expect(redirectMock).toHaveBeenCalledWith(ROUTES.LOGIN);
        });
    });
});
