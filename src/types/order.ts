export interface OrderItem {
    id: string;
    productId: string;
    quantity: number;
    priceAtPurchase: string;
    productNameAtPurchase: string;
}

export interface Order {
    id: string;
    orderNumber: string;
    status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    totalAmount: string;
    shippingAddress: string;
    items: OrderItem[];
    createdAt: string;
}
