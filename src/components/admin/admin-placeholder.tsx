import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";

interface AdminPlaceholderProps {
    eyebrow: string;
    title: string;
    description: string;
}

export function AdminPlaceholder({
    eyebrow,
    title,
    description,
}: AdminPlaceholderProps) {
    return (
        <section className="rounded-[28px] border border-outline-variant/15 bg-surface-low p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/80">
                {eyebrow}
            </p>
            <h1 className="mt-3 font-headline text-3xl font-black tracking-[-0.03em] text-on-surface">
                {title}
            </h1>
            <p className="mt-4 max-w-[56ch] text-[15px] leading-relaxed text-on-surface-variant">
                {description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild>
                    <Link href={ROUTES.ADMIN.ROOT}>Back to Admin</Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href={ROUTES.PRODUCTS}>Return to Storefront</Link>
                </Button>
            </div>
        </section>
    );
}
