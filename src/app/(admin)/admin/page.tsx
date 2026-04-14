import { Boxes, ClipboardList, ImageUp, Tags, Users } from "lucide-react";

const adminGuides = [
    {
        title: "Products",
        description:
            "Manage the storefront catalog with paginated search, category filtering, create and edit flows, stock updates, soft delete, and image replacement through imageUploadId.",
        icon: Boxes,
        bullets: [
            "Use the Products page to create and maintain catalog items.",
            "Upload images first, then attach them with imageUploadId.",
            "Prices are sent as decimal strings and deletes are soft deletes.",
        ],
    },
    {
        title: "Categories",
        description:
            "Maintain taxonomy structure with name, optional description, and optional parent category relationships for nested organization.",
        icon: Tags,
        bullets: [
            "Categories support list, create, update, and soft delete.",
            "Parent-child relationships shape storefront discovery.",
            "This area should stay focused on taxonomy, not product editing.",
        ],
    },
    {
        title: "Users",
        description:
            "Review the paginated user list and maintain safe profile fields without implying that email or password can be changed from admin.",
        icon: Users,
        bullets: [
            "User listing is paginated at the API level.",
            "Profile updates allow firstName, lastName, and optional imageUploadId only.",
            "Soft delete supports moderation and account retirement workflows.",
        ],
    },
    {
        title: "Orders",
        description:
            "Use the orders workspace as an operations surface for status updates, item review, shipping details, and fulfillment flow.",
        icon: ClipboardList,
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
            <section className="rounded-[28px] border border-outline-variant/15 bg-surface-low p-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/80">
                    Admin Console
                </p>
                <h1 className="mt-3 font-headline text-4xl font-black tracking-[-0.03em] text-on-surface">
                    Operations are now separated from the shopper flow.
                </h1>
                <p className="mt-4 max-w-[58ch] text-[15px] leading-relaxed text-on-surface-variant">
                    Use the sidebar to move between admin workspaces. This
                    overview explains what each section is responsible for and
                    what the backend actually supports today.
                </p>
            </section>

            <section className="rounded-[28px] border border-outline-variant/15 bg-surface-low p-6 sm:p-8">
                <div className="max-w-[60ch]">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/80">
                        How To Use Admin
                    </p>
                    <h2 className="mt-2 font-headline text-3xl font-black tracking-[-0.03em] text-on-surface">
                        Each section has a clear responsibility.
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
                        The sidebar already covers navigation, so this page
                        focuses on guidance instead of repeating the same links.
                    </p>
                </div>

                <div className="mt-6 grid gap-4 xl:grid-cols-2">
                    {adminGuides.map((guide) => {
                        const Icon = guide.icon;

                        return (
                            <article
                                key={guide.title}
                                className="rounded-[24px] border border-outline-variant/15 bg-surface-high/50 p-6"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="rounded-2xl bg-background p-3 text-primary">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-headline text-2xl font-bold tracking-[-0.02em] text-on-surface">
                                            {guide.title}
                                        </h3>
                                        <p className="mt-3 text-[15px] leading-relaxed text-on-surface-variant">
                                            {guide.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 space-y-3">
                                    {guide.bullets.map((bullet) => (
                                        <div
                                            key={bullet}
                                            className="rounded-[18px] border border-outline-variant/10 bg-background/60 px-4 py-3 text-sm leading-relaxed text-on-surface-variant"
                                        >
                                            {bullet}
                                        </div>
                                    ))}
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>

            <section className="rounded-[28px] border border-outline-variant/15 bg-surface-low p-6 sm:p-8">
                <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-surface-high p-3 text-primary">
                        <ImageUp className="h-5 w-5" />
                    </div>
                    <div className="max-w-[62ch]">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/80">
                            Upload Flow
                        </p>
                        <h2 className="mt-2 font-headline text-2xl font-black tracking-[-0.03em] text-on-surface">
                            Images are a two-step workflow.
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
                            Uploads create a pending image first. The returned
                            upload id is then attached to a product or user
                            profile as <code>imageUploadId</code>. Pending
                            uploads can be removed directly, while used uploads
                            become part of the stored record.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
