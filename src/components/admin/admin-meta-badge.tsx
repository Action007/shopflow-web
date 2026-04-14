interface AdminMetaBadgeProps {
    label: string;
    value: string;
}

export function AdminMetaBadge({ label, value }: AdminMetaBadgeProps) {
    return (
        <div className="rounded-full border border-outline-variant/15 bg-surface-high px-3 py-1.5 text-xs">
            <span className="font-bold text-on-surface">{value}</span>
            <span className="ml-2 text-on-surface-variant">{label}</span>
        </div>
    );
}
