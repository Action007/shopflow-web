"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ProductSearch } from "@/components/products/product-search";
import { FormSelect } from "@/components/shared/form-select";
import { ROUTES } from "@/lib/constants/routes";
import { AdminToolbarShell } from "./admin-toolbar-shell";

interface AdminOrdersToolbarProps {
    total: number;
    currentStatus?: string;
}

const statusOptions: Array<{ value: string; label: string }> = [
    { value: "", label: "All statuses" },
    { value: "PENDING", label: "Pending" },
    { value: "PROCESSING", label: "Processing" },
    { value: "SHIPPED", label: "Shipped" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "CANCELLED", label: "Cancelled" },
];

export function AdminOrdersToolbar({
    total,
    currentStatus,
}: AdminOrdersToolbarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const updateStatus = (status: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (status) {
            params.set("status", status);
        } else {
            params.delete("status");
        }

        params.delete("page");
        router.push(
            params.toString()
                ? `${ROUTES.ADMIN.ORDERS}?${params.toString()}`
                : ROUTES.ADMIN.ORDERS,
        );
    };

    return (
        <AdminToolbarShell
            eyebrow="Order Queue"
            title="Existing orders"
            description={`${total} order${total === 1 ? "" : "s"} matching the current view`}
        >
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_220px]">
                <ProductSearch
                    basePath={ROUTES.ADMIN.ORDERS}
                    placeholder="Search by order number or customer..."
                    ariaLabel="Search admin orders"
                />
                <FormSelect
                    value={currentStatus ?? ""}
                    onChange={updateStatus}
                    options={statusOptions}
                    ariaLabel="Filter by order status"
                />
            </div>
        </AdminToolbarShell>
    );
}
