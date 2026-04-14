import Link from "next/link";
import type { Metadata } from "next";
import { LogoutButton } from "@/components/auth/logout-button";
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

            <div className="site-page space-y-6 py-6 sm:space-y-8 sm:py-8">
                <section className="overflow-hidden rounded-[32px] border border-outline-variant/15 bg-surface-low">
                    <div className="relative p-6 sm:p-8">
                        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />

                        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                            <div className="max-w-[56ch]">
                                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary/75">
                                    Admin Workspace
                                </p>
                                <h1 className="mt-3 font-headline text-3xl font-black tracking-[-0.03em] text-on-surface sm:text-4xl">
                                    Run catalog, customer, and order operations
                                    from one control surface.
                                </h1>
                                <p className="mt-4 text-sm leading-relaxed text-on-surface-variant sm:text-[15px]">
                                    The admin area now has its own navigation and
                                    workspace shell so each management page feels
                                    connected instead of isolated.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:max-w-[320px] sm:grid-cols-2">
                                <div className="rounded-[24px] border border-outline-variant/10 bg-surface-high px-4 py-4">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                                        Role
                                    </p>
                                    <p className="mt-2 text-lg font-black text-on-surface">
                                        Admin
                                    </p>
                                </div>
                                <div className="rounded-[24px] border border-outline-variant/10 bg-surface-high px-4 py-4">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                                        Surface
                                    </p>
                                    <p className="mt-2 text-lg font-black text-on-surface">
                                        Live
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start xl:gap-8">
                    <aside className="space-y-4 lg:sticky lg:top-8">
                        <AdminSidebarNav links={adminLinks} />

                        <section className="hidden rounded-[28px] border border-outline-variant/15 bg-surface-low p-5 lg:block">
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/75">
                                Session
                            </p>
                            <h2 className="mt-2 text-xl font-black tracking-tight text-on-surface">
                                {user.firstName} {user.lastName}
                            </h2>
                            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                                Use the navigation to move between products,
                                categories, users, and order workflows.
                            </p>
                        </section>
                    </aside>

                    <main className="min-w-0">{children}</main>
                </div>
            </div>
        </div>
    );
}
