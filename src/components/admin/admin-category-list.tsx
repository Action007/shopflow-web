"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { findCategoryPath } from "@/lib/category-tree";
import type { Category } from "@/types/product";
import { AdminCategoryForm } from "./admin-category-form";
import { AdminEmptyState } from "./admin-empty-state";
import { AdminMetaBadge } from "./admin-meta-badge";
import { AdminRecordShell } from "./admin-record-shell";

interface AdminCategoryListProps {
    categories: Category[];
    editingId: string | null;
    deletingId: string | null;
    onEditToggle: (categoryId: string) => void;
    onDelete: (category: Category) => void;
    onEditComplete: () => void;
}

export function AdminCategoryList({
    categories,
    editingId,
    deletingId,
    onEditToggle,
    onDelete,
    onEditComplete,
}: AdminCategoryListProps) {
    if (categories.length === 0) {
        return (
            <AdminEmptyState
                title="No categories yet"
                description="Create a top-level category or a child category to start shaping storefront navigation and browse paths."
            />
        );
    }

    return (
        <section className="space-y-4">
            {categories.map((category) => (
                <CategoryBranch
                    key={category.id}
                    category={category}
                    allCategories={categories}
                    depth={0}
                    editingId={editingId}
                    deletingId={deletingId}
                    onEditToggle={onEditToggle}
                    onDelete={onDelete}
                    onEditComplete={onEditComplete}
                />
            ))}
        </section>
    );
}

function CategoryBranch({
    category,
    allCategories,
    depth,
    editingId,
    deletingId,
    onEditToggle,
    onDelete,
    onEditComplete,
}: {
    category: Category;
    allCategories: Category[];
    depth: number;
    editingId: string | null;
    deletingId: string | null;
    onEditToggle: (categoryId: string) => void;
    onDelete: (category: Category) => void;
    onEditComplete: () => void;
}) {
    const isEditing = editingId === category.id;
    const isDeleting = deletingId === category.id;
    const children = category.children ?? [];

    return (
        <AdminRecordShell className={depth > 0 ? "bg-surface-high/30" : undefined}>
            <div className="space-y-4 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                                {depth === 0 ? "Top level" : `Level ${depth + 1}`}
                            </span>
                            {category.parentId ? (
                                <span className="rounded-full border border-outline-variant/15 bg-surface-high px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                                    Child category
                                </span>
                            ) : null}
                        </div>

                        <div>
                            <h3 className="font-headline text-2xl font-bold tracking-[-0.02em] text-on-surface">
                                {category.name}
                            </h3>
                            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                                {category.description ||
                                    "No description provided for this taxonomy node."}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <AdminMetaBadge
                                label="Path"
                                value={findCategoryPath(allCategories, category.id)}
                            />
                            <AdminMetaBadge
                                label="Children"
                                value={String(children.length)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => onEditToggle(category.id)}
                        >
                            <Pencil />
                            {isEditing ? "Close" : "Edit"}
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            disabled={isDeleting}
                            onClick={() => void onDelete(category)}
                        >
                            <Trash2 />
                            {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </div>

                {children.length > 0 ? (
                    <div className="rounded-[24px] border border-outline-variant/10 bg-surface-high/50 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                            Child Categories
                        </p>
                        <div className="mt-4 space-y-3">
                            {children.map((child) => (
                                <CategoryBranch
                                    key={child.id}
                                    category={child}
                                    allCategories={allCategories}
                                    depth={depth + 1}
                                    editingId={editingId}
                                    deletingId={deletingId}
                                    onEditToggle={onEditToggle}
                                    onDelete={onDelete}
                                    onEditComplete={onEditComplete}
                                />
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>

            {isEditing ? (
                <div className="border-t border-outline-variant/10 p-5">
                    <AdminCategoryForm
                        mode="edit"
                        categories={allCategories}
                        initialCategory={category}
                        onComplete={onEditComplete}
                    />
                </div>
            ) : null}
        </AdminRecordShell>
    );
}
