import Link from "next/link";
import Image from "next/image";
import {
    ArrowRight,
    Cable,
    Headphones,
    Laptop,
    PackageCheck,
    ShieldCheck,
    SlidersHorizontal,
    Smartphone,
    Watch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiGet } from "@/lib/api";
import { ROUTES } from "@/lib/constants/routes";
import type { PaginatedResult, Product, Category } from "@/types/product";
import { ProductGrid } from "@/components/products/product-grid";
import { getCurrentUser } from "@/lib/auth";
import { canAccessShopperFeatures } from "@/lib/roles";

const categoryIcons = [Smartphone, Laptop, Headphones, Watch, Cable];
const assuranceItems = [
    {
        title: "Curated Catalog",
        description:
            "A tighter product mix built around everyday performance, not endless filler.",
        icon: SlidersHorizontal,
    },
    {
        title: "Live Stock Clarity",
        description:
            "Availability stays visible while you browse, so the cart feels dependable.",
        icon: PackageCheck,
    },
    {
        title: "Secure Ordering",
        description:
            "Checkout is designed to stay focused, fast, and clear from cart to confirmation.",
        icon: ShieldCheck,
    },
];

export default async function HomePage() {
    const currentUser = await getCurrentUser();
    const showPurchaseActions = canAccessShopperFeatures(currentUser);
    const [productsResult, categories] = await Promise.all([
        apiGet<PaginatedResult<Product>>(
            "/products?limit=4&sortBy=createdAt&sortOrder=desc",
            {
                revalidate: 300,
                tags: ["products"],
            },
        ),
        apiGet<Category[]>("/categories", { revalidate: 300 }),
    ]);

    const displayCategories = categories.slice(0, 5);

    return (
        <div className="lg:pb-0">
            <div className="site-container">
                <section className="dot-grid relative overflow-hidden lg:grid lg:min-h-[700px] lg:grid-cols-2 lg:items-center">
                    <div className="relative z-10 pl-4 py-20 flex flex-col justify-center md:py-30 lg:min-h-0 lg:pr-12">
                        <h1 className="mb-4 max-w-[12ch] text-[56px] font-black leading-[1.1] tracking-[-0.02em] text-on-surface lg:max-w-none">
                            The best tech, delivered.
                        </h1>
                        <p className="mb-8 max-w-[280px] text-base text-zinc-400 lg:max-w-[480px] lg:text-lg">
                            Experience precision-engineered hardware curated for
                            the modern digital obsidian aesthetic.
                        </p>
                        <div className="flex flex-col gap-4 md:w-1/2">
                            <Button asChild className="px-8 py-4 lg:px-14 text-base">
                                <Link href={ROUTES.PRODUCTS}>Shop Now</Link>
                            </Button>
                        </div>
                    </div>

                    <div className="absolute -right-20 top-1/3 h-90 w-90 -translate-y-1/2 rounded-full bg-primary opacity-20 blur-3xl lg:hidden" />

                    <div className="absolute bottom-30 right-5 h-80 w-70 rotate-6 overflow-hidden rounded-2xl shadow-2xl lg:relative md:bottom-40 lg:bottom-auto lg:right-0 lg:h-[700px] lg:w-full lg:rotate-0 lg:self-stretch">
                        <Image
                            src={"/main-img.jpg"}
                            alt={"Featured product"}
                            fill
                            priority
                            sizes="(max-width: 1024px) 192px, 50vw"
                            className="object-cover grayscale brightness-75 lg:object-right lg:brightness-100 lg:grayscale-0"
                        />
                    </div>
                </section>

                <section className="mb-12 mt-8">
                    <div className="no-scrollbar flex gap-3 overflow-x-auto px-6 lg:justify-center lg:overflow-visible lg:px-12">
                        {displayCategories.map((category, index) => {
                            const Icon = categoryIcons[index] ?? Smartphone;
                            return (
                                <Link
                                    key={category.id}
                                    href={`/products?categoryId=${category.id}`}
                                    className="flex shrink-0 items-center gap-2 rounded-full border border-outline-variant/15 bg-surface-low px-4 py-3 transition-transform duration-300 ease-fluid hover:-translate-y-0.5"
                                >
                                    <Icon className="h-4 w-4 text-primary" />
                                    <span className="text-xs font-bold uppercase tracking-widest">
                                        {category.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                <section className="mb-16 px-6 lg:px-12">
                    <div className="mb-8 flex justify-end">
                        <Link
                            href={ROUTES.PRODUCTS}
                            className="flex items-center gap-1 text-sm font-bold text-primary"
                        >
                            View all <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <ProductGrid
                        products={productsResult.items}
                        showPurchaseActions={showPurchaseActions}
                        className="grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
                    />
                </section>

                <section className="mb-16 px-6 lg:px-12">
                    <div className="rounded-[28px] border border-outline-variant/15 bg-surface-low p-6 lg:p-8">
                        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div className="space-y-3">
                                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary/80">
                                    Why ShopFlow
                                </p>
                                <h2 className="max-w-[12ch] text-3xl font-black tracking-tighter lg:text-5xl">
                                    Built to feel considered, not crowded.
                                </h2>
                            </div>
                            <p className="max-w-[420px] text-sm leading-relaxed text-on-surface-variant lg:text-base">
                                The homepage now leads into a store experience
                                that feels sharper: fewer distractions, clearer
                                product signals, and a purchase flow that stays
                                calm.
                            </p>
                        </div>

                        <div className="grid gap-4 lg:grid-cols-3">
                            {assuranceItems.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <article
                                        key={item.title}
                                        className="rounded-2xl border border-outline-variant/10 bg-surface-high p-5"
                                    >
                                        <div className="mb-8 inline-flex rounded-full bg-primary/10 p-3 text-primary">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <h3 className="mb-2 text-xl font-bold tracking-tight">
                                            {item.title}
                                        </h3>
                                        <p className="max-w-[28ch] text-sm leading-relaxed text-on-surface-variant">
                                            {item.description}
                                        </p>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className="mb-16 px-6 lg:px-12 sm:mb-30">
                    <div className="space-y-12 lg:grid lg:grid-cols-2 lg:items-center lg:gap-8 lg:space-y-0">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-black tracking-tighter lg:text-5xl">
                                Power that feels infinite.
                            </h2>
                            <p className="max-w-[500px] leading-relaxed text-neutral-500 lg:text-lg">
                                Beyond the aesthetic, we prioritize the raw
                                performance metrics that professional workflows
                                demand. No compromises, just precision.
                            </p>
                            <Link
                                href={ROUTES.PRODUCTS}
                                className="inline-flex items-center gap-2 border-b-2 border-primary/20 pb-1 font-bold text-primary"
                            >
                                Learn about our hardware legacy
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="aspect-square rounded-xl bg-surface-high p-4 lg:h-[200px] lg:aspect-auto">
                                <div className="flex h-full flex-col justify-end">
                                    <span className="text-3xl font-black text-primary lg:text-4xl">
                                        120Hz
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                                        Refresh Rate
                                    </span>
                                </div>
                            </div>
                            <div className="aspect-square rounded-xl border border-primary/20 bg-primary-container/20 p-4 lg:h-[200px] lg:aspect-auto">
                                <div className="flex h-full flex-col justify-end">
                                    <span className="text-3xl font-black text-primary lg:text-4xl">
                                        0.2ms
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">
                                        Response
                                    </span>
                                </div>
                            </div>
                            <div className="aspect-square rounded-xl bg-surface-high p-4 lg:h-[200px] lg:aspect-auto">
                                <div className="flex h-full flex-col justify-end">
                                    <span className="text-3xl font-black text-on-surface lg:text-4xl">
                                        8K
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                                        Resolution
                                    </span>
                                </div>
                            </div>
                            <div className="aspect-square rounded-xl bg-surface-high p-4 lg:h-[200px] lg:aspect-auto">
                                <div className="flex h-full flex-col justify-end">
                                    <span className="text-3xl font-black text-on-surface lg:text-4xl">
                                        ∞
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                                        Possibilities
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mb-20 px-6 lg:px-12 sm:mb-32">
                    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                        <div className="rounded-[28px] border border-primary/15 bg-primary-container/10 p-6 lg:p-8">
                            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-primary/80">
                                Store Rhythm
                            </p>
                            <h2 className="max-w-[14ch] text-3xl font-black tracking-tighter lg:text-4xl">
                                Browse the latest, move fast when something
                                fits.
                            </h2>
                            <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-on-surface-variant lg:text-base">
                                With {categories.length} active categories and{" "}
                                {productsResult.meta.total} products in the
                                catalog, the experience stays broad enough to
                                explore while still feeling intentionally
                                edited.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <Button asChild className="px-6">
                                    <Link href={ROUTES.PRODUCTS}>
                                        Explore Catalog
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                            {[
                                "01. Find the category that matches your setup.",
                                "02. Compare details without leaving the flow.",
                                "03. Checkout once the right product clicks.",
                            ].map((step) => (
                                <div
                                    key={step}
                                    className="rounded-2xl bg-surface-low p-5"
                                >
                                    <p className="text-sm font-medium leading-relaxed text-on-surface-variant">
                                        {step}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
