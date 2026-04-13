"use server";

import { apiAuthDelete, apiAuthPost } from "@/lib/api-auth";
import { ApiClientError } from "@/lib/api";
import { ACTION_RESULT_CODES } from "@/lib/constants/action-result-codes";
import { API_ROUTES } from "@/lib/constants/routes";
import type { Wishlist } from "@/types/wishlist";

export interface WishlistActionResult {
    success: boolean;
    wishlist?: Wishlist;
    message?: string;
    code?: string;
}

export async function addToWishlistAction(
    productId: string,
): Promise<WishlistActionResult> {
    try {
        const wishlist = await apiAuthPost<Wishlist>(
            API_ROUTES.WISHLIST,
            { productId },
            { redirectOn401: false },
        );

        return { success: true, wishlist };
    } catch (error) {
        if (error instanceof ApiClientError) {
            return {
                success: false,
                message: error.message,
                code:
                    error.statusCode === 401
                        ? ACTION_RESULT_CODES.UNAUTHORIZED
                        : ACTION_RESULT_CODES.API_ERROR,
            };
        }

        return {
            success: false,
            message: "Failed to update wishlist",
            code: ACTION_RESULT_CODES.UNKNOWN,
        };
    }
}

export async function removeFromWishlistAction(
    productId: string,
): Promise<WishlistActionResult> {
    try {
        const wishlist = await apiAuthDelete<Wishlist>(
            `${API_ROUTES.WISHLIST}/${productId}`,
            { redirectOn401: false },
        );

        return { success: true, wishlist };
    } catch (error) {
        if (error instanceof ApiClientError) {
            return {
                success: false,
                message: error.message,
                code:
                    error.statusCode === 401
                        ? ACTION_RESULT_CODES.UNAUTHORIZED
                        : ACTION_RESULT_CODES.API_ERROR,
            };
        }

        return {
            success: false,
            message: "Failed to update wishlist",
            code: ACTION_RESULT_CODES.UNKNOWN,
        };
    }
}
