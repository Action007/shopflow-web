"use client";

import { ProductSearch } from "@/components/products/product-search";

interface ProductsToolbarProps {
    sortValue: string;
    search?: string;
    total?: number;
}

export function ProductsToolbar({
    sortValue,
    search,
    total,
}: ProductsToolbarProps) {
    return (
        <section className="lg:flex justify-between mb-8">
            <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-on-surface">
                        All Products
                    </h1>
                    {typeof total === "number" ? (
                        <p className="mt-2 text-sm text-outline">
                            Showing {total} items
                        </p>
                    ) : null}
                </div>
            </div>

            <div className="space-y-4">
                <ProductSearch
                    key={`mobile-${search ?? ""}`}
                    className="w-full lg:hidden"
                />
                <div className="hidden items-center justify-between gap-4 lg:flex">
                    <ProductSearch
                        key={`desktop-${search ?? ""}`}
                        className="w-full max-w-md"
                    />
                </div>
            </div>
        </section>
    );
}
