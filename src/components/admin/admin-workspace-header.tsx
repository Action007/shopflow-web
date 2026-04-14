import { AdminStatCard } from "./admin-stat-card";

interface AdminWorkspaceHeaderProps {
    eyebrow: string;
    title: string;
    description: string;
    stats: Array<{
        label: string;
        value: string;
    }>;
    maxWidthClassName?: string;
}

export function AdminWorkspaceHeader({
    eyebrow,
    title,
    description,
    stats,
    maxWidthClassName = "max-w-[56ch]",
}: AdminWorkspaceHeaderProps) {
    return (
        <section className="rounded-[28px] border border-outline-variant/15 bg-surface-low p-6">
            <div className="flex flex-col flex-wrap justify-between gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className={maxWidthClassName}>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80">
                        {eyebrow}
                    </p>
                    <h1 className="mt-3 font-headline text-3xl font-black tracking-[-0.03em] text-on-surface">
                        {title}
                    </h1>
                    <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
                        {description}
                    </p>
                </div>

                <div
                    className="grid gap-3"
                    style={{
                        gridTemplateColumns: `repeat(${Math.max(stats.length, 1)}, minmax(0, 1fr))`,
                    }}
                >
                    {stats.map((stat) => (
                        <AdminStatCard
                            key={stat.label}
                            label={stat.label}
                            value={stat.value}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
