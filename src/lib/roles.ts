import type { User } from "@/types/user";

type AppUser = User | null | undefined;

export function isAdmin(user: AppUser): user is User & { role: "ADMIN" } {
    return user?.role === "ADMIN";
}

export function canAccessShopperFeatures(user: AppUser): boolean {
    return user?.role !== "ADMIN";
}
