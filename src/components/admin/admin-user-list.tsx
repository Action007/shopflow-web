"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, UserRound } from "lucide-react";
import { toast } from "sonner";
import { deleteAdminUserAction } from "@/actions/admin-user";
import { Button } from "@/components/ui/button";
import { shouldBypassImageOptimization } from "@/lib/image";
import type { User } from "@/types/user";
import { AdminEmptyState } from "./admin-empty-state";
import { AdminMetaBadge } from "./admin-meta-badge";
import { AdminRecordShell } from "./admin-record-shell";

interface AdminUserListProps {
    users: User[];
}

export function AdminUserList({ users }: AdminUserListProps) {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (user: User) => {
        const confirmed = window.confirm(
            `Delete "${user.firstName} ${user.lastName}"?`,
        );

        if (!confirmed) {
            return;
        }

        setDeletingId(user.id);
        const result = await deleteAdminUserAction(user.id);
        setDeletingId(null);

        if (!result.success) {
            toast.error("Could not delete user", {
                description: result.message,
            });
            return;
        }

        toast.success("User deleted");
        router.refresh();
    };

    if (users.length === 0) {
        return (
            <AdminEmptyState
                title="No users found"
                description="This page does not currently have any accounts in the selected admin result set."
            />
        );
    }

    return (
        <section className="space-y-4">
            {users.map((user) => {
                const isDeleting = deletingId === user.id;
                const fullName = `${user.firstName} ${user.lastName}`.trim();
                const initials = `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`;

                return (
                    <AdminRecordShell
                        key={user.id}
                    >
                        <div className="grid gap-5 p-5 xl:grid-cols-[88px_minmax(0,1fr)_auto] xl:items-start">
                            <div className="relative flex h-22 w-22 items-center justify-center overflow-hidden rounded-[22px] bg-surface-highest text-xl font-black text-on-primary-container">
                                {user.profileImageUrl ? (
                                    <Image
                                        src={user.profileImageUrl}
                                        alt={fullName || "User"}
                                        fill
                                        sizes="88px"
                                        unoptimized={shouldBypassImageOptimization(
                                            user.profileImageUrl,
                                        )}
                                        className="object-cover"
                                    />
                                ) : (
                                    initials || <UserRound className="h-6 w-6 text-primary" />
                                )}
                            </div>

                            <div className="space-y-3">
                                <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-headline text-2xl font-bold tracking-[-0.02em] text-on-surface">
                                                {fullName || "Unnamed user"}
                                            </h3>
                                            <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                                                {user.role}
                                            </span>
                                        </div>
                                        <p className="text-sm text-on-surface-variant">
                                            {user.email}
                                        </p>
                                    </div>

                                    <div className="flex gap-2 xl:hidden">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            disabled={isDeleting}
                                            onClick={() => void handleDelete(user)}
                                        >
                                            <Trash2 />
                                            {isDeleting ? "Deleting..." : "Delete"}
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <AdminMetaBadge
                                        label="Created"
                                        value={new Date(user.createdAt).toLocaleDateString()}
                                    />
                                    <AdminMetaBadge
                                        label="User ID"
                                        value={user.id.slice(0, 8)}
                                    />
                                </div>
                            </div>

                            <div className="hidden gap-3 xl:flex xl:flex-col">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    disabled={isDeleting}
                                    onClick={() => void handleDelete(user)}
                                >
                                    <Trash2 />
                                    {isDeleting ? "Deleting..." : "Delete"}
                                </Button>
                            </div>
                        </div>
                    </AdminRecordShell>
                );
            })}
        </section>
    );
}
