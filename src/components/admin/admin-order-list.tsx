"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, LoaderCircle, Package, Truck } from "lucide-react";
import { toast } from "sonner";
import { updateAdminOrderStatusAction } from "@/actions/admin-order";
import { FormSelect } from "@/components/shared/form-select";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/order/order-status-badge";
import { NEXT_ORDER_STATUS_OPTIONS } from "@/lib/admin-order";
import { formatOrderStatusLabel, normalizeOrderStatus } from "@/lib/order";
import { ROUTES } from "@/lib/constants/routes";
import { formatPrice } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types/order";
import { AppImage } from "@/components/shared/app-image";
import { AdminEmptyState } from "./admin-empty-state";
import { AdminMetaBadge } from "./admin-meta-badge";
import { AdminRecordShell } from "./admin-record-shell";

interface AdminOrderListProps {
    orders: Order[];
}

export function AdminOrderList({ orders }: AdminOrderListProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    if (orders.length === 0) {
        return (
            <AdminEmptyState
                title="No orders found"
                description="Try a different status or search term to inspect another part of the order queue."
            />
        );
    }

    return (
        <section className="space-y-4">
            {orders.map((order) => (
                <AdminOrderCard
                    key={order.id}
                    order={order}
                    isExpanded={expandedId === order.id}
                    onToggle={() =>
                        setExpandedId((current) =>
                            current === order.id ? null : order.id,
                        )
                    }
                />
            ))}
        </section>
    );
}

