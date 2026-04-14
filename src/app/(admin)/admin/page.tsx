import Link from "next/link";
import {
    ArrowRight,
    Boxes,
    ClipboardList,
    ImageUp,
    Tags,
    Users,
} from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { AdminMetaBadge } from "@/components/admin/admin-meta-badge";
import { AdminSectionShell } from "@/components/admin/admin-section-shell";
import { AdminWorkspaceHeader } from "@/components/admin/admin-workspace-header";
import { AdminRecordShell } from "@/components/admin/admin-record-shell";

const adminGuides = [
    {
        title: "Products",
        href: ROUTES.ADMIN.PRODUCTS,
        description:
            "Manage the storefront catalog with paginated search, category filtering, create and edit flows, stock updates, soft delete, and image replacement through imageUploadId.",
        icon: Boxes,
        statLabel: "Focus",
        statValue: "Catalog",
        bullets: [
            "Use the Products page to create and maintain catalog items.",
            "Upload images first, then attach them with imageUploadId.",
            "Prices are sent as decimal strings and deletes are soft deletes.",
        ],
    },
    {
        title: "Categories",
        href: ROUTES.ADMIN.CATEGORIES,
        description:
            "Maintain taxonomy structure with name, optional description, and optional parent category relationships for nested organization.",
        icon: Tags,
        statLabel: "Focus",
        statValue: "Taxonomy",
        bullets: [
            "Categories support list, create, update, and soft delete.",
            "Parent-child relationships shape storefront discovery.",
            "This area should stay focused on taxonomy, not product editing.",
        ],
    },
    {
        title: "Users",
        href: ROUTES.ADMIN.USERS,
        description:
            "Review the paginated user list and maintain safe profile fields without implying that email or password can be changed from admin.",
        icon: Users,
        statLabel: "Focus",
        statValue: "Accounts",
        bullets: [
            "User listing is paginated at the API level.",
            "Profile updates allow firstName, lastName, and optional imageUploadId only.",
            "Soft delete supports moderation and account retirement workflows.",
        ],
    },
    {
        title: "Orders",
        href: ROUTES.ADMIN.ORDERS,
        description:
            "Use the orders workspace as an operations surface for status updates, item review, shipping details, and fulfillment flow.",
        icon: ClipboardList,
        statLabel: "Focus",
        statValue: "Fulfillment",
        bullets: [
            "Orders expose order number, totals, item count, and shipping address.",
            "Admins can update status only through valid transitions.",
            "Customer-side cancellation is separate and only for pending orders.",
        ],
    },
] as const;

export default function AdminDashboardPage() {
    return (
        <div className="space-y-8">
            <AdminWorkspaceHeader
                eyebrow="Admin Console"
                title="Run catalog, taxonomy, fulfillment, and account operations from one control surface."
                description="This overview is the front door to the admin area. It points to the four working admin sections and summarizes the guardrails the current backend contract actually supports."
                stats={[
                    { label: "Workspaces", value: "4" },
                    { label: "Admin-safe flows", value: "Users, Orders" },
                    { label: "Content areas", value: "Products, Categories" },
                ]}
                maxWidthClassName="max-w-[60ch]"
            />

            <AdminSectionShell
                eyebrow="Workspace Guide"
                title="Choose the surface that matches the job."
                description="Each admin route has a focused responsibility. Use this page as an orientation layer, then jump into the workspace that best matches the task at hand."
                contentClassName="mt-6"
            >
                <div className="grid gap-4 xl:grid-cols-2">
                    {adminGuides.map((guide) => {
                        const Icon = guide.icon;

                        return (
                            <AdminRecordShell
                                key={guide.title}
                                className="bg-surface-high/50"
                            >
                                <div className="space-y-5 p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="rounded-2xl bg-background p-3 text-primary">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="font-headline text-2xl font-bold tracking-[-0.02em] text-on-surface">
                                                    {guide.title}
                                                </h3>
                                                <AdminMetaBadge
                                                    label={guide.statLabel}
                                                    value={guide.statValue}
                                                />
                                            </div>
                                            <p className="mt-3 text-[15px] leading-relaxed text-on-surface-variant">
                                                {guide.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {guide.bullets.map((bullet) => (
                                            <div
                                                key={bullet}
                                                className="rounded-[18px] border border-outline-variant/10 bg-background/60 px-4 py-3 text-sm leading-relaxed text-on-surface-variant"
                                            >
                                                {bullet}
                                            </div>
                                        ))}
                                    </div>

                                    <Link
                                        href={guide.href}
                                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-opacity duration-300 hover:opacity-80"
                                    >
                                        Open {guide.title}
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </AdminRecordShell>
                        );
                    })}
                </div>
            </AdminSectionShell>
        </div>
    );
}
