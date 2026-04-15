"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import * as v from "valibot";
import { ApiClientError } from "@/lib/api";
import { apiAuthPatch } from "@/lib/api-auth";
import { CACHE_TAGS } from "@/lib/constants/cache";
import { ERRORS } from "@/lib/constants/errors";
import { ROUTES, API_ROUTES } from "@/lib/constants/routes";
import { updateProfileSchema } from "@/lib/validations/user";
import type { UpdateProfileInput } from "@/types/user";

export interface UpdateProfileActionResult {
    success: boolean;
    message?: string;
    fieldErrors?: Record<string, string[]>;
}

export async function updateProfileAction(
    userId: string,
    values: UpdateProfileInput,
): Promise<UpdateProfileActionResult> {
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
        revalidateTag(CACHE_TAGS.USERS, "max");
        revalidatePath(ROUTES.PROFILE);
        revalidatePath(ROUTES.HOME, "layout");

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
            message: ERRORS.PROFILE.UPDATE_FAILED,
        };
    }
}
