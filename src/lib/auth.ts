import { ApiClientError } from "./api";
import { apiAuthGet } from "./api-auth";
import { getAccessToken } from "./auth-cookies";
import type { User } from "@/types/user";
import { API_ROUTES } from "./constants/routes";
export {
    clearAuthCookies,
    getAccessToken,
    getRefreshToken,
    setAuthCookies,
} from "./auth-cookies";

export async function getCurrentUser(): Promise<User | null> {
    const token = await getAccessToken();
    if (!token) return null;

    try {
        return await apiAuthGet<User>(API_ROUTES.USER.ME);
    } catch (error) {
        if (error instanceof ApiClientError && error.statusCode === 401) {
            return null;
        }

        throw error;
    }
}
