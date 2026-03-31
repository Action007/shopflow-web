"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiPost } from "@/lib/api";
import { ApiClientError } from "@/lib/api";
import { setAuthCookies, clearAuthCookies } from "@/lib/auth";
import { loginSchema, registerSchema } from "@/lib/validations/auth";
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
    const raw = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const parsed = loginSchema.safeParse(raw);
    if (!parsed.success) {
        return {
            success: false,
            fieldErrors: parsed.error.flatten().fieldErrors as Record<
                string,
                string[]
            >,
        };
    }

    try {
        const result = await apiPost<AuthResponse>("/auth/login", parsed.data);
        await setAuthCookies(result.accessToken, result.refreshToken);
    } catch (error) {
        if (error instanceof ApiClientError) {
            return {
                success: false,
                message:
                    error.statusCode === 401
                        ? "Invalid email or password"
                        : error.message,
            };
        }
        return {
            success: false,
            message: "Something went wrong. Please try again.",
        };
    }

    // redirect() outside try/catch — it throws internally
    revalidatePath("/", "layout");
    redirect("/");
}

export async function registerAction(
    _prevState: ActionResult,
    formData: FormData,
): Promise<ActionResult> {
    const raw = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        confirmPassword: formData.get("confirmPassword") as string,
    };

    const parsed = registerSchema.safeParse(raw);
    if (!parsed.success) {
        return {
            success: false,
            fieldErrors: parsed.error.flatten().fieldErrors as Record<
                string,
                string[]
            >,
        };
    }

    try {
        const { confirmPassword: _, ...registerData } = parsed.data;
        const result = await apiPost<AuthResponse>(
            "/auth/register",
            registerData,
        );
        await setAuthCookies(result.accessToken, result.refreshToken);
    } catch (error) {
        if (error instanceof ApiClientError) {
            return {
                success: false,
                message:
                    error.statusCode === 409
                        ? "An account with this email already exists"
                        : error.message,
                fieldErrors: error.fieldErrors,
            };
        }
        return {
            success: false,
            message: "Something went wrong. Please try again.",
        };
    }

    revalidatePath("/", "layout");
    redirect("/");
}

export async function logoutAction() {
    await clearAuthCookies();
    revalidatePath("/", "layout");
    redirect("/login");
}
