import type { Metadata } from "next";
import { apiAuthGet } from "@/lib/api-auth";
import { getCurrentUser } from "@/lib/auth";
import { buildQueryString } from "@/lib/utils";
import { CACHE_TAGS } from "@/lib/constants/cache";
import { API_ROUTES, ROUTES } from "@/lib/constants/routes";
import { AdminUserManager } from "@/components/admin/admin-user-manager";
import { Pagination } from "@/components/shared/pagination";
import type { PaginatedResult } from "@/types/product";
import type { User } from "@/types/user";

export const metadata: Metadata = {
    title: "Admin Users",
};

interface AdminUsersPageProps {
    searchParams: Promise<{
        page?: string;
        limit?: string;
    }>;
}

export default async function AdminUsersPage({
    searchParams,
}: AdminUsersPageProps) {
    const params = await searchParams;
    const currentUser = await getCurrentUser();
    const effectiveParams = {
        ...params,
        limit: params.limit ?? "10",
    };
    const queryString = buildQueryString(effectiveParams);
    const users = await apiAuthGet<PaginatedResult<User>>(
        `${API_ROUTES.USER.LIST}${queryString}`,
        { tags: [CACHE_TAGS.USERS] },
    );

    return (
        <div className="space-y-6">
            <AdminUserManager
                users={users.items}
                totalUsers={users.meta.total}
                currentAdminId={currentUser?.id ?? null}
            />
            <Pagination meta={users.meta} basePath={ROUTES.ADMIN.USERS} />
        </div>
    );
}
