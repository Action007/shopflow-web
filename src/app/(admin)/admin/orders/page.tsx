import type { Metadata } from "next";
import { apiAuthGet } from "@/lib/api-auth";
import { buildQueryString } from "@/lib/utils";
import { normalizeOrderStatus } from "@/lib/order";
import { CACHE_TAGS } from "@/lib/constants/cache";
import { API_ROUTES, ROUTES } from "@/lib/constants/routes";
import { AdminOrderManager } from "@/components/admin/admin-order-manager";
import { Pagination } from "@/components/shared/pagination";
import { normalizePaginationParams } from "@/lib/pagination-params";
import type { Order } from "@/types/order";
import type { PaginatedResult } from "@/types/product";

export const metadata: Metadata = {
    title: "Admin Orders",
};

interface AdminOrdersPageProps {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        search?: string;
        status?: string;
    }>;
}

export default async function AdminOrdersPage({
    searchParams,
}: AdminOrdersPageProps) {
    const params = await searchParams;
    const { effectiveParams } = normalizePaginationParams(params);
    const queryString = buildQueryString(effectiveParams);
    const orders = await apiAuthGet<PaginatedResult<Order>>(
        `${API_ROUTES.ORDERS.LIST}${queryString}`,
        { tags: [CACHE_TAGS.ORDERS] },
    );

    const normalizedFilterStatus = normalizeOrderStatus(effectiveParams.status);

    return (
        <div className="space-y-6">
            <AdminOrderManager
                orders={orders.items}
                totalOrders={orders.meta.total}
                currentStatus={normalizedFilterStatus ?? undefined}
            />

            <Pagination meta={orders.meta} basePath={ROUTES.ADMIN.ORDERS} />
        </div>
    );
}
