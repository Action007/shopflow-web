import * as v from "valibot";
import { ERRORS } from "@/lib/constants/errors";
import type { OrderStatus } from "@/types/order";

const orderStatuses: [OrderStatus, ...OrderStatus[]] = [
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
];

export const updateOrderStatusSchema = v.object({
    status: v.picklist(orderStatuses, ERRORS.VALIDATION.ORDER.STATUS_INVALID),
});
