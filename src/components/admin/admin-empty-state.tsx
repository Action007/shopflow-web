interface AdminEmptyStateProps {
    title: string;
    description: string;
}

export function AdminEmptyState({
    title,
    description,
}: AdminEmptyStateProps) {
    return (
        <section className="rounded-[28px] border border-dashed border-outline-variant/20 bg-surface-low px-6 py-10 text-center">
            <h2 className="font-headline text-2xl font-black tracking-[-0.02em] text-on-surface">
                {title}
            </h2>
            <p className="mx-auto mt-3 max-w-[48ch] text-sm leading-relaxed text-on-surface-variant">
                {description}
            </p>
        </section>
    );
}
