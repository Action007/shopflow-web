import Link from "next/link";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import type { PaginatedResult, Product, Category } from "@/types/product";
import { ProductGrid } from "@/components/products/product-grid";

export default async function HomePage() {
    const [productsResult, categories] = await Promise.all([
        apiGet<PaginatedResult<Product>>(
            "/products?limit=8&sortBy=createdAt&sortOrder=desc",
            {
                revalidate: 300,
            },
        ),
        apiGet<Category[]>("/categories", { revalidate: 300 }),
    ]);

    return (
        <div>
            <section className="bg-muted/50 py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                        Welcome to ShopNext
                    </h1>
                    <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
                        A modern e-commerce experience built with Next.js App
                        Router and NestJS.
                    </p>
                    <Button asChild size="lg" className="mt-8">
                        <Link href="/products">Browse products</Link>
                    </Button>
                </div>
            </section>

            {categories.length > 0 && (
                <section className="container mx-auto px-4 py-12">
                    <h2 className="text-2xl font-bold">Categories</h2>
                    <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/products?categoryId=${category.id}`}
                                className="rounded-lg border bg-card p-6 text-center transition-colors hover:bg-accent"
                            >
                                <span className="font-medium">
                                    {category.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            <section className="container mx-auto px-4 py-12">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Latest products</h2>
                    <Button variant="ghost" asChild>
                        <Link href="/products">View all</Link>
                    </Button>
                </div>
                <div className="mt-6">
                    <ProductGrid products={productsResult.items} />
                </div>
            </section>
        </div>
    );
}
