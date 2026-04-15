import type { Metadata } from "next";
import { apiGet } from "@/lib/api";
import { API_ROUTES } from "@/lib/constants/routes";
import type { Category } from "@/types/product";
import { AdminCategoryManager } from "@/components/admin/admin-category-manager";

export const metadata: Metadata = {
    title: "Admin Categories",
};

export default async function AdminCategoriesPage() {
    const categories = await apiGet<Category[]>(API_ROUTES.CATEGORIES, {
        revalidate: 300,
    });

    return <AdminCategoryManager categories={flattenCategories(categories)} />;
}

function flattenCategories(categories: Category[]) {
    const flattened = new Map<string, Category>();

    const visit = (category: Category) => {
        flattened.set(category.id, {
            ...category,
            children: category.children?.map((child) => ({
                ...child,
                children: child.children ?? [],
            })),
        });

        category.children?.forEach(visit);
    };

    categories.forEach(visit);
    return [...flattened.values()];
}
