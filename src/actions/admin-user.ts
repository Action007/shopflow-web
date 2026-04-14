"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import * as v from "valibot";
import { ApiClientError } from "@/lib/api";
import { apiAuthDelete, apiAuthPatch } from "@/lib/api-auth";
import { API_ROUTES, ROUTES } from "@/lib/constants/routes";
import { updateProfileSchema } from "@/lib/validations/user";
import type { UpdateProfileInput } from "@/types/user";

export interface AdminUserActionResult {
    success: boolean;
    message?: string;
    fieldErrors?: Record<string, string[]>;
}

function invalidateAdminUserCaches(userId?: string) {
    revalidatePath(ROUTES.ADMIN.USERS);
    revalidatePath(ROUTES.ADMIN.ROOT);
    revalidatePath(ROUTES.PROFILE);
    revalidatePath(ROUTES.HOME, "layout");

    if (userId) {
        revalidateTag(`user-${userId}`, "max");
    }
}

export async function updateAdminUserAction(
    userId: string,
    values: UpdateProfileInput,
): Promise<AdminUserActionResult> {
    const parsed = v.safeParse(updateProfileSchema, values);

    if (!parsed.success) {
        return {
            success: false,
            fieldErrors: v.flatten<typeof updateProfileSchema>(parsed.issues)
                .nested as Record<string, string[]>,
        };
    }

    const { imageUploadId, ...rest } = parsed.output;
    const payload = imageUploadId ? { ...rest, imageUploadId } : rest;

    try {
        await apiAuthPatch(API_ROUTES.USER.DETAIL(userId), payload);
        invalidateAdminUserCaches(userId);

        return { success: true };
    } catch (error) {
        if (error instanceof ApiClientError) {
            return {
                success: false,
                message: error.message,
                fieldErrors: error.fieldErrors,
            };
        }

        return {
            success: false,
            message: "Failed to update user",
        };
    }
}

export async function deleteAdminUserAction(
    userId: string,
): Promise<AdminUserActionResult> {
    try {
        await apiAuthDelete(API_ROUTES.USER.DETAIL(userId));
        invalidateAdminUserCaches(userId);

        return { success: true };
    } catch (error) {
        if (error instanceof ApiClientError) {
            return {
                success: false,
                message: error.message,
            };
        }

        return {
            success: false,
            message: "Failed to delete user",
        };
    }
}
