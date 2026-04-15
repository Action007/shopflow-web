import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
    ArrowUpRight,
    Heart,
    Headphones,
    Package,
    Shield,
    ShoppingBag,
    UserRound,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { apiAuthGet } from "@/lib/api-auth";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/order/order-status-badge";
import { ROUTES, API_ROUTES } from "@/lib/constants/routes";
import { CACHE_TAGS } from "@/lib/constants/cache";
import type { PaginatedResult } from "@/types/product";
import type { Order } from "@/types/order";
import { formatPrice } from "@/lib/utils";
import { isAdmin } from "@/lib/roles";
import { ProfileSettingsForm } from "@/components/profile/profile-settings-form";
import { AppImage } from "@/components/shared/app-image";

export const metadata: Metadata = {
    title: "Profile",
};

const quickLinks = [
    {
        title: "Orders",
        description: "Review purchases and shipment status.",
        href: ROUTES.ORDERS,
        icon: Package,
    },
    {
        title: "Catalog",
        description: "Continue browsing the latest arrivals.",
        href: ROUTES.PRODUCTS,
        icon: ShoppingBag,
    },
    {
        title: "Support",
        description: "Get help with account or order questions.",
        href: ROUTES.SUPPORT,
        icon: Headphones,
    },
    {
        title: "Wishlist",
        description: "Keep track of products you want to revisit.",
        href: ROUTES.WISHLIST,
        icon: Heart,
    },
] as const;

function formatMemberSince(date: string) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        year: "numeric",
    }).format(new Date(date));
}

