"use client";

import type { User } from "@/types/user";
import { AdminSectionShell } from "./admin-section-shell";
import { AdminWorkspaceHeader } from "./admin-workspace-header";
import { AdminUserList } from "./admin-user-list";

interface AdminUserManagerProps {
    users: User[];
    totalUsers: number;
}

export function AdminUserManager({
    users,
    totalUsers,
}: AdminUserManagerProps) {
    const adminCount = users.filter((user) => user.role === "ADMIN").length;
    const customerCount = users.filter((user) => user.role === "CUSTOMER").length;

    return (
        <div className="space-y-6 xl:space-y-8">
            <AdminWorkspaceHeader
                eyebrow="Users Workspace"
                title="Review accounts, keep profile data tidy, and handle soft deletes safely."
                description="This workspace is for account oversight. Profile edits are limited to first name, last name, and optional profile image, while email, password, and role remain read-only here."
                stats={[
                    { label: "Users", value: String(totalUsers) },
                    { label: "Admins", value: String(adminCount) },
                    { label: "Customers", value: String(customerCount) },
                ]}
            />

            <AdminSectionShell
                eyebrow="Account Inventory"
                title="Existing users"
                description={`${totalUsers} account${totalUsers === 1 ? "" : "s"} available in the current admin view.`}
            />

            <AdminUserList users={users} />
        </div>
    );
}
