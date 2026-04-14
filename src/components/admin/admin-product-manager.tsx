"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteAdminProductAction } from "@/actions/admin-product";
import type { Category, Product } from "@/types/product";
import { AdminProductForm } from "./admin-product-form";
import { AdminProductList } from "./admin-product-list";

interface AdminProductManagerProps {
    products: Product[];
    categories: Category[];
}

export function AdminProductManager({
    products,
    categories,
}: AdminProductManagerProps) {
    const router = useRouter();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const sortedProducts = [...products].sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const totalProducts = sortedProducts.length;
    const outOfStockCount = sortedProducts.filter(
        (product) => product.stockQuantity === 0,
    ).length;

    const handleDelete = async (product: Product) => {
        const confirmed = window.confirm(
            `Delete "${product.name}" from the catalog?`,
        );

        if (!confirmed) {
            return;
        }

        setDeletingId(product.id);
        const result = await deleteAdminProductAction(product.id);
        setDeletingId(null);

        if (!result.success) {
            toast.error("Could not delete product", {
                description: result.message,
            });
            return;
        }

        toast.success("Product deleted");
        if (editingId === product.id) {
            setEditingId(null);
        }
        router.refresh();
    };

    return (
        <div className="space-y-6 xl:space-y-8">
            <section className="rounded-[28px] border border-outline-variant/15 bg-surface-low p-6">
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-[56ch]">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">
                            Products Workspace
                        </p>
                        <h1 className="mt-3 font-headline text-3xl font-black tracking-[-0.03em] text-on-surface">
                            Create, maintain, and retire catalog items without
                            losing context.
                        </h1>
                        <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
                            The create panel stays compact while the inventory
                            list remains easy to scan for price, category, stock,
                            and quick actions.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <StatCard label="Products" value={String(totalProducts)} />
                        <StatCard
                            label="Out of Stock"
                            value={String(outOfStockCount)}
                        />
                    </div>
                </div>
            </section>

            <AdminProductForm mode="create" categories={categories} />

                <AdminProductList
                    products={sortedProducts}
                    categories={categories}
                    editingId={editingId}
                    deletingId={deletingId}
                    onEditToggle={(productId) =>
                        setEditingId((current) =>
                            current === productId ? null : productId,
                        )
                    }
                    onDelete={handleDelete}
                    onEditComplete={() => setEditingId(null)}
                />
        </div>
    );
}

function StatCard({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-[24px] border border-outline-variant/10 bg-surface-high px-4 py-4">
            <p className=" text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                {label}
            </p>
            <p className=" mt-2 text-2xl font-black tracking-tight text-on-surface">
                {value}
            </p>
        </div>
    );
}
