import type { OrderStatus } from "@/types/order";

const ORDER_STATUSES: OrderStatus[] = [
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
];

export function normalizeOrderStatus(
    status: string | null | undefined,
): OrderStatus | null {
    if (!status) {
        return null;
    }

    const normalized = status.trim().toUpperCase() as OrderStatus;
    return ORDER_STATUSES.includes(normalized) ? normalized : null;
}

export function formatOrderStatusLabel(status: string | null | undefined) {
    const normalized = normalizeOrderStatus(status);

    if (!normalized) {
        return status ?? "Unknown";
    }

    return normalized.charAt(0) + normalized.slice(1).toLowerCase();
}
