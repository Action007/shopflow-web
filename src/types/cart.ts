import type { Product } from "./product";

export interface CartItem {
    id: string;
    productId: string;
    quantity: number;
    priceAtAdd: string;
    product: Product;
}

export interface Cart {
    id: string;
    userId: string;
    items: CartItem[];
}
