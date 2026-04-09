"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiPost } from "@/lib/api";
import { ApiClientError } from "@/lib/api";
import { setAuthCookies, clearAuthCookies } from "@/lib/auth";
import * as v from "valibot";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
import { ERRORS } from "@/lib/constants/errors";
import { ROUTES, API_ROUTES } from "@/lib/constants/routes";
import type { AuthResponse } from "@/types/user";

export interface ActionResult {
    success: boolean;
    message?: string;
    fieldErrors?: Record<string, string[]>;
}

export async function loginAction(
    _prevState: ActionResult,
    formData: FormData,
): Promise<ActionResult> {
    const callbackUrl = (formData.get("callbackUrl") as string) || ROUTES.HOME;
    const raw = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const parsed = v.safeParse(loginSchema, raw);
    if (!parsed.success) {
        return {
            success: false,
            fieldErrors: v.flatten<typeof loginSchema>(parsed.issues).nested as Record<
                string,
                string[]
            >,
        };
    }

    try {
        const result = await apiPost<AuthResponse>(API_ROUTES.AUTH.LOGIN, parsed.output);
        await setAuthCookies(result.accessToken, result.refreshToken);
    } catch (error) {
        if (error instanceof ApiClientError) {
            return {
                success: false,
                message:
                    error.statusCode === 401
                        ? ERRORS.AUTH.INVALID_CREDENTIALS
                        : error.message,
            };
        }
        return {
            success: false,
            message: ERRORS.AUTH.GENERIC,
        };
    }

    revalidatePath(ROUTES.HOME, "layout");
    redirect(callbackUrl);
}

export async function registerAction(
    _prevState: ActionResult,
    formData: FormData,
): Promise<ActionResult> {
    const callbackUrl = (formData.get("callbackUrl") as string) || ROUTES.HOME;
    const raw = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        confirmPassword: formData.get("confirmPassword") as string,
    };

    const parsed = v.safeParse(registerSchema, raw);
    if (!parsed.success) {
        return {
            success: false,
            fieldErrors: v.flatten<typeof registerSchema>(parsed.issues).nested as Record<
                string,
                string[]
            >,
        };
    }

    try {
        const { confirmPassword, ...registerData } = parsed.output;
        void confirmPassword;
        const result = await apiPost<AuthResponse>(
            API_ROUTES.AUTH.REGISTER,
            registerData,
        );
        await setAuthCookies(result.accessToken, result.refreshToken);
    } catch (error) {
        if (error instanceof ApiClientError) {
            return {
                success: false,
                message:
                    error.statusCode === 409
                        ? ERRORS.AUTH.EMAIL_ALREADY_EXISTS
                        : error.message,
                fieldErrors: error.fieldErrors,
            };
        }
        return {
            success: false,
            message: ERRORS.AUTH.GENERIC,
        };
    }

    revalidatePath(ROUTES.HOME, "layout");
    redirect(callbackUrl);
}

export async function logoutAction() {
    await clearAuthCookies();
    revalidatePath(ROUTES.HOME, "layout");
    redirect(ROUTES.LOGIN);
}
