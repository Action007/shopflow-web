import Link from "next/link";
import { Button } from "@/components/ui/button";

interface RequestErrorStateProps {
    title: string;
    description: string;
    primaryActionLabel?: string;
    primaryActionHref?: string;
    secondaryActionLabel?: string;
    secondaryActionHref?: string;
}

export function RequestErrorState({
    title,
    description,
    primaryActionLabel,
    primaryActionHref,
    secondaryActionLabel,
    secondaryActionHref,
}: RequestErrorStateProps) {
    return (
        <section className="rounded-[28px] border border-outline-variant/15 bg-surface-low px-6 py-12 text-center">
            <h1 className="text-3xl font-black tracking-tighter text-on-surface">
                {title}
            </h1>
            <p className="mx-auto mt-4 max-w-[52ch] text-sm leading-relaxed text-on-surface-variant">
                {description}
            </p>

            {primaryActionLabel && primaryActionHref ? (
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Button asChild>
                        <Link href={primaryActionHref}>{primaryActionLabel}</Link>
                    </Button>
                    {secondaryActionLabel && secondaryActionHref ? (
                        <Button asChild variant="secondary">
                            <Link href={secondaryActionHref}>
                                {secondaryActionLabel}
                            </Link>
                        </Button>
                    ) : null}
                </div>
            ) : null}
        </section>
    );
}
