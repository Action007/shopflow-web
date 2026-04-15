"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import { Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import {
    createAdminCategoryAction,
    updateAdminCategoryAction,
} from "@/actions/admin-category";
import {
    createCategorySchema,
    updateCategorySchema,
} from "@/lib/validations/category";
import {
    findCategoryPath,
    flattenCategoryTree,
    getDescendantIdsFromTree,
} from "@/lib/category-tree";
import type {
    Category,
    CreateCategoryInput,
    UpdateCategoryInput,
} from "@/types/product";
import { ExpandableFormShell } from "@/components/shared/expandable-form-shell";
import { FormSelect } from "@/components/shared/form-select";
import { Button } from "@/components/ui/button";

interface AdminCategoryFormProps {
    mode: "create" | "edit";
    categories: Category[];
    initialCategory?: Category;
    onComplete?: () => void;
}

type CategoryFormValues = {
    name: string;
    description?: string;
    parentId?: string | null;
};

const inputClassName =
    "h-12 w-full rounded-lg border-b-2 border-transparent bg-surface-highest px-4 py-3 text-sm text-on-surface outline-none transition-all duration-300 ease-fluid placeholder:text-text-muted focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25";

const textareaClassName =
    "min-h-28 w-full rounded-lg border-b-2 border-transparent bg-surface-highest px-4 py-3 text-sm text-on-surface outline-none transition-all duration-300 ease-fluid placeholder:text-text-muted focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25";

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

export function AdminCategoryForm({
    mode,
    categories,
    initialCategory,
    onComplete,
}: AdminCategoryFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [serverError, setServerError] = useState<string | null>(null);

    const form = useForm<CategoryFormValues>({
        resolver: valibotResolver(
            mode === "create" ? createCategorySchema : updateCategorySchema,
        ),
        defaultValues: {
            name: initialCategory?.name ?? "",
            description: initialCategory?.description ?? "",
            parentId: initialCategory?.parentId ?? "",
        },
    });

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = form;

    const parentOptions = buildParentOptions(categories, initialCategory);

    const onSubmit = handleSubmit((values) => {
        setServerError(null);

        startTransition(async () => {
            const payload = {
                name: values.name.trim(),
                description: values.description?.trim() || undefined,
                parentId: values.parentId || undefined,
            };

            const result =
                mode === "create"
                    ? await createAdminCategoryAction(
                          payload as CreateCategoryInput,
                      )
                    : await updateAdminCategoryAction(
                          initialCategory!.id,
                          payload as UpdateCategoryInput,
                      );

            if (!result.success) {
                setServerError(result.message ?? "Request failed");

                if (result.fieldErrors) {
                    for (const [field, messages] of Object.entries(
                        result.fieldErrors,
                    )) {
                        if (messages?.[0]) {
                            form.setError(field as keyof CategoryFormValues, {
                                message: messages[0],
                            });
                        }
                    }
                }

                toast.error(
                    mode === "create"
                        ? "Could not create category"
                        : "Could not update category",
                    {
                        description: result.message,
                    },
                );
                return;
            }

            toast.success(
                mode === "create" ? "Category created" : "Category updated",
            );

            if (mode === "create") {
                reset({
                    name: "",
                    description: "",
                    parentId: "",
                });
            } else {
                onComplete?.();
            }

            router.refresh();
        });
    });

    return (
        <form onSubmit={onSubmit}>
            <ExpandableFormShell
                eyebrow={mode === "create" ? "New Category" : "Edit Category"}
                title={
                    mode === "create"
                        ? "Create a new category"
                        : (initialCategory?.name ?? "Edit category")
                }
                description={
                    mode === "create"
                        ? "Add a top-level category or place it under an existing parent to shape storefront discovery."
                        : "Update naming, description, or parent placement without leaving the taxonomy view."
                }
                defaultExpanded={mode !== "create"}
                collapsible={mode === "create"}
            >
                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_260px]">
                    <Field label="Category Name" error={errors.name?.message}>
                        <input
                            className={inputClassName}
                            placeholder="Laptops"
                            {...register("name")}
                        />
                    </Field>

                    <Field label="Parent Category" error={errors.parentId?.message}>
                        <FormSelect
                            value={form.watch("parentId") ?? ""}
                            onChange={(value) =>
                                setValue("parentId", value, {
                                    shouldValidate: true,
                                })
                            }
                            options={parentOptions}
                            ariaLabel="Select parent category"
                        />
                    </Field>
                </div>

                <Field
                    label="Description"
                    error={errors.description?.message?.toString()}
                >
                    <textarea
                        className={textareaClassName}
                        placeholder="Add optional context for how this branch should be used."
                        {...register("description")}
                    />
                </Field>

                {serverError ? (
                    <p className="text-sm text-destructive">{serverError}</p>
                ) : null}

                <div className="flex flex-wrap gap-3">
                    <Button type="submit" disabled={isPending}>
                        {mode === "create" ? <Plus /> : <Pencil />}
                        {isPending
                            ? "Saving..."
                            : mode === "create"
                              ? "Create Category"
                              : "Save Category"}
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
            </ExpandableFormShell>
        </form>
    );
}

function buildParentOptions(
    categories: Category[],
    initialCategory?: Category,
) {
    const blockedIds = initialCategory
        ? getDescendantIdsFromTree(categories, initialCategory.id)
        : new Set<string>();

    if (initialCategory) {
        blockedIds.add(initialCategory.id);
    }

    const availableParents = flattenCategoryTree(categories)
        .filter(({ category, depth }) => depth < 2 && !blockedIds.has(category.id))
        .sort((a, b) => a.path.localeCompare(b.path));

    return [
        { value: "", label: "No parent (top level)" },
        ...availableParents.map(({ category }) => ({
            value: category.id,
            label: findCategoryPath(categories, category.id),
        })),
    ];
}
