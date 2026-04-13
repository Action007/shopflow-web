"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import {
    createAdminProductAction,
    deleteAdminProductAction,
    updateAdminProductAction,
} from "@/actions/admin-product";
import {
    createProductSchema,
    updateProductSchema,
} from "@/lib/validations/product";
import type {
    Category,
    CreateProductInput,
    Product,
    UpdateProductInput,
} from "@/types/product";
import {
    ImageUploadField,
    type ImageUploadValue,
} from "@/components/shared/image-upload-field";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface AdminProductManagerProps {
    products: Product[];
    categories: Category[];
}

interface ProductFormProps {
    mode: "create" | "edit";
    categories: Category[];
    initialProduct?: Product;
    onComplete?: () => void;
}

type ProductFormValues = {
    name: string;
    description?: string;
    imageUploadId: string;
    price: string;
    stockQuantity: number;
    categoryId: string;
};

const textareaClassName =
    "min-h-28 w-full rounded-lg border-b-2 border-transparent bg-surface-highest px-4 py-3 text-sm text-on-surface outline-none transition-all duration-300 ease-fluid placeholder:text-text-muted focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25";

function ProductForm({
    mode,
    categories,
    initialProduct,
    onComplete,
}: ProductFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [serverError, setServerError] = useState<string | null>(null);
    const [uploadValue, setUploadValue] = useState<ImageUploadValue>({
        uploadId: null,
        previewUrl: null,
        existingUrl: initialProduct?.imageUrl ?? null,
    });

    const form = useForm<ProductFormValues>({
        resolver: valibotResolver(
            mode === "create" ? createProductSchema : updateProductSchema,
        ),
        defaultValues: {
            name: initialProduct?.name ?? "",
            description: initialProduct?.description ?? "",
            imageUploadId: "",
            price: initialProduct?.price ?? "",
            stockQuantity: initialProduct?.stockQuantity ?? 0,
            categoryId: initialProduct?.categoryId ?? "",
        },
    });

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = form;

    const submitLabel =
        mode === "create" ? "Create Product" : "Save Product Changes";

    const onSubmit = handleSubmit((values: ProductFormValues) => {
        setServerError(null);

        const payload = {
            ...values,
            description: values.description?.trim() || undefined,
            imageUploadId: uploadValue.uploadId ?? "",
        };

        startTransition(async () => {
            const result =
                mode === "create"
                    ? await createAdminProductAction(
                          payload as unknown as CreateProductInput,
                      )
                    : await updateAdminProductAction(
                          initialProduct!.id,
                          payload as unknown as UpdateProductInput,
                      );

            if (!result.success) {
                setServerError(result.message || "Request failed");

                if (result.fieldErrors) {
                    for (const [field, messages] of Object.entries(
                        result.fieldErrors,
                    )) {
                        if (messages?.[0]) {
                            form.setError(
                                field as keyof ProductFormValues,
                                {
                                    message: messages[0],
                                },
                            );
                        }
                    }
                }

                toast.error(
                    mode === "create"
                        ? "Could not create product"
                        : "Could not update product",
                    {
                        description: result.message,
                    },
                );
                return;
            }

            toast.success(
                mode === "create"
                    ? "Product created"
                    : "Product updated",
            );

            if (mode === "create") {
                reset({
                    name: "",
                    description: "",
                    imageUploadId: "",
                    price: "",
                    stockQuantity: 0,
                    categoryId: "",
                });
                setUploadValue({
                    uploadId: null,
                    previewUrl: null,
                    existingUrl: null,
                });
            } else {
                onComplete?.();
            }

            router.refresh();
        });
    });

    return (
        <form
            onSubmit={onSubmit}
            className="space-y-5 rounded-[28px] border border-outline-variant/15 bg-surface-low p-6"
        >
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/80">
                        {mode === "create" ? "New Product" : "Edit Product"}
                    </p>
                    <h2 className="mt-2 font-headline text-2xl font-black tracking-[-0.03em] text-on-surface">
                        {mode === "create"
                            ? "Create a new catalog item"
                            : initialProduct?.name}
                    </h2>
                </div>

                {mode === "edit" && onComplete ? (
                    <Button type="button" variant="ghost" onClick={onComplete}>
                        <X />
                        Close
                    </Button>
                ) : null}
            </div>

            <ImageUploadField
                label="Product Image"
                helpText="Upload first, then submit the product form with the returned upload id."
                required={mode === "create"}
                value={uploadValue}
                disabled={isPending}
                onChange={(nextValue) => {
                    setUploadValue(nextValue);
                    setValue("imageUploadId", nextValue.uploadId ?? "", {
                        shouldValidate: true,
                    });
                }}
            />

            <div className="grid gap-4 md:grid-cols-2">
                <Field label="Product Name" error={errors.name?.message}>
                    <input
                        className="h-12 w-full rounded-lg border-b-2 border-transparent bg-surface-highest px-4 py-3 text-sm text-on-surface outline-none transition-all duration-300 ease-fluid placeholder:text-text-muted focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25"
                        placeholder="MacBook Pro"
                        {...register("name")}
                    />
                </Field>

                <Field label="Category" error={errors.categoryId?.message}>
                    <select
                        className="h-12 w-full rounded-lg border-b-2 border-transparent bg-surface-highest px-4 py-3 text-sm text-on-surface outline-none transition-all duration-300 ease-fluid focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25"
                        {...register("categoryId")}
                    >
                        <option value="">Select category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </Field>
            </div>

            <Field
                label="Description"
                error={errors.description?.message?.toString()}
            >
                <textarea
                    className={textareaClassName}
                    placeholder="Describe the product clearly for the storefront."
                    {...register("description")}
                />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
                <Field label="Price" error={errors.price?.message}>
                    <input
                        className="h-12 w-full rounded-lg border-b-2 border-transparent bg-surface-highest px-4 py-3 text-sm text-on-surface outline-none transition-all duration-300 ease-fluid placeholder:text-text-muted focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25"
                        placeholder="1999.99"
                        {...register("price")}
                    />
                </Field>

                <Field
                    label="Stock Quantity"
                    error={errors.stockQuantity?.message}
                >
                    <input
                        type="number"
                        min={0}
                        className="h-12 w-full rounded-lg border-b-2 border-transparent bg-surface-highest px-4 py-3 text-sm text-on-surface outline-none transition-all duration-300 ease-fluid placeholder:text-text-muted focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25"
                        {...register("stockQuantity", { valueAsNumber: true })}
                    />
                </Field>
            </div>

            {serverError ? (
                <p className="text-sm text-destructive">{serverError}</p>
            ) : null}

            <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={isPending}>
                    {mode === "create" ? <Plus /> : <Pencil />}
                    {isPending ? "Saving..." : submitLabel}
                </Button>
                {mode === "edit" && onComplete ? (
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isPending}
                        onClick={onComplete}
                    >
                        Cancel
                    </Button>
                ) : null}
            </div>
        </form>
    );
}

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                {label}
            </label>
            {children}
            {error ? (
                <p className="text-[10px] font-medium text-destructive">
                    {error}
                </p>
            ) : null}
        </div>
    );
}

