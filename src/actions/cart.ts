"use server";

import { updateTag } from "next/cache";
import { apiAuthPost, apiAuthPatch, apiAuthDelete } from "@/lib/api-auth";
import { ApiClientError } from "@/lib/api";
import { ERRORS } from "@/lib/constants/errors";
import { API_ROUTES } from "@/lib/constants/routes";
import type { Cart } from "@/types/cart";

export interface CartActionResult {
    success: boolean;
    message?: string;
    cart?: Cart;
}

export async function addToCartAction(
    productId: string,
    quantity: number = 1,
): Promise<CartActionResult> {
    try {
        const cart = await apiAuthPost<Cart>(API_ROUTES.CART, { productId, quantity });
        updateTag("cart");
        return { success: true, cart };
    } catch (error) {
        if (error instanceof ApiClientError) {
            return { success: false, message: error.message };
        }
        return { success: false, message: ERRORS.CART.ADD_FAILED };
    }
}

export async function adjustCartItemAction(
    productId: string,
    quantity: number,
): Promise<CartActionResult> {
    try {
        const cart = await apiAuthPatch<Cart>(`${API_ROUTES.CART}/${productId}`, {
            quantity,
        });
        updateTag("cart");
        return { success: true, cart };
    } catch (error) {
        if (error instanceof ApiClientError) {
            return { success: false, message: error.message };
        }
        return { success: false, message: ERRORS.CART.UPDATE_FAILED };
    }
}

export async function removeCartItemAction(
    productId: string,
): Promise<CartActionResult> {
    try {
        const cart = await apiAuthDelete<Cart>(`${API_ROUTES.CART}/${productId}`);
        updateTag("cart");
        return { success: true, cart };
    } catch (error) {
        if (error instanceof ApiClientError) {
            return { success: false, message: error.message };
        }
        return { success: false, message: ERRORS.CART.REMOVE_FAILED };
    }
}