export default async function ProfilePage() {
    const user = await getCurrentUser();
    if (!user) redirect(`${ROUTES.LOGIN}?callbackUrl=${ROUTES.PROFILE}`);
    const adminMode = isAdmin(user);

    const orders: PaginatedResult<Order> = adminMode
        ? {
              items: [],
              meta: {
                  total: 0,
                  page: 1,
                  limit: 3,
                  totalPages: 0,
                  hasNext: false,
                  hasPrevious: false,
              },
          }
        : await apiAuthGet<PaginatedResult<Order>>(
              `${API_ROUTES.ORDERS.LIST}?limit=3`,
              { tags: [CACHE_TAGS.ORDERS] },
          );

    const initials = `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`;
    const latestOrder = orders.items[0] ?? null;
    const visibleQuickLinks = adminMode
        ? [
              {
                  title: "Admin Console",
                  description: "Open the management workspace for operations.",
                  href: ROUTES.ADMIN.ROOT,
                  icon: Shield,
              },
              {
                  title: "Catalog",
                  description: "Review the public storefront experience.",
                  href: ROUTES.PRODUCTS,
                  icon: ShoppingBag,
              },
              {
                  title: "Support",
                  description: "Check the customer-facing support entry point.",
                  href: ROUTES.SUPPORT,
                  icon: Headphones,
              },
          ]
        : quickLinks;

    return (
        <div className="site-page pb-16 sm:pb-32">
            <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">
                <aside className="lg:sticky lg:top-24">
                    <div className="rounded-[28px] bg-surface-low p-8 shadow-[0_0_60px_rgba(229,225,228,0.04)]">
                        <div className="flex flex-col items-center text-center">
                            <div className="lithium-glow relative mb-6 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full text-3xl font-black text-on-primary-container">
                                {user.profileImageUrl ? (
                                    <AppImage
                                        src={user.profileImageUrl}
                                        alt={`${user.firstName} ${user.lastName}`}
                                        fill
                                        sizes="96px"
                                        className="object-cover"
                                    />
                                ) : (
                                    initials
                                )}
                            </div>
                            <h1 className="font-headline text-[2rem] font-black tracking-[-0.03em] text-on-surface">
                                {user.firstName} {user.lastName}
                            </h1>
                            <p className="mt-2 text-[15px] text-on-surface-variant">
                                {user.email}
                            </p>

                            <div className="mt-5 inline-flex rounded-full border border-outline-variant/15 bg-surface-high px-3 py-1">
                                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                                    {user.role}
                                </span>
                            </div>
                        </div>

                        <div className="mt-8 space-y-6">
                            <div>
                                <p className="text-sm font-semibold tracking-[-0.01em] text-on-surface-variant">
                                    Member Since
                                </p>
                                <p className="mt-2 font-mono text-base tracking-[0.02em] text-primary">
                                    {formatMemberSince(user.createdAt)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold tracking-[-0.01em] text-on-surface-variant">
                                    Latest Shipping Address
                                </p>
                                <p className="mt-2 text-[15px] font-medium leading-7 tracking-[-0.01em] text-on-surface">
                                    {latestOrder?.shippingAddress ??
                                        "No address on file yet."}
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>

                <div className="space-y-8">
                    <section>
                        <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                            Quick Actions
                        </p>
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {visibleQuickLinks.map((link) => {
                                const Icon = link.icon;

                                return (
                                    <Link
                                        key={link.title}
                                        href={link.href}
                                        className="rounded-[24px] bg-surface-low p-6 transition-colors duration-300 ease-fluid hover:bg-surface-high"
                                    >
                                        <Icon className="mb-4 h-6 w-6 text-primary" />
                                        <h2 className="font-headline text-lg font-bold tracking-[-0.02em] text-on-surface">
                                            {link.title}
                                        </h2>
                                        <p className="mt-3 text-[15px] leading-relaxed text-on-surface-variant">
                                            {link.description}
                                        </p>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>

                    <section className="space-y-4">
                        <ProfileSettingsForm user={user} />

                        <div className="overflow-hidden rounded-[28px] bg-surface-low shadow-[0_0_60px_rgba(229,225,228,0.04)]">
                            <div className="px-6 py-5">
                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                                    Account Snapshot
                                </p>
                            </div>
                            <div className="space-y-2 px-3 pb-3">
                                {[
                                    {
                                        label: "Full Name",
                                        value: `${user.firstName} ${user.lastName}`,
                                    },
                                    { label: "Email Address", value: user.email },
                                    { label: "Role", value: user.role },
                                    {
                                        label: "Latest Address",
                                        value:
                                            latestOrder?.shippingAddress ??
                                            "No order-based address available yet",
                                    },
                                ].map((row) => (
                                    <div
                                        key={row.label}
                                        className="flex flex-col gap-1 rounded-[20px] px-4 py-4 transition-colors duration-300 ease-fluid hover:bg-white/5 md:flex-row md:items-center md:justify-between"
                                    >
                                        <span className="text-[15px] text-on-surface-variant">
                                            {row.label}
                                        </span>
                                        <span className="text-[15px] font-semibold text-on-surface md:text-base">
                                            {row.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section>
                            <div className="mb-4 flex items-end justify-between gap-4">
                                <div>
                                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                                        Recent Orders
                                    </p>
                                    <h2 className="font-headline text-[2rem] font-black tracking-[-0.03em] text-on-surface">
                                        Your latest activity
                                    </h2>
                                </div>
                                <Link
                                    href={ROUTES.ORDERS}
                                    className="text-sm font-bold text-primary"
                                >
                                    View all
                                </Link>
                            </div>

                                    {adminMode ? (
                                <div className="rounded-[28px] bg-surface-low p-8">
                                    <Shield className="mb-5 h-8 w-8 text-primary" />
                                    <h3 className="font-headline text-2xl font-bold tracking-[-0.02em]">
                                        Admin activity lives in the admin console
                                    </h3>
                                    <p className="mt-2 max-w-[36ch] text-[15px] leading-relaxed text-on-surface-variant">
                                        Personal shopper order history is hidden for admins.
                                        Continue in the admin workspace to manage operations.
                                    </p>
                                    <Button asChild className="mt-6">
                                        <Link href={ROUTES.ADMIN.ROOT}>
                                            Open Admin Console
                                        </Link>
                                    </Button>
                                </div>
                            ) : orders.items.length === 0 ? (
                                <div className="rounded-[28px] bg-surface-low p-8">
                                    <UserRound className="mb-5 h-8 w-8 text-primary" />
                                    <h3 className="font-headline text-2xl font-bold tracking-[-0.02em]">
                                        No recent orders yet
                                    </h3>
                                    <p className="mt-2 max-w-[34ch] text-[15px] leading-relaxed text-on-surface-variant">
                                        Once you place an order, your activity
                                        stream will show the latest purchase
                                        state right here.
                                    </p>
                                    <Button asChild className="mt-6">
                                        <Link href={ROUTES.PRODUCTS}>
                                            Explore Catalog
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <div>
                                    <div className="space-y-4">
                                        {orders.items.slice(0, 3).map((order) => (
                                            <Link
                                                key={order.id}
                                                href={`${ROUTES.ORDERS}/${order.id}`}
                                                className="flex items-center justify-between gap-6 rounded-[28px] bg-surface-low p-6 transition-colors duration-300 ease-fluid hover:bg-surface-high"
                                            >
                                                <div>
                                                    <OrderStatusBadge
                                                        status={order.status}
                                                        className="mb-4"
                                                    />
                                                    <h3 className="font-headline text-xl font-bold tracking-[-0.02em] text-on-surface">
                                                        Order #{order.orderNumber}
                                                    </h3>
                                                    <p className="mt-1 text-[13px] text-on-surface-variant">
                                                        {new Date(
                                                            order.createdAt,
                                                        ).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                month: "short",
                                                                day: "numeric",
                                                                year: "numeric",
                                                            },
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-2xl font-black text-on-surface">
                                                        {formatPrice(
                                                            order.totalAmount,
                                                        )}
                                                    </p>
                                                    <div className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary">
                                                        Details
                                                        <ArrowUpRight className="h-4 w-4" />
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                    </section>
                </div>
            </div>
        </div>
    );
}
