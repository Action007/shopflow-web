import type { OrderStatus } from "@/types/order";

export const NEXT_ORDER_STATUS_OPTIONS: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ["PROCESSING", "CANCELLED"],
    PROCESSING: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
};
