"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppImage } from "@/components/shared/app-image";
import { formatPrice } from "@/lib/utils";
import type { Category, Product } from "@/types/product";
import { AdminEmptyState } from "./admin-empty-state";
import { AdminMetaBadge } from "./admin-meta-badge";
import { AdminProductForm } from "./admin-product-form";
import { AdminRecordShell } from "./admin-record-shell";

interface AdminProductListProps {
    products: Product[];
    categories: Category[];
    editingId: string | null;
    deletingId: string | null;
    onEditToggle: (productId: string) => void;
    onDelete: (product: Product) => void;
    onEditComplete: () => void;
}

export function AdminProductList({
    products,
    categories,
    editingId,
    deletingId,
    onEditToggle,
    onDelete,
    onEditComplete,
}: AdminProductListProps) {
    return (
        <section className="space-y-4">
            {products.length === 0 ? (
                <AdminEmptyState
                    title="No products yet"
                    description="Create the first catalog item to start managing price, stock, category, and imagery from this workspace."
                />
            ) : (
                <div className="space-y-4">
                    {products.map((product) => {
                        const isEditing = editingId === product.id;
                        const isDeleting = deletingId === product.id;
                        const isLowStock = product.stockQuantity < 10;
                        const isOutOfStock = product.stockQuantity === 0;

                        return (
                            <AdminRecordShell
                                key={product.id}
                            >
                                <div className="grid gap-5 p-5 xl:grid-cols-[112px_minmax(0,1fr)_auto] xl:items-start">
                                    <div className="relative h-28 w-28 overflow-hidden rounded-[22px] bg-surface-highest">
                                        {product.imageUrl ? (
                                            <AppImage
                                                src={product.imageUrl}
                                                alt={product.name}
                                                fill
                                                sizes="112px"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-xs text-on-surface-variant">
                                                No image
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
                                            <div className="space-y-2">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="font-headline text-2xl font-bold tracking-[-0.02em] text-on-surface">
                                                        {product.name}
                                                    </h3>
                                                    <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                                                        {product.category?.name ??
                                                            "Category"}
                                                    </span>
                                                </div>

                                                <p className="max-w-[62ch] text-sm leading-relaxed text-on-surface-variant">
                                                    {product.description ||
                                                        "No description provided."}
                                                </p>
                                            </div>

                                            <div className="flex gap-2 xl:hidden">
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    onClick={() =>
                                                        onEditToggle(product.id)
                                                    }
                                                >
                                                    <Pencil />
                                                    {isEditing ? "Close" : "Edit"}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    disabled={isDeleting}
                                                    onClick={() =>
                                                        void onDelete(product)
                                                    }
                                                >
                                                    <Trash2 />
                                                    {isDeleting
                                                        ? "Deleting..."
                                                        : "Delete"}
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <AdminMetaBadge
                                                label="Price"
                                                value={formatPrice(product.price)}
                                            />
                                            <AdminMetaBadge
                                                label="Stock"
                                                value={String(product.stockQuantity)}
                                            />
                                            <div
                                                className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                                                    isOutOfStock
                                                        ? "bg-destructive/10 text-destructive"
                                                        : isLowStock
                                                          ? "bg-amber-500/10 text-amber-400"
                                                          : "bg-emerald-500/10 text-emerald-400"
                                                }`}
                                            >
                                                {isOutOfStock
                                                    ? "Out of stock"
                                                    : isLowStock
                                                      ? "Low stock"
                                                      : "Healthy stock"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hidden gap-3 xl:flex xl:flex-col">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() =>
                                                onEditToggle(product.id)
                                            }
                                        >
                                            <Pencil />
                                            {isEditing ? "Close" : "Edit"}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            disabled={isDeleting}
                                            onClick={() =>
                                                void onDelete(product)
                                            }
                                        >
                                            <Trash2 />
                                            {isDeleting
                                                ? "Deleting..."
                                                : "Delete"}
                                        </Button>
                                    </div>
                                </div>

                                {isEditing ? (
                                    <div className="border-t border-outline-variant/10 p-5">
                                        <AdminProductForm
                                            mode="edit"
                                            categories={categories}
                                            initialProduct={product}
                                            onComplete={onEditComplete}
                                        />
                                    </div>
                                ) : null}
                            </AdminRecordShell>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
