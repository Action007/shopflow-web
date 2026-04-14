import type { Product } from "@/types/product";
import type { User } from "@/types/user";

export type OrderStatus =
    | "PENDING"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";

export interface OrderItem {
    id: string;
    productId: string;
    quantity: number;
    priceAtPurchase: string;
    productNameAtPurchase: string;
    product?: Product;
}

export interface Order {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    totalAmount: string;
    shippingAddress: string;
    items: OrderItem[];
    createdAt: string;
    userId?: string;
    user?: Pick<User, "id" | "firstName" | "lastName" | "email" | "profileImageUrl"> | null;
}

export interface UpdateOrderStatusInput {
    status: OrderStatus;
}
