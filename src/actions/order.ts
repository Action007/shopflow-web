"use server";

import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { apiAuthPost } from "@/lib/api-auth";
import { ApiClientError } from "@/lib/api";
import * as v from "valibot";
import { CACHE_TAGS, getProductTag } from "@/lib/constants/cache";
import { checkoutSchema } from "@/lib/validations/checkout";
import { API_ROUTES, ROUTES } from "@/lib/constants/routes";
import { ERRORS } from "@/lib/constants/errors";
import type { Order } from "@/types/order";

export interface PlaceOrderResult {
    success: boolean;
    message?: string;
    fieldErrors?: Record<string, string[]>;
    orderId?: string;
}

export interface CancelOrderResult {
    success: boolean;
    message?: string;
    order?: Order;
}

function invalidateProductCaches(productIds: string[]) {
    const uniqueProductIds = Array.from(new Set(productIds.filter(Boolean)));

    revalidateTag(CACHE_TAGS.PRODUCTS, "max");
    revalidatePath(ROUTES.PRODUCTS);

    for (const productId of uniqueProductIds) {
        revalidateTag(getProductTag(productId), "max");
        revalidatePath(`${ROUTES.PRODUCTS}/${productId}`);
    }
}

export async function placeOrderAction(formData: {
    shippingAddress: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
}): Promise<PlaceOrderResult> {
    const parsed = v.safeParse(checkoutSchema, formData);
    if (!parsed.success) {
        return {
            success: false,
            fieldErrors: v.flatten<typeof checkoutSchema>(parsed.issues).nested as Record<
                string,
                string[]
            >,
        };
    }

    let orderId: string;
    try {
        const fullAddress = `${parsed.output.shippingAddress}, ${parsed.output.city}, ${parsed.output.state} ${parsed.output.zipCode}`;
        const order = await apiAuthPost<Order>(API_ROUTES.ORDERS.LIST, {
            shippingAddress: fullAddress,
        });
        orderId = order.id;
        revalidateTag(CACHE_TAGS.ORDERS, "max");
        revalidateTag(CACHE_TAGS.CART, "max");
        invalidateProductCaches(order.items.map((item) => item.productId));
    } catch (error) {
        if (error instanceof ApiClientError) {
            return { success: false, message: error.message };
        }
        return {
            success: false,
            message: ERRORS.ORDER.PLACE_FAILED,
        };
    }

    redirect(`${ROUTES.ORDERS}/${orderId}`);
}

export async function cancelOrderAction(
    orderId: string,
): Promise<CancelOrderResult> {
    try {
        const order = await apiAuthPost<Order>(
            API_ROUTES.ORDERS.CANCEL(orderId),
        );
        revalidateTag(CACHE_TAGS.ORDERS, "max");
        revalidateTag(CACHE_TAGS.CART, "max");
        invalidateProductCaches(order.items.map((item) => item.productId));
        return { success: true, order };
    } catch (error) {
        if (error instanceof ApiClientError) {
            return { success: false, message: error.message };
        }

        return {
            success: false,
            message: ERRORS.ORDER.CANCEL_FAILED,
        };
    }
}
