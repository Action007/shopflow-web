"use server";

import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";
import { apiAuthPost } from "@/lib/api-auth";
import { ApiClientError } from "@/lib/api";
import * as v from "valibot";
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
        const order = await apiAuthPost<Order>(API_ROUTES.ORDERS, {
            shippingAddress: fullAddress,
        });
        orderId = order.id;
        revalidateTag("orders", "max");
        revalidateTag("cart-detail", "max");
        revalidateTag("cart", "max");
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
            `${API_ROUTES.ORDERS}/${orderId}${API_ROUTES.CANCEL}`,
        );
        revalidateTag("orders", "max");
        revalidateTag("cart-detail", "max");
        revalidateTag("cart", "max");
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
