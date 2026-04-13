import { apiGet } from "@/lib/api";
import { API_ROUTES } from "@/lib/constants/routes";
import { AdminProductManager } from "@/components/admin/admin-product-manager";
import type { Category, PaginatedResult, Product } from "@/types/product";

export default async function AdminProductsPage() {
    const [products, categories] = await Promise.all([
        apiGet<PaginatedResult<Product>>(
            `${API_ROUTES.PRODUCTS.LIST}?limit=100&sortBy=createdAt&sortOrder=desc`,
            { revalidate: 300, tags: ["products"] },
        ),
        apiGet<Category[]>(API_ROUTES.CATEGORIES, { revalidate: 300 }),
    ]);

    return (
        <AdminProductManager
            products={products.items}
            categories={categories}
        />
    );
}
