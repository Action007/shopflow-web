import Link from "next/link";
import type { Metadata } from "next";
import { Boxes, ClipboardList, Shield, Tags, Users } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { requireAdminUser } from "@/lib/route-guards";
import { ROUTES } from "@/lib/constants/routes";

export const metadata: Metadata = {
    title: "Admin",
};

const adminLinks = [
    {
        href: ROUTES.ADMIN.ROOT,
        label: "Overview",
        description: "Entry point for management workflows.",
        icon: Shield,
    },
    {
        href: ROUTES.ADMIN.PRODUCTS,
        label: "Products",
        description: "Catalog creation and maintenance.",
        icon: Boxes,
    },
    {
        href: ROUTES.ADMIN.CATEGORIES,
        label: "Categories",
        description: "Organize storefront taxonomy.",
        icon: Tags,
    },
    {
        href: ROUTES.ADMIN.USERS,
        label: "Users",
        description: "Review and manage customer accounts.",
        icon: Users,
    },
    {
        href: ROUTES.ADMIN.ORDERS,
        label: "Orders",
        description: "Track fulfillment and status updates.",
        icon: ClipboardList,
    },
] as const;

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await requireAdminUser();

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b border-outline-variant/10 bg-surface-low/80 backdrop-blur-xl">
                <div className="site-container flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <Link
                            href={ROUTES.ADMIN.ROOT}
                            className="text-[22px] font-black tracking-tighter text-on-surface"
                        >
                            ShopFlow Admin
                        </Link>
                        <p className="mt-1 text-sm text-on-surface-variant">
                            Signed in as {user.firstName} {user.lastName}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            href={ROUTES.PROFILE}
                            className="text-sm font-bold text-primary"
                        >
                            Profile
                        </Link>
                        <Link
                            href={ROUTES.PRODUCTS}
                            className="text-sm font-bold text-on-surface-variant transition-colors duration-300 ease-fluid hover:text-primary"
                        >
                            Storefront
                        </Link>
                        <LogoutButton />
                    </div>
                </div>
            </header>

            <div className="site-page grid gap-8 py-8 lg:grid-cols-[280px_minmax(0,1fr)]">
                <aside className="lg:sticky lg:top-8">
                    <nav className="space-y-3 rounded-[28px] border border-outline-variant/15 bg-surface-low p-4">
                        {adminLinks.map((link) => {
                            const Icon = link.icon;

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="block rounded-[20px] border border-transparent px-4 py-4 transition-colors duration-300 ease-fluid hover:border-outline-variant/10 hover:bg-surface-high"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-primary/10 p-2 text-primary">
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-on-surface">
                                                {link.label}
                                            </p>
                                            <p className="text-sm text-on-surface-variant">
                                                {link.description}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                <main>{children}</main>
            </div>
        </div>
    );
}
