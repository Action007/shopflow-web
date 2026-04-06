"use server";

import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { apiAuthPost } from "@/lib/api-auth";
import { ApiClientError } from "@/lib/api";
import { checkoutSchema } from "@/lib/validations/checkout";
import type { Order } from "@/types/order";

export interface PlaceOrderResult {
    success: boolean;
    message?: string;
    fieldErrors?: Record<string, string[]>;
    orderId?: string;
}

export async function placeOrderAction(formData: {
    shippingAddress: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
}): Promise<PlaceOrderResult> {
    const parsed = checkoutSchema.safeParse(formData);
    if (!parsed.success) {
        return {
            success: false,
            fieldErrors: parsed.error.flatten().fieldErrors as Record<
                string,
                string[]
            >,
        };
    }

    let orderId: string;
    try {
        const fullAddress = `${parsed.data.shippingAddress}, ${parsed.data.city}, ${parsed.data.state} ${parsed.data.zipCode}`;
        const order = await apiAuthPost<Order>("/orders", {
            shippingAddress: fullAddress,
        });
        orderId = order.id;
        updateTag("cart");
        updateTag("orders");
    } catch (error) {
        if (error instanceof ApiClientError) {
            return { success: false, message: error.message };
        }
        return {
            success: false,
            message: "Failed to place order. Please try again.",
        };
    }

    redirect(`/orders/${orderId}`);
}
