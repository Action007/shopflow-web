"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import * as v from "valibot";
import { ApiClientError } from "@/lib/api";
import { apiAuthDelete, apiAuthPatch, apiAuthPost } from "@/lib/api-auth";
import { API_ROUTES, ROUTES } from "@/lib/constants/routes";
import {
    createProductSchema,
    updateProductSchema,
} from "@/lib/validations/product";
import type {
    CreateProductInput,
    UpdateProductInput,
} from "@/types/product";

export interface AdminProductActionResult {
    success: boolean;
    message?: string;
    fieldErrors?: Record<string, string[]>;
}

function invalidateProductAdminCaches(productId?: string) {
    revalidateTag("products", "max");
    revalidatePath(ROUTES.PRODUCTS);
    revalidatePath(ROUTES.ADMIN.PRODUCTS);

    if (productId) {
        revalidateTag(`product-${productId}`, "max");
        revalidatePath(`${ROUTES.PRODUCTS}/${productId}`);
    }
}

export async function createAdminProductAction(
    values: CreateProductInput,
): Promise<AdminProductActionResult> {
    const parsed = v.safeParse(createProductSchema, values);

    if (!parsed.success) {
        return {
            success: false,
            fieldErrors: v.flatten<typeof createProductSchema>(parsed.issues)
                .nested as Record<string, string[]>,
        };
    }

    try {
        const product = await apiAuthPost<{ id: string }>(
            API_ROUTES.PRODUCTS.LIST,
            parsed.output,
        );
        invalidateProductAdminCaches(product.id);

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
            message: "Failed to create product",
        };
    }
}

export async function updateAdminProductAction(
    productId: string,
    values: UpdateProductInput,
): Promise<AdminProductActionResult> {
    const parsed = v.safeParse(updateProductSchema, values);

    if (!parsed.success) {
        return {
            success: false,
            fieldErrors: v.flatten<typeof updateProductSchema>(parsed.issues)
                .nested as Record<string, string[]>,
        };
    }

    const { imageUploadId, ...rest } = parsed.output;
    const payload = imageUploadId
        ? { ...rest, imageUploadId }
        : rest;

    try {
        await apiAuthPatch(API_ROUTES.PRODUCTS.DETAIL(productId), payload);
        invalidateProductAdminCaches(productId);

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
            message: "Failed to update product",
        };
    }
}

export async function deleteAdminProductAction(
    productId: string,
): Promise<AdminProductActionResult> {
    try {
        await apiAuthDelete(API_ROUTES.PRODUCTS.DETAIL(productId));
        invalidateProductAdminCaches(productId);

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
            message: "Failed to delete product",
        };
    }
}
