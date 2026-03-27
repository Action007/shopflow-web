import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatPrice(price: string | number): string {
    const num = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(num);
}

export function buildQueryString<T extends object>(params: T): string {
    const entries = Object.entries(params)
        .filter(([, value]) => value !== undefined && value !== null && value !== "")
        .map(([key, value]) => [key, String(value)]);

    if (entries.length === 0) return "";

    return "?" + new URLSearchParams(entries).toString();
}