"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import * as v from "valibot";
import { ApiClientError } from "@/lib/api";
import { apiAuthPatch } from "@/lib/api-auth";
import { NEXT_ORDER_STATUS_OPTIONS } from "@/lib/admin-order";
import { CACHE_TAGS } from "@/lib/constants/cache";
import { API_ROUTES, ROUTES } from "@/lib/constants/routes";
import { updateOrderStatusSchema } from "@/lib/validations/order";
import type { OrderStatus, UpdateOrderStatusInput } from "@/types/order";

export interface AdminOrderActionResult {
    success: boolean;
    message?: string;
    fieldErrors?: Record<string, string[]>;
}

function invalidateOrderAdminCaches(orderId?: string) {
    revalidateTag(CACHE_TAGS.ORDERS, "max");
    revalidatePath(ROUTES.ORDERS);
    revalidatePath(ROUTES.ADMIN.ORDERS);

    if (orderId) {
        revalidatePath(`${ROUTES.ORDERS}/${orderId}`);
    }
}

export async function updateAdminOrderStatusAction(
    orderId: string,
    values: UpdateOrderStatusInput,
): Promise<AdminOrderActionResult> {
    const parsed = v.safeParse(updateOrderStatusSchema, values);

    if (!parsed.success) {
        return {
            success: false,
            fieldErrors: v.flatten<typeof updateOrderStatusSchema>(parsed.issues)
                .nested as Record<string, string[]>,
        };
    }

    try {
        await apiAuthPatch(API_ROUTES.ORDERS.STATUS(orderId), parsed.output);
        invalidateOrderAdminCaches(orderId);

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
            message: "Failed to update order status",
        };
    }
}