export function AdminProductManager({
    products,
    categories,
}: AdminProductManagerProps) {
    const router = useRouter();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

    const sortedProducts = [...products].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const handleDelete = async (product: Product) => {
        const confirmed = window.confirm(
            `Delete "${product.name}" from the catalog?`,
        );

        if (!confirmed) {
            return;
        }

        setIsDeletingId(product.id);
        const result = await deleteAdminProductAction(product.id);
        setIsDeletingId(null);

        if (!result.success) {
            toast.error("Could not delete product", {
                description: result.message,
            });
            return;
        }

        toast.success("Product deleted");
        router.refresh();
    };

    return (
        <div className="space-y-8">
            <ProductForm mode="create" categories={categories} />

            <section className="space-y-4">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                            Catalog Inventory
                        </p>
                        <h2 className="mt-2 font-headline text-3xl font-black tracking-[-0.03em] text-on-surface">
                            Existing products
                        </h2>
                    </div>
                    <p className="text-sm text-on-surface-variant">
                        {sortedProducts.length} item
                        {sortedProducts.length === 1 ? "" : "s"}
                    </p>
                </div>

                {sortedProducts.length === 0 ? (
                    <div className="rounded-[24px] border border-outline-variant/15 bg-surface-low p-8 text-on-surface-variant">
                        No products yet.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sortedProducts.map((product) => {
                            const isEditing = editingId === product.id;

                            return (
                                <article
                                    key={product.id}
                                    className="overflow-hidden rounded-[28px] border border-outline-variant/15 bg-surface-low"
                                >
                                    <div className="grid gap-5 p-5 lg:grid-cols-[140px_minmax(0,1fr)_auto] lg:items-center">
                                        <div className="relative aspect-square overflow-hidden rounded-[20px] bg-surface-highest">
                                            {product.imageUrl ? (
                                                <Image
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    fill
                                                    sizes="140px"
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-xs text-on-surface-variant">
                                                    No image
                                                </div>
                                            )}
                                        </div>

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
                                            <p className="text-sm text-on-surface-variant">
                                                {product.description ||
                                                    "No description provided."}
                                            </p>
                                            <div className="flex flex-wrap gap-4 text-sm">
                                                <span className="font-bold text-primary">
                                                    {formatPrice(product.price)}
                                                </span>
                                                <span className="text-on-surface-variant">
                                                    Stock: {product.stockQuantity}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-3 lg:flex-col">
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                onClick={() =>
                                                    setEditingId(
                                                        isEditing
                                                            ? null
                                                            : product.id,
                                                    )
                                                }
                                            >
                                                <Pencil />
                                                {isEditing ? "Close" : "Edit"}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                disabled={isDeletingId === product.id}
                                                onClick={() =>
                                                    void handleDelete(product)
                                                }
                                            >
                                                <Trash2 />
                                                {isDeletingId === product.id
                                                    ? "Deleting..."
                                                    : "Delete"}
                                            </Button>
                                        </div>
                                    </div>

                                    {isEditing ? (
                                        <div className="border-t border-outline-variant/10 p-5">
                                            <ProductForm
                                                mode="edit"
                                                categories={categories}
                                                initialProduct={product}
                                                onComplete={() =>
                                                    setEditingId(null)
                                                }
                                            />
                                        </div>
                                    ) : null}
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}