function AdminOrderCard({
    order,
    isExpanded,
    onToggle,
}: {
    order: Order;
    isExpanded: boolean;
    onToggle: () => void;
}) {
    const router = useRouter();
    const [nextStatus, setNextStatus] = useState<OrderStatus | "">("");
    const [isPending, startTransition] = useTransition();
    const normalizedStatus = normalizeOrderStatus(order.status);

    const transitionOptions = useMemo(
        () =>
            (normalizedStatus
                ? NEXT_ORDER_STATUS_OPTIONS[normalizedStatus]
                : []
            ).map((status) => ({
                value: status,
                label: formatStatusLabel(status),
            })),
        [normalizedStatus],
    );

    const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const customerName = [
        order.user?.firstName,
        order.user?.lastName,
    ]
        .filter(Boolean)
        .join(" ");

    const handleStatusUpdate = () => {
        if (!nextStatus) {
            return;
        }

        startTransition(async () => {
            const result = await updateAdminOrderStatusAction(order.id, {
                status: nextStatus,
            });

            if (!result.success) {
                toast.error("Could not update order status", {
                    description: result.message,
                });
                return;
            }

            toast.success("Order status updated");
            setNextStatus("");
            router.refresh();
        });
    };

    return (
        <AdminRecordShell>
            <div className="space-y-5 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                            <OrderStatusBadge status={order.status} />
                            <span className="font-mono text-xs tracking-[0.14em] text-on-surface-variant">
                                #{order.orderNumber}
                            </span>
                        </div>

                        <div>
                            <h3 className="font-headline text-2xl font-bold tracking-[-0.02em] text-on-surface">
                                {customerName || "Customer unavailable"}
                            </h3>
                            <p className="mt-2 text-sm text-on-surface-variant">
                                {order.user?.email ?? "No email returned by API"}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <AdminMetaBadge
                                label="Total"
                                value={formatPrice(order.totalAmount)}
                            />
                            <AdminMetaBadge
                                label="Items"
                                value={String(itemCount)}
                            />
                            <AdminMetaBadge
                                label="Created"
                                value={new Date(order.createdAt).toLocaleDateString()}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 lg:w-[260px]">
                        {transitionOptions.length > 0 ? (
                            <>
                                <FormSelect
                                    value={nextStatus}
                                    onChange={(value) =>
                                        setNextStatus(value as OrderStatus | "")
                                    }
                                    options={[
                                        {
                                            value: "",
                                            label: "Update status",
                                        },
                                        ...transitionOptions,
                                    ]}
                                    ariaLabel={`Update status for order ${order.orderNumber}`}
                                />
                                <Button
                                    type="button"
                                    variant="secondary"
                                    disabled={!nextStatus || isPending}
                                    onClick={handleStatusUpdate}
                                >
                                    {isPending ? (
                                        <>
                                            <LoaderCircle className="animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        "Apply Status"
                                    )}
                                </Button>
                            </>
                        ) : (
                            <div className="rounded-[20px] border border-outline-variant/10 bg-surface-high px-4 py-3 text-sm text-on-surface-variant">
                                This order has no further status transitions.
                            </div>
                        )}

                        <Button
                            type="button"
                            variant="outline"
                            onClick={onToggle}
                        >
                            <ChevronDown
                                className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                            />
                            {isExpanded ? "Hide details" : "View details"}
                        </Button>
                    </div>
                </div>
            </div>

            {isExpanded ? (
                <div className="grid gap-5 border-t border-outline-variant/10 p-5 xl:grid-cols-[minmax(0,1.25fr)_360px]">
                    <section className="rounded-[24px] border border-outline-variant/10 bg-surface-high/50 p-4">
                        <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-primary" />
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                                Order Items
                            </p>
                        </div>

                        <div className="mt-4 space-y-3">
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-3 rounded-[20px] border border-outline-variant/10 bg-background/60 p-3"
                                >
                                    <Link
                                        href={`${ROUTES.PRODUCTS}/${item.productId}`}
                                        className="relative block h-14 w-14 overflow-hidden rounded-xl bg-surface-highest transition-opacity duration-300 hover:opacity-85"
                                    >
                                        {item.product?.imageUrl ? (
                                            <AppImage
                                                src={item.product.imageUrl}
                                                alt={item.productNameAtPurchase}
                                                fill
                                                sizes="56px"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-[10px] text-on-surface-variant">
                                                No image
                                            </div>
                                        )}
                                    </Link>
                                    <div className="min-w-0 flex-1">
                                        <Link
                                            href={`${ROUTES.PRODUCTS}/${item.productId}`}
                                            className="font-semibold text-on-surface transition-colors duration-300 hover:text-primary"
                                        >
                                            {item.productNameAtPurchase}
                                        </Link>
                                        <p className="mt-1 text-xs text-on-surface-variant">
                                            Qty: {item.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-on-surface-variant">
                                            Unit
                                        </p>
                                        <p className="font-semibold text-on-surface">
                                            {formatPrice(item.priceAtPurchase)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="space-y-4">
                        <section className="rounded-[24px] border border-outline-variant/10 bg-surface-high/50 p-4">
                            <div className="flex items-center gap-2">
                                <Truck className="h-4 w-4 text-primary" />
                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                                    Shipping Address
                                </p>
                            </div>
                            <p className="mt-4 text-sm leading-relaxed text-on-surface">
                                {order.shippingAddress}
                            </p>
                        </section>

                        <section className="rounded-[24px] border border-outline-variant/10 bg-surface-high/50 p-4">
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                                Order Summary
                            </p>
                            <div className="mt-4 space-y-3">
                                <SummaryRow
                                    label="Order number"
                                    value={`#${order.orderNumber}`}
                                />
                                <SummaryRow
                                    label="Status"
                                    value={formatOrderStatusLabel(order.status)}
                                />
                                <SummaryRow
                                    label="Placed"
                                    value={new Date(order.createdAt).toLocaleString()}
                                />
                                <SummaryRow
                                    label="Items"
                                    value={String(itemCount)}
                                />
                                <SummaryRow
                                    label="Total"
                                    value={formatPrice(order.totalAmount)}
                                />
                            </div>
                        </section>
                    </div>
                </div>
            ) : null}
        </AdminRecordShell>
    );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-on-surface-variant">{label}</span>
            <span className="text-sm font-semibold text-on-surface">{value}</span>
        </div>
    );
}

function formatStatusLabel(status: OrderStatus) {
    return formatOrderStatusLabel(status);
}
