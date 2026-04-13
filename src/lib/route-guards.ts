import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { ROUTES } from "@/lib/constants/routes";
import { canAccessShopperFeatures, isAdmin } from "@/lib/roles";

function getLoginRedirectUrl(callbackUrl: string) {
    return `${ROUTES.LOGIN}?callbackUrl=${encodeURIComponent(callbackUrl)}`;
}

export async function requireAdminUser(callbackUrl = ROUTES.ADMIN.ROOT) {
    const user = await getCurrentUser();

    if (!user) {
        redirect(getLoginRedirectUrl(callbackUrl));
    }

    if (!isAdmin(user)) {
        redirect(ROUTES.HOME);
    }

    return user;
}

export async function requireCustomerUser(callbackUrl: string) {
    const user = await getCurrentUser();

    if (!user) {
        redirect(getLoginRedirectUrl(callbackUrl));
    }

    if (!canAccessShopperFeatures(user)) {
        redirect(ROUTES.ADMIN.ROOT);
    }

    return user;
}
