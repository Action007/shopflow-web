import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/lib/auth-cookies";
import { ROUTES } from "@/lib/constants/routes";

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const callbackUrl = requestUrl.searchParams.get("callbackUrl");
    const reason =
        requestUrl.searchParams.get("reason") ?? "session-expired";

    await clearAuthCookies();

    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set("reason", reason);

    if (callbackUrl) {
        loginUrl.searchParams.set("callbackUrl", callbackUrl);
    }

    return NextResponse.redirect(loginUrl);
}
