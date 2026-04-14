"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ProductSearch } from "@/components/products/product-search";
import { ProductSortSelect } from "@/components/products/product-sort-select";
import { FormSelect } from "@/components/shared/form-select";
import type { Category } from "@/types/product";
import { ROUTES } from "@/lib/constants/routes";

interface AdminProductsToolbarProps {
    total: number;
    sortValue: string;
    categories: Category[];
    currentCategory?: string;
}

export function AdminProductsToolbar({
    total,
    sortValue,
    categories,
    currentCategory,
}: AdminProductsToolbarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const updateCategory = (categoryId: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (categoryId) {
            params.set("categoryId", categoryId);
        } else {
            params.delete("categoryId");
        }

        params.delete("page");
        router.push(
            params.toString()
                ? `${ROUTES.ADMIN.PRODUCTS}?${params.toString()}`
                : ROUTES.ADMIN.PRODUCTS,
        );
    };

    const categoryOptions = [
        { value: "", label: "All categories" },
        ...categories.map((category) => ({
            value: category.id,
            label: category.name,
        })),
    ];

    return (
        <section className="rounded-[28px] border border-outline-variant/15 bg-surface-low p-5">
            <div className="flex flex-col gap-4">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                        Catalog Inventory
                    </p>
                    <h2 className="mt-2 font-headline text-3xl font-black tracking-[-0.03em] text-on-surface">
                        Existing products
                    </h2>
                    <p className="mt-2 text-sm text-on-surface-variant">
                        {total} product{total === 1 ? "" : "s"} matching the
                        current view
                    </p>
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_220px_220px]">
                    <ProductSearch
                        basePath={ROUTES.ADMIN.PRODUCTS}
                        placeholder="Search catalog..."
                        ariaLabel="Search admin products"
                        className="md:col-span-2 xl:col-span-1"
                    />
                    <FormSelect
                        value={currentCategory ?? ""}
                        onChange={updateCategory}
                        options={categoryOptions}
                        ariaLabel="Filter by category"
                    />
                    <ProductSortSelect
                        value={sortValue}
                        basePath={ROUTES.ADMIN.PRODUCTS}
                        className="w-full"
                    />
                </div>
            </div>
        </section>
    );
}
