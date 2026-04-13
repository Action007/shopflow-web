import { apiAuthGet } from "@/lib/api-auth";
import { API_ROUTES } from "@/lib/constants/routes";
import { canAccessShopperFeatures } from "@/lib/roles";
import type { User } from "@/types/user";
import type { Wishlist } from "@/types/wishlist";

export async function getWishlist(user: User | null): Promise<Wishlist | null> {
    if (!user || !canAccessShopperFeatures(user)) {
        return null;
    }

    try {
        return await apiAuthGet<Wishlist>(API_ROUTES.WISHLIST);
    } catch {
        return null;
    }
}

export async function getWishlistProductIds(user: User | null): Promise<string[]> {
    const wishlist = await getWishlist(user);
    return wishlist?.items.map((item) => item.productId) ?? [];
}
