import type { Metadata } from "next";
import { apiGet } from "@/lib/api";
import { CACHE_CONFIG, CACHE_TAGS } from "@/lib/constants/cache";
import { API_ROUTES } from "@/lib/constants/routes";
import type { Category } from "@/types/product";
import { AdminCategoryManager } from "@/components/admin/admin-category-manager";

export const metadata: Metadata = {
    title: "Admin Categories",
};

export default async function AdminCategoriesPage() {
    const categories = await apiGet<Category[]>(API_ROUTES.CATEGORIES.LIST, {
        revalidate: CACHE_CONFIG.CATALOG_REVALIDATE_SECONDS,
        tags: [CACHE_TAGS.CATEGORIES],
    });

    return <AdminCategoryManager categories={categories} />;
}
