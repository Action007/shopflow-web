import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { apiAuthGet } from "@/lib/api-auth";
import type { Order } from "@/types/order";
import type { PaginatedResult } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { ROUTES, API_ROUTES } from "@/lib/constants/routes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
    title: "Orders",
};

const statusClasses: Record<string, string> = {
    DELIVERED: "bg-tertiary-container/10 text-tertiary ring-1 ring-tertiary/20",
    SHIPPED: "bg-primary-container/10 text-primary ring-1 ring-primary/20",
    PROCESSING: "bg-primary-container/10 text-primary ring-1 ring-primary/20",
    PENDING: "text-neutral-400 ring-1 ring-neutral-700",
    CANCELLED:
        "bg-error-container/10 text-destructive ring-1 ring-destructive/20 opacity-70",
};

export default async function OrdersPage() {
    const user = await getCurrentUser();
    if (!user) redirect(`${ROUTES.LOGIN}?callbackUrl=${ROUTES.ORDERS}`);

    const result = await apiAuthGet<PaginatedResult<Order>>(API_ROUTES.ORDERS, {
        tags: ["orders"],
    });

    return (
        <div className="mx-4">
            <div className="pb-16 pt-8 max-w-[1280px] mx-auto sm:pb-32">
                <div className="mb-8">
                    <h1 className="mb-2 text-3xl font-black tracking-tighter text-neutral-50">
                        Order History
                    </h1>
                    <p className="text-sm text-neutral-500">
                        Review your past digital acquisitions and shipments.
                    </p>
                </div>

                {result.items.length === 0 ? (
                    <section className="flex flex-col items-center rounded-3xl border border-outline-variant/10 py-12 text-center">
                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-surface-high">
                            <Package className="h-8 w-8 text-neutral-500" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold tracking-tight">
                            No orders yet
                        </h3>
                        <p className="mb-8 max-w-[220px] text-sm text-neutral-400">
                            Your transaction history is currently a blank
                            canvas.
                        </p>
                        <Button
                            variant="outline"
                            asChild
                            className="rounded-full px-8 py-3 text-xs uppercase tracking-widest text-primary"
                        >
                            <Link href={ROUTES.PRODUCTS}>Start Shopping</Link>
                        </Button>
                    </section>
                ) : (
                    <div className="flex flex-col gap-2">
                        {result.items.map((order) => (
                            <Link
                                key={order.id}
                                href={`/order/${order.id}`}
                                className={cn(
                                    "group flex items-center justify-between rounded-[12px] bg-[#18181b] p-5 transition-all duration-300 ease-fluid hover:bg-surface-high",
                                    order.status === "CANCELLED" &&
                                        "opacity-70",
                                )}
                            >
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="font-bold tracking-tight text-neutral-50">
                                            Order #{order.orderNumber}
                                        </span>
                                        <span
                                            className={cn(
                                                "rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest",
                                                statusClasses[order.status],
                                            )}
                                        >
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-neutral-500">
                                        <span>
                                            {new Date(
                                                order.createdAt,
                                            ).toLocaleDateString()}
                                        </span>
                                        <span className="font-bold text-blue-400">
                                            {formatPrice(order.totalAmount)}
                                        </span>
                                    </div>
                                </div>

                                <ArrowRight className="h-4 w-4 text-neutral-600 transition-colors duration-300 ease-fluid group-hover:text-primary" />
                            </Link>
                        ))}
                    </div>
                )}

                <div className="mt-12 rounded-[12px] border border-outline-variant/10 bg-gradient-to-br from-primary-container/20 to-transparent p-6">
                    <h3 className="mb-2 text-lg font-black text-neutral-50">
                        Need help?
                    </h3>
                    <p className="mb-4 text-sm text-neutral-400">
                        Our Concierge is available 24/7 for order inquiries or
                        returns.
                    </p>
                    <Button
                        variant="secondary"
                        className="w-full bg-primary text-on-primary hover:scale-[1.02]"
                    >
                        Contact Support
                    </Button>
                </div>
            </div>
        </div>
    );
}
