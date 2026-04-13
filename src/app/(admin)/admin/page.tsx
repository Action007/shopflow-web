import Link from "next/link";
import { Boxes, ClipboardList, Tags, Users } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";

const adminCards = [
    {
        title: "Products",
        description: "Create, update, and retire catalog items.",
        href: ROUTES.ADMIN.PRODUCTS,
        icon: Boxes,
    },
    {
        title: "Categories",
        description: "Shape how products are grouped and discovered.",
        href: ROUTES.ADMIN.CATEGORIES,
        icon: Tags,
    },
    {
        title: "Users",
        description: "Review account data and moderation workflows.",
        href: ROUTES.ADMIN.USERS,
        icon: Users,
    },
    {
        title: "Orders",
        description: "Track operations and update order states.",
        href: ROUTES.ADMIN.ORDERS,
        icon: ClipboardList,
    },
] as const;

export default function AdminDashboardPage() {
    return (
        <div className="space-y-8">
            <section className="rounded-[28px] border border-outline-variant/15 bg-surface-low p-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/80">
                    Admin Console
                </p>
                <h1 className="mt-3 font-headline text-4xl font-black tracking-[-0.03em] text-on-surface">
                    Operations are now separated from the shopper flow.
                </h1>
                <p className="mt-4 max-w-[58ch] text-[15px] leading-relaxed text-on-surface-variant">
                    This admin area is the foundation for product, category,
                    user, and order management. The pages below are the new
                    dedicated workspace instead of mixing management controls
                    into customer shopping screens.
                </p>
            </section>

            <section className="grid gap-4 md:grid-cols-2">
                {adminCards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <Link
                            key={card.href}
                            href={card.href}
                            className="rounded-[24px] border border-outline-variant/15 bg-surface-low p-6 transition-colors duration-300 ease-fluid hover:bg-surface-high"
                        >
                            <Icon className="h-6 w-6 text-primary" />
                            <h2 className="mt-6 font-headline text-2xl font-bold tracking-[-0.02em] text-on-surface">
                                {card.title}
                            </h2>
                            <p className="mt-3 text-[15px] leading-relaxed text-on-surface-variant">
                                {card.description}
                            </p>
                        </Link>
                    );
                })}
            </section>
        </div>
    );
}
