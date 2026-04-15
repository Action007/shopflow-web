"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteAdminProductAction } from "@/actions/admin-product";
import type { Category, Product } from "@/types/product";
import { AdminProductForm } from "./admin-product-form";
import { AdminProductList } from "./admin-product-list";
import { AdminProductsToolbar } from "./admin-products-toolbar";
import { AdminWorkspaceHeader } from "./admin-workspace-header";

interface AdminProductManagerProps {
    products: Product[];
    categories: Category[];
    totalProducts: number;
    sortValue: string;
    currentCategory?: string;
}

export function AdminProductManager({
    products,
    categories,
    totalProducts,
    sortValue,
    currentCategory,
}: AdminProductManagerProps) {
    const router = useRouter();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const visibleProducts = products.length;

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
            <AdminWorkspaceHeader
                eyebrow="Products Workspace"
                title="Create, maintain, and retire catalog items without losing context."
                description="The create panel stays compact while the inventory list remains easy to scan for price, category, stock, and quick actions."
                stats={[
                    { label: "Products", value: String(totalProducts) },
                    { label: "Visible", value: String(visibleProducts) },
                ]}
            />

            <AdminProductForm mode="create" categories={categories} />

            <AdminProductsToolbar
                total={totalProducts}
                sortValue={sortValue}
                categories={categories}
                currentCategory={currentCategory}
            />

            <AdminProductList
                products={products}
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
