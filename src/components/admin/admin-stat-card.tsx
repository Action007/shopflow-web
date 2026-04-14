interface AdminStatCardProps {
    label: string;
    value: string;
}

export function AdminStatCard({ label, value }: AdminStatCardProps) {
    return (
        <div className="rounded-[24px] border border-outline-variant/10 bg-surface-high px-4 py-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                {label}
            </p>
            <p className="mt-2 text-2xl font-black tracking-tight text-on-surface">
                {value}
            </p>
        </div>
    );
}
