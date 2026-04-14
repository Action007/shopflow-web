"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    const tree = buildCategoryTree(categories);

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
            {tree.map((node) => (
                <CategoryBranch
                    key={node.category.id}
                    node={node}
                    allCategories={categories}
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

interface CategoryTreeNode {
    category: Category;
    children: CategoryTreeNode[];
}

function CategoryBranch({
    node,
    allCategories,
    editingId,
    deletingId,
    onEditToggle,
    onDelete,
    onEditComplete,
}: {
    node: CategoryTreeNode;
    allCategories: Category[];
    editingId: string | null;
    deletingId: string | null;
    onEditToggle: (categoryId: string) => void;
    onDelete: (category: Category) => void;
    onEditComplete: () => void;
}) {
    const category = node.category;
    const isEditing = editingId === category.id;
    const isDeleting = deletingId === category.id;
    const depth = getCategoryDepth(allCategories, category.id);

    return (
        <AdminRecordShell>
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
                                value={buildCategoryPath(allCategories, category.id)}
                            />
                            <AdminMetaBadge
                                label="Children"
                                value={String(node.children.length)}
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

                {node.children.length > 0 ? (
                    <div className="rounded-[24px] border border-outline-variant/10 bg-surface-high/50 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                            Child Categories
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {node.children.map((child) => (
                                <button
                                    key={child.category.id}
                                    type="button"
                                    onClick={() => onEditToggle(child.category.id)}
                                    className="rounded-full border border-outline-variant/15 bg-background/70 px-3 py-2 text-sm font-medium text-on-surface transition-colors duration-300 ease-fluid hover:bg-surface-highest"
                                >
                                    {child.category.name}
                                </button>
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

function buildCategoryTree(categories: Category[]) {
    const nodeMap = new Map<string, CategoryTreeNode>();

    for (const category of categories) {
        nodeMap.set(category.id, { category, children: [] });
    }

    const roots: CategoryTreeNode[] = [];

    for (const category of categories) {
        const node = nodeMap.get(category.id)!;

        if (category.parentId && nodeMap.has(category.parentId)) {
            nodeMap.get(category.parentId)!.children.push(node);
        } else {
            roots.push(node);
        }
    }

    const sortTree = (nodes: CategoryTreeNode[]) => {
        nodes.sort((a, b) => a.category.name.localeCompare(b.category.name));
        nodes.forEach((node) => sortTree(node.children));
    };

    sortTree(roots);
    return roots;
}

function buildCategoryPath(categories: Category[], categoryId: string) {
    const map = new Map(categories.map((category) => [category.id, category]));
    const segments: string[] = [];
    let current = map.get(categoryId);
    let guard = 0;

    while (current && guard < categories.length) {
        segments.unshift(current.name);
        current = current.parentId ? map.get(current.parentId) : undefined;
        guard += 1;
    }

    return segments.join(" / ");
}

function getCategoryDepth(categories: Category[], categoryId: string) {
    const map = new Map(categories.map((category) => [category.id, category]));
    let depth = 0;
    let current = map.get(categoryId);
    let guard = 0;

    while (current?.parentId && guard < categories.length) {
        depth += 1;
        current = map.get(current.parentId);
        guard += 1;
    }

    return depth;
}
