"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import { Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import {
    createAdminProductAction,
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
import { ExpandableFormShell } from "@/components/shared/expandable-form-shell";
import { Button } from "@/components/ui/button";
import { cleanupPendingUpload } from "@/lib/upload-client";
import { findCategoryPath, flattenCategoryTree } from "@/lib/category-tree";

interface AdminProductFormProps {
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

const inputClassName =
    "h-12 w-full rounded-lg border-b-2 border-transparent bg-surface-highest px-4 py-3 text-sm text-on-surface outline-none transition-all duration-300 ease-fluid placeholder:text-text-muted focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25";

const textareaClassName =
    "min-h-24 w-full rounded-lg border-b-2 border-transparent bg-surface-highest px-4 py-3 text-sm text-on-surface outline-none transition-all duration-300 ease-fluid placeholder:text-text-muted focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25";

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

export function AdminProductForm({
    mode,
    categories,
    initialProduct,
    onComplete,
}: AdminProductFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [serverError, setServerError] = useState<string | null>(null);
    const handledUploadIdsRef = useRef(new Set<string>());
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
    const categoryOptions = buildCategoryOptions(categories);

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
                            form.setError(field as keyof ProductFormValues, {
                                message: messages[0],
                            });
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

            if (uploadValue.uploadId) {
                handledUploadIdsRef.current.add(uploadValue.uploadId);
            }

            toast.success(
                mode === "create" ? "Product created" : "Product updated",
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
                setUploadValue((current) => ({
                    uploadId: null,
                    previewUrl: null,
                    existingUrl:
                        current.previewUrl ?? current.existingUrl ?? null,
                }));
                onComplete?.();
            }

            router.refresh();
        });
    });

    const handleCancel = async () => {
        if (uploadValue.uploadId) {
            await cleanupPendingUpload(uploadValue.uploadId);
            handledUploadIdsRef.current.add(uploadValue.uploadId);
            setUploadValue((current) => ({
                ...current,
                uploadId: null,
                previewUrl: null,
            }));
        }

        onComplete?.();
    };

    return (
        <form onSubmit={onSubmit}>
            <ExpandableFormShell
                eyebrow={mode === "create" ? "New Product" : "Edit Product"}
                title={
                    mode === "create"
                        ? "Create a new catalog item"
                        : (initialProduct?.name ?? "Edit product")
                }
                description={
                    mode === "create"
                        ? "Add a product with image, category, pricing, and stock in one compact flow."
                        : "Update product details without leaving the current inventory view."
                }
                defaultExpanded={mode !== "create"}
                collapsible={mode === "create"}
            >
                    <ImageUploadField
                        label="Product Image"
                        helpText="Upload first, then submit with the returned image upload id."
                        required={mode === "create"}
                        value={uploadValue}
                        storageKey={
                            mode === "create"
                                ? "pending-product-upload:create"
                                : `pending-product-upload:${initialProduct?.id ?? "edit"}`
                        }
                        disabled={isPending}
                        onChange={(nextValue) => {
                            setUploadValue(nextValue);
                            setValue("imageUploadId", nextValue.uploadId ?? "", {
                                shouldValidate: true,
                            });
                        }}
                        onPendingUploadHandled={(uploadId) => {
                            handledUploadIdsRef.current.add(uploadId);
                        }}
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Product Name" error={errors.name?.message}>
                            <input
                                className={inputClassName}
                                placeholder="MacBook Pro"
                                {...register("name")}
                            />
                        </Field>

                        <Field label="Category" error={errors.categoryId?.message}>
                            <select className={inputClassName} {...register("categoryId")}>
                                <option value="">Select category</option>
                                {categoryOptions.map((category) => (
                                    <option key={category.value} value={category.value}>
                                        {category.label}
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
                                className={inputClassName}
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
                                className={inputClassName}
                                {...register("stockQuantity", {
                                    valueAsNumber: true,
                                })}
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
                                onClick={() => void handleCancel()}
                            >
                                Cancel
                            </Button>
                        ) : null}
                    </div>
            </ExpandableFormShell>
        </form>
    );
}

function buildCategoryOptions(categories: Category[]) {
    return flattenCategoryTree(categories)
        .sort((a, b) => a.path.localeCompare(b.path))
        .map(({ category }) => ({
            value: category.id,
            label: findCategoryPath(categories, category.id),
        }));
}
