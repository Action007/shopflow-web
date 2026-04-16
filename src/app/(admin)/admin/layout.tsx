import Link from "next/link";
import type { Metadata } from "next";
import { CircleUserRound, Store } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { Button } from "@/components/ui/button";
import { AdminSidebarNav } from "@/components/admin/admin-sidebar-nav";
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
        icon: "overview",
    },
    {
        href: ROUTES.ADMIN.PRODUCTS,
        label: "Products",
        description: "Catalog creation and maintenance.",
        icon: "products",
    },
    {
        href: ROUTES.ADMIN.CATEGORIES,
        label: "Categories",
        description: "Organize storefront taxonomy.",
        icon: "categories",
    },
    {
        href: ROUTES.ADMIN.USERS,
        label: "Users",
        description: "Review and manage customer accounts.",
        icon: "users",
    },
    {
        href: ROUTES.ADMIN.ORDERS,
        label: "Orders",
        description: "Track fulfillment and status updates.",
        icon: "orders",
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
                <div className="site-container text-center flex flex-row flex-wrap items-center justify-center sm:justify-between sm:text-left gap-4 py-5">
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

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <Button
                            asChild
                            variant="secondary"
                            className="h-10 rounded-full px-4 text-on-surface"
                        >
                            <Link href={ROUTES.PROFILE}>
                                <CircleUserRound className="h-4 w-4" />
                                <span className="text-xs font-bold uppercase tracking-widest sm:hidden">
                                    Me
                                </span>
                                <span className="hidden text-xs font-bold uppercase tracking-widest sm:inline">
                                    Profile
                                </span>
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="h-10 rounded-full px-4"
                        >
                            <Link href={ROUTES.PRODUCTS}>
                                <Store className="h-4 w-4" />
                                <span className="text-xs font-bold uppercase tracking-widest">
                                    Store
                                </span>
                            </Link>
                        </Button>
                        <LogoutButton compactLabel="Exit" />
                    </div>
                </div>
            </header>

            <div className="site-page space-y-6 py-6 sm:space-y-8 sm:py-8">
                <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start xl:gap-8">
                    <aside className="space-y-4 lg:sticky lg:top-8">
                        <AdminSidebarNav links={adminLinks} />
                    </aside>

                    <main className="min-w-0">{children}</main>
                </div>
            </div>
        </div>
    );
}
