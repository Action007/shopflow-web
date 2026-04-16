"use client";

import type { Order } from "@/types/order";
import { AdminWorkspaceHeader } from "./admin-workspace-header";
import { AdminOrdersToolbar } from "./admin-orders-toolbar";
import { AdminOrderList } from "./admin-order-list";

interface AdminOrderManagerProps {
    orders: Order[];
    totalOrders: number;
    currentStatus?: string;
    currentSortOrder?: string;
    currentUserId?: string;
    currentDateFrom?: string;
    currentDateTo?: string;
}

export function AdminOrderManager({
    orders,
    totalOrders,
    currentStatus,
    currentSortOrder,
    currentUserId,
    currentDateFrom,
    currentDateTo,
}: AdminOrderManagerProps) {
    return (
        <div className="space-y-6 xl:space-y-8">
            <AdminWorkspaceHeader
                eyebrow="Orders Workspace"
                title="Track operations, review details, and move orders through fulfillment."
                description="This workspace is for operational flow, not content management. Review customer context, inspect items and shipping details, then apply only valid next statuses."
                stats={[{ label: "Orders", value: String(totalOrders) }]}
            />

            <AdminOrdersToolbar
                total={totalOrders}
                currentStatus={currentStatus}
                currentSortOrder={currentSortOrder}
                currentUserId={currentUserId}
                currentDateFrom={currentDateFrom}
                currentDateTo={currentDateTo}
            />

            <AdminOrderList orders={orders} />
        </div>
    );
}
