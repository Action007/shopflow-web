"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import * as v from "valibot";
import { ApiClientError } from "@/lib/api";
import { apiAuthDelete, apiAuthPatch, apiAuthPost } from "@/lib/api-auth";
import { CACHE_TAGS } from "@/lib/constants/cache";
import { ERRORS } from "@/lib/constants/errors";
import { API_ROUTES, ROUTES } from "@/lib/constants/routes";
import {
    createCategorySchema,
    updateCategorySchema,
} from "@/lib/validations/category";
import type {
    CreateCategoryInput,
    UpdateCategoryInput,
} from "@/types/product";

export interface AdminCategoryActionResult {
    success: boolean;
    message?: string;
    fieldErrors?: Record<string, string[]>;
}

function invalidateCategoryAdminCaches() {
    revalidateTag(CACHE_TAGS.PRODUCTS, "max");
    revalidateTag(CACHE_TAGS.CATEGORIES, "max");
    revalidatePath(ROUTES.PRODUCTS);
    revalidatePath(ROUTES.ADMIN.PRODUCTS);
    revalidatePath(ROUTES.ADMIN.CATEGORIES);
    revalidatePath(ROUTES.ADMIN.ROOT);
}

export async function createAdminCategoryAction(
    values: CreateCategoryInput,
): Promise<AdminCategoryActionResult> {
    const parsed = v.safeParse(createCategorySchema, values);

    if (!parsed.success) {
        return {
            success: false,
            fieldErrors: v.flatten<typeof createCategorySchema>(parsed.issues)
                .nested as Record<string, string[]>,
        };
    }

    try {
        await apiAuthPost(
            API_ROUTES.CATEGORIES.LIST,
            normalizeCategoryPayload(parsed.output),
        );
        invalidateCategoryAdminCaches();
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
            message: ERRORS.ADMIN.CATEGORY_CREATE_FAILED,
        };
    }
}

export async function updateAdminCategoryAction(
    categoryId: string,
    values: UpdateCategoryInput,
): Promise<AdminCategoryActionResult> {
    const parsed = v.safeParse(updateCategorySchema, values);

    if (!parsed.success) {
        return {
            success: false,
            fieldErrors: v.flatten<typeof updateCategorySchema>(parsed.issues)
                .nested as Record<string, string[]>,
        };
    }

    try {
        await apiAuthPatch(
            API_ROUTES.CATEGORIES.DETAIL(categoryId),
            normalizeCategoryPayload(parsed.output),
        );
        invalidateCategoryAdminCaches();
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
            message: ERRORS.ADMIN.CATEGORY_UPDATE_FAILED,
        };
    }
}

export async function deleteAdminCategoryAction(
    categoryId: string,
): Promise<AdminCategoryActionResult> {
    try {
        await apiAuthDelete(API_ROUTES.CATEGORIES.DETAIL(categoryId));
        invalidateCategoryAdminCaches();
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
            message: ERRORS.ADMIN.CATEGORY_DELETE_FAILED,
        };
    }
}

function normalizeCategoryPayload(
    values: CreateCategoryInput | UpdateCategoryInput,
) {
    return {
        ...values,
        name: values.name.trim(),
        description: values.description?.trim() || undefined,
        parentId: values.parentId || undefined,
    };
}
