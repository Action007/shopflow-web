import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import { apiAuthGet } from "@/lib/api-auth";
import type { Order } from "@/types/order";
import type { PaginatedResult } from "@/types/product";
import { buildQueryString, cn, formatPrice } from "@/lib/utils";
import { CACHE_TAGS } from "@/lib/constants/cache";
import { ROUTES, API_ROUTES } from "@/lib/constants/routes";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/order/order-status-badge";
import { Pagination } from "@/components/shared/pagination";
import { requireCustomerUser } from "@/lib/route-guards";
import { normalizePaginationParams } from "@/lib/pagination-params";

interface OrdersPageProps {
    searchParams: Promise<{
        page?: string;
        limit?: string;
    }>;
}

export const metadata: Metadata = {
    title: "Orders",
};

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
    await requireCustomerUser(ROUTES.ORDERS);
    const params = await searchParams;
    const { effectiveParams } = normalizePaginationParams(params);
    const queryString = buildQueryString(effectiveParams);

    const result = await apiAuthGet<PaginatedResult<Order>>(
        `${API_ROUTES.ORDERS.LIST}${queryString}`,
        {
            tags: [CACHE_TAGS.ORDERS],
        },
    );

    return (
        <div className="site-page pb-16 sm:pb-32">
            <section className="flex flex-col items-center text-center mb-8 rounded-[28px] border border-outline-variant/15 bg-surface-low px-6 py-8 sm:px-8">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Package className="h-8 w-8" />
                </div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary">
                    Purchase timeline
                </p>
                <h1 className="mt-3 text-3xl font-black tracking-tighter text-on-surface sm:text-4xl">
                    Order history
                </h1>
                <p className="mt-4 max-w-[48ch] text-sm leading-relaxed text-on-surface-variant sm:text-[15px]">
                    Review your past purchases, check statuses, and revisit
                    order details whenever you need them.
                </p>
            </section>

            {result.items.length === 0 ? (
                <section className="rounded-[28px] border border-outline-variant/15 bg-surface-low px-6 py-12 text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Package className="h-8 w-8" />
                    </div>
                    <h2 className="text-3xl font-black tracking-tighter text-on-surface">
                        No orders yet
                    </h2>
                    <p className="mx-auto mt-4 max-w-[44ch] text-sm leading-relaxed text-on-surface-variant">
                        When you place your first order, it will show up here
                        with status updates, totals, and a quick path back to
                        the details.
                    </p>
                    <Button asChild className="mt-6">
                        <Link href={ROUTES.PRODUCTS}>Start Shopping</Link>
                    </Button>
                </section>
            ) : (
                <div className="space-y-6">
                    <div className="flex flex-col gap-2">
                        {result.items.map((order) => (
                            <Link
                                key={order.id}
                                href={ROUTES.ORDER_DETAIL(order.id)}
                                className={cn(
                                    "group flex items-center justify-between rounded-[12px] bg-[#18181b] p-5 transition-all duration-300 ease-fluid hover:bg-surface-high",
                                    order.status === "CANCELLED" && "opacity-70",
                                )}
                            >
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="font-bold tracking-tight text-neutral-50">
                                            Order #{order.orderNumber}
                                        </span>
                                        <OrderStatusBadge status={order.status} />
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

                    <Pagination meta={result.meta} basePath={ROUTES.ORDERS} />
                </div>
            )}
        </div>
    );
}
