import * as v from "valibot";
import type { OrderStatus } from "@/types/order";

const orderStatuses: [OrderStatus, ...OrderStatus[]] = [
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
];

export const updateOrderStatusSchema = v.object({
    status: v.picklist(orderStatuses, "Select a valid order status"),
});
