import { cn } from "@/lib/utils";
import type { Order } from "@/types/order";

const statusClasses: Record<Order["status"], string> = {
    DELIVERED: "bg-tertiary-container/10 text-tertiary ring-1 ring-tertiary/20",
    SHIPPED: "bg-primary-container/10 text-primary ring-1 ring-primary/20",
    PROCESSING: "bg-primary-container/10 text-primary ring-1 ring-primary/20",
    PENDING: "text-neutral-400 ring-1 ring-neutral-700",
    CANCELLED:
        "bg-error-container/10 text-destructive ring-1 ring-destructive/20 opacity-70",
};

interface OrderStatusBadgeProps {
    status: Order["status"];
    className?: string;
}

export function OrderStatusBadge({
    status,
    className,
}: OrderStatusBadgeProps) {
    return (
        <span
            className={cn(
                "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest",
                statusClasses[status],
                className,
            )}
        >
            {status}
        </span>
    );
}
