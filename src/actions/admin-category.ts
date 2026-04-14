"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import * as v from "valibot";
import { ApiClientError } from "@/lib/api";
import { apiAuthDelete, apiAuthPatch, apiAuthPost } from "@/lib/api-auth";
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
    revalidateTag("products", "max");
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
        await apiAuthPost(API_ROUTES.CATEGORIES, normalizeCategoryPayload(parsed.output));
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
            message: "Failed to create category",
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
            `${API_ROUTES.CATEGORIES}/${categoryId}`,
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
            message: "Failed to update category",
        };
    }
}

export async function deleteAdminCategoryAction(
    categoryId: string,
): Promise<AdminCategoryActionResult> {
    try {
        await apiAuthDelete(`${API_ROUTES.CATEGORIES}/${categoryId}`);
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
            message: "Failed to delete category",
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
