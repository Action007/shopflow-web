"use client";

import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { Category, Product } from "@/types/product";
import { AdminProductForm } from "./admin-product-form";

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
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                        Catalog Inventory
                    </p>
                    <h2 className="mt-2 font-headline text-3xl font-black tracking-[-0.03em] text-on-surface">
                        Existing products
                    </h2>
                </div>
            </div>

            {products.length === 0 ? (
                <div className="rounded-[28px] border border-outline-variant/15 bg-surface-low p-8 text-on-surface-variant">
                    No products yet.
                </div>
            ) : (
                <div className="space-y-4">
                    {products.map((product) => {
                        const isEditing = editingId === product.id;
                        const isDeleting = deletingId === product.id;
                        const isLowStock = product.stockQuantity < 5;
                        const isOutOfStock = product.stockQuantity === 0;

                        return (
                            <article
                                key={product.id}
                                className="overflow-hidden rounded-[28px] border border-outline-variant/15 bg-surface-low"
                            >
                                <div className="grid gap-5 p-5 xl:grid-cols-[112px_minmax(0,1fr)_auto] xl:items-start">
                                    <div className="relative h-28 w-28 overflow-hidden rounded-[22px] bg-surface-highest">
                                        {product.imageUrl ? (
                                            <Image
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
                                        <div className="flex flex-wrap items-start justify-between gap-3">
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

                                            <div className="flex flex-wrap gap-2 xl:hidden">
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
                                            <div className="rounded-full border border-outline-variant/15 bg-surface-high px-3 py-1.5 text-xs font-bold text-primary">
                                                {formatPrice(product.price)}
                                            </div>
                                            <div className="rounded-full border border-outline-variant/15 bg-surface-high px-3 py-1.5 text-xs font-bold text-on-surface">
                                                Stock: {product.stockQuantity}
                                            </div>
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
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
