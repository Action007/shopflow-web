"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductSearch } from "@/components/products/product-search";
import { FormSelect } from "@/components/shared/form-select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";
import { AdminToolbarShell } from "./admin-toolbar-shell";

interface AdminOrdersToolbarProps {
    total: number;
    currentStatus?: string;
    currentSortOrder?: string;
    currentUserId?: string;
    currentDateFrom?: string;
    currentDateTo?: string;
}

const statusOptions: Array<{ value: string; label: string }> = [
    { value: "", label: "All statuses" },
    { value: "PENDING", label: "Pending" },
    { value: "PROCESSING", label: "Processing" },
    { value: "SHIPPED", label: "Shipped" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "CANCELLED", label: "Cancelled" },
];

const sortOrderOptions: Array<{ value: string; label: string }> = [
    { value: "desc", label: "Newest first" },
    { value: "asc", label: "Oldest first" },
];

export function AdminOrdersToolbar({
    total,
    currentStatus,
    currentSortOrder,
    currentUserId,
    currentDateFrom,
    currentDateTo,
}: AdminOrdersToolbarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [userIdValue, setUserIdValue] = useState(currentUserId ?? "");
    const [dateFromValue, setDateFromValue] = useState(currentDateFrom ?? "");
    const [dateToValue, setDateToValue] = useState(currentDateTo ?? "");

    useEffect(() => {
        setUserIdValue(currentUserId ?? "");
    }, [currentUserId]);

    useEffect(() => {
        setDateFromValue(currentDateFrom ?? "");
    }, [currentDateFrom]);

    useEffect(() => {
        setDateToValue(currentDateTo ?? "");
    }, [currentDateTo]);

    const pushParams = (params: URLSearchParams) => {
        params.delete("page");
        router.push(
            params.toString()
                ? `${ROUTES.ADMIN.ORDERS}?${params.toString()}`
                : ROUTES.ADMIN.ORDERS,
        );
    };

    const updateStatus = (status: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (status) {
            params.set("status", status);
        } else {
            params.delete("status");
        }

        pushParams(params);
    };

    const updateSortOrder = (sortOrder: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sortBy", "createdAt");
        params.set("sortOrder", sortOrder);
        pushParams(params);
    };

    const applyExtendedFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (userIdValue.trim()) {
            params.set("userId", userIdValue.trim());
        } else {
            params.delete("userId");
        }

        if (dateFromValue) {
            params.set("dateFrom", dateFromValue);
        } else {
            params.delete("dateFrom");
        }

        if (dateToValue) {
            params.set("dateTo", dateToValue);
        } else {
            params.delete("dateTo");
        }

        pushParams(params);
    };

    const resetExtendedFilters = () => {
        setUserIdValue("");
        setDateFromValue("");
        setDateToValue("");

        const params = new URLSearchParams(searchParams.toString());
        params.delete("search");
        params.delete("userId");
        params.delete("dateFrom");
        params.delete("dateTo");
        params.delete("sortBy");
        params.delete("sortOrder");
        params.delete("status");
        pushParams(params);
    };

    return (
        <AdminToolbarShell
            eyebrow="Order Queue"
            title="Existing orders"
            description={`${total} order${total === 1 ? "" : "s"} matching the current view`}
        >
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1.2fr)_180px_180px]">
                <ProductSearch
                    basePath={ROUTES.ADMIN.ORDERS}
                    placeholder="Search orders..."
                    ariaLabel="Search orders"
                    className="md:col-span-2 xl:col-span-1"
                />
                <FormSelect
                    value={currentStatus ?? ""}
                    onChange={updateStatus}
                    options={statusOptions}
                    ariaLabel="Filter by order status"
                />
                <FormSelect
                    value={currentSortOrder ?? "desc"}
                    onChange={updateSortOrder}
                    options={sortOrderOptions}
                    ariaLabel="Sort orders by date"
                />
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_180px_180px_auto_auto]">
                <Input
                    value={userIdValue}
                    onChange={(event) => setUserIdValue(event.target.value)}
                    placeholder="Filter by full user ID"
                    aria-label="Filter orders by full user ID"
                />
                <Input
                    type="date"
                    value={dateFromValue}
                    onChange={(event) => setDateFromValue(event.target.value)}
                    aria-label="Orders from date"
                />
                <Input
                    type="date"
                    value={dateToValue}
                    onChange={(event) => setDateToValue(event.target.value)}
                    aria-label="Orders to date"
                />
                <Button
                    type="button"
                    variant="card"
                    onClick={applyExtendedFilters}
                    className="h-12"
                >
                    Apply Filters
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={resetExtendedFilters}
                    className="h-12"
                >
                    Reset
                </Button>
            </div>
        </AdminToolbarShell>
    );
}
