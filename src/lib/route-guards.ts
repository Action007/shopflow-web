import { redirect } from "next/navigation";
import { getAccessToken, getCurrentUser } from "@/lib/auth";
import {
    getLoginRedirectUrl,
    getSessionExpiredRedirectUrl,
} from "@/lib/auth-redirect";
import { ROUTES } from "@/lib/constants/routes";
import { canAccessShopperFeatures, isAdmin } from "@/lib/roles";

export async function requireAdminUser(callbackUrl: string = ROUTES.ADMIN.ROOT) {
    const user = await getCurrentUser();

    if (!user) {
        const accessToken = await getAccessToken();
        redirect(
            accessToken
                ? getSessionExpiredRedirectUrl(callbackUrl)
                : getLoginRedirectUrl(callbackUrl),
        );
    }

    if (!isAdmin(user)) {
        redirect(ROUTES.HOME);
    }

    return user;
}

export async function requireCustomerUser(callbackUrl: string) {
    const user = await getCurrentUser();

    if (!user) {
        const accessToken = await getAccessToken();
        redirect(
            accessToken
                ? getSessionExpiredRedirectUrl(callbackUrl)
                : getLoginRedirectUrl(callbackUrl),
        );
    }

    if (!canAccessShopperFeatures(user)) {
        redirect(ROUTES.ADMIN.ROOT);
    }

    return user;
}
