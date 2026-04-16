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

const UUID_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

interface AdminOrdersPageProps {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        search?: string;
        status?: string;
        userId?: string;
        dateFrom?: string;
        dateTo?: string;
        sortBy?: string;
        sortOrder?: string;
    }>;
}

export default async function AdminOrdersPage({
    searchParams,
}: AdminOrdersPageProps) {
    const params = await searchParams;
    const hasSupportedSortOrder =
        params.sortOrder === "asc" || params.sortOrder === "desc";
    const sanitizedParams = {
        ...params,
        userId: params.userId && UUID_PATTERN.test(params.userId) ? params.userId : undefined,
        sortBy:
            params.sortBy === "createdAt"
                ? params.sortBy
                : hasSupportedSortOrder
                  ? "createdAt"
                  : undefined,
        sortOrder: hasSupportedSortOrder ? params.sortOrder : undefined,
    };
    const { effectiveParams } = normalizePaginationParams(sanitizedParams);
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
                currentSortOrder={effectiveParams.sortOrder}
                currentUserId={effectiveParams.userId}
                currentDateFrom={effectiveParams.dateFrom}
                currentDateTo={effectiveParams.dateTo}
            />

            <Pagination meta={orders.meta} basePath={ROUTES.ADMIN.ORDERS} />
        </div>
    );
}
