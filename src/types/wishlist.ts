import type { Product } from "@/types/product";

export interface WishlistItem {
    id: string;
    productId: string;
    createdAt: string;
    product: Product;
}

export interface Wishlist {
    id: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    items: WishlistItem[];
}
