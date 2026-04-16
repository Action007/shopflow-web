import { ROUTES } from "@/lib/constants/routes";

export function getLoginRedirectUrl(callbackUrl: string) {
    return `${ROUTES.LOGIN}?callbackUrl=${encodeURIComponent(callbackUrl)}`;
}

export function getSessionExpiredRedirectUrl(callbackUrl?: string) {
    const params = new URLSearchParams({
        reason: "session-expired",
    });

    if (callbackUrl) {
        params.set("callbackUrl", callbackUrl);
    }

    return `${ROUTES.SESSION_EXPIRED}?${params.toString()}`;
}
