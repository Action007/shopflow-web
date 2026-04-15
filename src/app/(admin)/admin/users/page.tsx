import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ApiClientError } from "@/lib/api";
import { apiAuthGet } from "@/lib/api-auth";
import { buildQueryString } from "@/lib/utils";
import { CACHE_TAGS } from "@/lib/constants/cache";
import { API_ROUTES, ROUTES } from "@/lib/constants/routes";
import { AdminUserManager } from "@/components/admin/admin-user-manager";
import { Pagination } from "@/components/shared/pagination";
import { RequestErrorState } from "@/components/shared/request-error-state";
import { normalizePaginationParams } from "@/lib/pagination-params";
import { requireAdminUser } from "@/lib/route-guards";
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
    const paginationState = normalizePaginationParams(params);

    if (paginationState.needsRedirect) {
        redirect(`${ROUTES.ADMIN.USERS}${paginationState.queryString}`);
    }

    const currentUser = await requireAdminUser(ROUTES.ADMIN.USERS);
    const effectiveParams = paginationState.effectiveParams;
    const queryString = buildQueryString(effectiveParams);
    let users: PaginatedResult<User>;

    try {
        users = await apiAuthGet<PaginatedResult<User>>(
            `${API_ROUTES.USER.LIST}${queryString}`,
            { tags: [CACHE_TAGS.USERS] },
        );
    } catch (error) {
        if (error instanceof ApiClientError && error.statusCode === 403) {
            return (
                <RequestErrorState
                    title="Users unavailable"
                    description="The backend denied access to the admin user list for this account. This usually means the API role permissions for the users endpoint are missing or stricter than the frontend expects."
                    primaryActionLabel="Back to Admin"
                    primaryActionHref={ROUTES.ADMIN.ROOT}
                    secondaryActionLabel="Open Store"
                    secondaryActionHref={ROUTES.PRODUCTS}
                />
            );
        }

        throw error;
    }

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
