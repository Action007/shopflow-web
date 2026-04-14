"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import { ChevronDown, Pencil, Plus } from "lucide-react";
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
import { Button } from "@/components/ui/button";

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
    const [isExpanded, setIsExpanded] = useState(mode !== "create");
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
            {mode === "create" ? (
                <button
                    type="button"
                    onClick={() => setIsExpanded((current) => !current)}
                    className="flex w-full items-start justify-between gap-4 text-left"
                >
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/80">
                            New Product
                        </p>
                        <h2 className="mt-2 font-headline text-2xl font-black tracking-[-0.03em] text-on-surface">
                            Create a new catalog item
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                            Add a product with image, category, pricing, and
                            stock in one compact flow.
                        </p>
                    </div>

                    <span className="mt-1 inline-flex rounded-full bg-surface-high p-2 text-on-surface-variant">
                        <ChevronDown
                            className={`h-5 w-5 transition-transform duration-300 ${
                                isExpanded ? "rotate-180" : ""
                            }`}
                        />
                    </span>
                </button>
            ) : (
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/80">
                            Edit Product
                        </p>
                        <h2 className="mt-2 font-headline text-2xl font-black tracking-[-0.03em] text-on-surface">
                            {initialProduct?.name}
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                            Update product details without leaving the current
                            inventory view.
                        </p>
                    </div>
                </div>
            )}

            {isExpanded ? (
                <>
                    <ImageUploadField
                        label="Product Image"
                        helpText="Upload first, then submit with the returned image upload id."
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
                                className={inputClassName}
                                placeholder="MacBook Pro"
                                {...register("name")}
                            />
                        </Field>

                        <Field label="Category" error={errors.categoryId?.message}>
                            <select
                                className={inputClassName}
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
                                onClick={onComplete}
                            >
                                Cancel
                            </Button>
                        ) : null}
                    </div>
                </>
            ) : null}
        </form>
    );
}
