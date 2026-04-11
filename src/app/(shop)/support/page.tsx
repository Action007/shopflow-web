import type { Metadata } from "next";
import Link from "next/link";
import {
    ArrowRight,
    BadgeHelp,
    CircleHelp,
    Headphones,
    Mail,
    MessageSquareText,
    PackageSearch,
    PhoneCall,
    ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";

export const metadata: Metadata = {
    title: "Support",
};

const contactChannels = [
    {
        title: "Live Guidance",
        description: "Get immediate help navigating orders, returns, and product fit.",
        icon: MessageSquareText,
    },
    {
        title: "Email Queue",
        description: "Best for detailed questions about setup, compatibility, or policy.",
        icon: Mail,
    },
    {
        title: "Priority Callbacks",
        description: "Use this path when a purchase or shipment needs a faster response.",
        icon: PhoneCall,
    },
] as const;

const faqs = [
    {
        question: "How do I track an order after checkout?",
        answer:
            "Open your order history to review the latest status, shipment progress, and delivery timeline attached to each purchase.",
    },
    {
        question: "Can I change or cancel an order after placing it?",
        answer:
            "If the order has not moved too far into processing, support can help review the next available option for edits or cancellation.",
    },
    {
        question: "What if I need help choosing the right hardware?",
        answer:
            "Start with the catalog and compare specs, then use support for guidance on fit, workflow, and expected usage.",
    },
    {
        question: "How are payments and account details protected?",
        answer:
            "ShopFlow keeps the experience intentionally lean and limits surface noise, while account access stays behind secure authentication flows.",
    },
    {
        question: "Where should I go for return-related questions?",
        answer:
            "Support is the right first stop for return policy questions, order review, and product-condition concerns.",
    },
] as const;

export default function SupportPage() {
    return (
        <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute right-[-10%] top-8 h-[360px] w-[360px] rounded-full bg-primary/8 blur-[110px]" />
                <div className="absolute bottom-0 left-[-10%] h-[280px] w-[280px] rounded-full bg-primary-container/10 blur-[120px]" />
            </div>

            <div className="site-page relative pb-16 sm:pb-32">
                <section className="px-2 py-10 text-center">
                        <div className="mx-auto mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full border border-outline-variant/15 bg-surface-high">
                            <Headphones className="h-9 w-9 text-primary" />
                        </div>
                        <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">
                            Precision Support
                        </p>
                        <h1 className="font-headline mx-auto mb-4 text-5xl font-black tracking-[-0.03em] text-on-surface md:text-7xl">
                            How can we help?
                        </h1>
                        <p className="mx-auto mb-10 max-w-2xl text-[15px] leading-relaxed text-on-surface-variant md:text-lg">
                            A calmer support surface for order questions,
                            technical clarity, and purchase guidance without the
                            usual clutter.
                        </p>

                        <div className="mx-auto max-w-2xl rounded-[24px] border border-outline-variant/10 bg-surface-low px-5 py-5 shadow-[0_0_60px_rgba(229,225,228,0.04)]">
                            <div className="flex items-center gap-3 rounded-xl border-b-2 border-outline-variant/30 bg-surface px-4 py-4 focus-within:border-primary">
                                <CircleHelp className="h-5 w-5 text-primary" />
                                <input
                                    type="text"
                                    placeholder="Search orders, returns, or technical guidance..."
                                    className="w-full bg-transparent text-sm text-on-surface outline-none placeholder:text-text-muted"
                                />
                            </div>
                        </div>
                </section>

                <section className="mb-20 grid gap-4 md:grid-cols-3">
                        {contactChannels.map((channel) => {
                            const Icon = channel.icon;

                            return (
                                <article
                                    key={channel.title}
                                    className="rounded-[24px] bg-surface-low p-8 transition-colors duration-500 ease-fluid hover:bg-surface-high"
                                >
                                    <Icon className="mb-5 h-6 w-6 text-primary" />
                                    <h2 className="font-headline mb-2 text-2xl font-bold tracking-[-0.02em]">
                                        {channel.title}
                                    </h2>
                                    <p className="max-w-[28ch] text-[15px] leading-relaxed text-on-surface-variant">
                                        {channel.description}
                                    </p>
                                </article>
                            );
                        })}
                </section>

                <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
                        <div>
                            <div className="mb-8">
                                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                                    Common Inquiries
                                </p>
                                <h2 className="font-headline text-3xl font-black tracking-[-0.03em] md:text-4xl">
                                    Answers without the noise
                                </h2>
                            </div>

                            <div className="space-y-3">
                                {faqs.map((item) => (
                                    <details
                                        key={item.question}
                                        className="group rounded-[20px] bg-surface-low px-6 py-1"
                                    >
                                        <summary className="flex list-none items-center justify-between gap-4 py-5 text-left">
                                            <span className="text-[15px] font-semibold tracking-[-0.01em] text-on-surface">
                                                {item.question}
                                            </span>
                                            <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform duration-300 ease-fluid group-open:rotate-90" />
                                        </summary>
                                        <p className="pb-5 pr-8 text-[15px] leading-relaxed text-on-surface-variant">
                                            {item.answer}
                                        </p>
                                    </details>
                                ))}
                            </div>
                        </div>

                        <div className="lg:sticky lg:top-24">
                            <div className="rounded-[28px] border border-outline-variant/10 bg-surface-low p-8 shadow-[0_0_60px_rgba(229,225,228,0.04)]">
                                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-primary/80">
                                    Guided Actions
                                </p>
                                <h2 className="font-headline mb-2 text-[2rem] font-black tracking-[-0.03em]">
                                    Start in the right place.
                                </h2>
                                <p className="mb-8 text-[15px] leading-relaxed text-on-surface-variant">
                                    We do not have a full messaging backend in
                                    this storefront yet, so the fastest paths
                                    today are order review and account access.
                                </p>

                                <div className="space-y-4">
                                    <Link
                                        href={ROUTES.ORDERS}
                                        className="flex items-center justify-between rounded-2xl bg-surface-high px-5 py-4 transition-colors duration-300 ease-fluid hover:bg-surface-highest"
                                    >
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary/75">
                                                Orders
                                            </p>
                                            <p className="mt-1 text-[15px] font-semibold text-on-surface">
                                                Review shipment and status details
                                            </p>
                                        </div>
                                        <PackageSearch className="h-5 w-5 text-primary" />
                                    </Link>

                                    <Link
                                        href={ROUTES.PROFILE}
                                        className="flex items-center justify-between rounded-2xl bg-surface-high px-5 py-4 transition-colors duration-300 ease-fluid hover:bg-surface-highest"
                                    >
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary/75">
                                                Account
                                            </p>
                                            <p className="mt-1 text-[15px] font-semibold text-on-surface">
                                                Check membership and access details
                                            </p>
                                        </div>
                                        <BadgeHelp className="h-5 w-5 text-primary" />
                                    </Link>
                                </div>

                                <Button asChild size="lg" className="mt-8 w-full">
                                    <Link href={ROUTES.PRODUCTS}>
                                        Browse Products
                                    </Link>
                                </Button>
                            </div>

                            <div className="mt-6 flex gap-4 rounded-[24px] border border-primary/10 bg-primary-container/5 p-5">
                                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                                <div>
                                    <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                                        Data Privacy
                                    </p>
                                    <p className="text-[13px] leading-relaxed text-on-surface-variant">
                                        Authentication and account operations
                                        stay inside the same protected ShopFlow
                                        system, with a minimal surface area and
                                        no unnecessary exposure.
                                    </p>
                                </div>
                            </div>
                        </div>
                </section>
            </div>
        </div>
    );
}
