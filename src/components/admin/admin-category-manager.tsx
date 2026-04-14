"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteAdminCategoryAction } from "@/actions/admin-category";
import type { Category } from "@/types/product";
import { AdminCategoryForm } from "./admin-category-form";
import { AdminCategoryList } from "./admin-category-list";
import { AdminSectionShell } from "./admin-section-shell";
import { AdminWorkspaceHeader } from "./admin-workspace-header";

interface AdminCategoryManagerProps {
    categories: Category[];
}

export function AdminCategoryManager({
    categories,
}: AdminCategoryManagerProps) {
    const router = useRouter();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const stats = useMemo(() => {
        const topLevel = categories.filter((category) => !category.parentId).length;
        const described = categories.filter((category) => category.description).length;

        return { topLevel, described };
    }, [categories]);

    const handleDelete = async (category: Category) => {
        const confirmed = window.confirm(
            `Delete "${category.name}" from categories?`,
        );

        if (!confirmed) {
            return;
        }

        setDeletingId(category.id);
        const result = await deleteAdminCategoryAction(category.id);
        setDeletingId(null);

        if (!result.success) {
            toast.error("Could not delete category", {
                description: result.message,
            });
            return;
        }

        toast.success("Category deleted");
        if (editingId === category.id) {
            setEditingId(null);
        }
        router.refresh();
    };

    return (
        <div className="space-y-6 xl:space-y-8">
            <AdminWorkspaceHeader
                eyebrow="Categories Workspace"
                title="Shape how products are grouped and discovered across the storefront."
                description="Categories are about structure and browse paths, not product editing. Use parent-child relationships to keep the catalog clear as it grows."
                stats={[
                    { label: "Categories", value: String(categories.length) },
                    { label: "Top level", value: String(stats.topLevel) },
                ]}
                maxWidthClassName="max-w-[56ch]"
            />

            <AdminCategoryForm mode="create" categories={categories} />

            <AdminSectionShell
                eyebrow="Category Inventory"
                title="Existing categories"
                description={`${categories.length} categor${categories.length === 1 ? "y" : "ies"} in the current structure, with ${stats.described} carrying editorial descriptions.`}
            />

            <AdminCategoryList
                categories={categories}
                editingId={editingId}
                deletingId={deletingId}
                onEditToggle={(categoryId) =>
                    setEditingId((current) =>
                        current === categoryId ? null : categoryId,
                    )
                }
                onDelete={handleDelete}
                onEditComplete={() => setEditingId(null)}
            />
        </div>
    );
}
