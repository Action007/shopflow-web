"use client";

import { ProductSearch } from "@/components/products/product-search";

interface ProductsToolbarProps {
    total?: number;
}

export function ProductsToolbar({ total }: ProductsToolbarProps) {
    return (
        <section className="lg:flex justify-between mb-6">
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
                <ProductSearch className="w-full lg:hidden" />
                <div className="hidden items-center justify-between gap-4 lg:flex">
                    <ProductSearch className="w-full max-w-md" />
                </div>
            </div>
        </section>
    );
}
