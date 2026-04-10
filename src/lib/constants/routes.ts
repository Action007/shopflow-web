export const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    PRODUCTS: "/products",
    SUPPORT: "/support",
    PROFILE: "/profile",
    CART: "/cart",
    CHECKOUT: "/checkout",
    ORDERS: "/orders",
} as const;

export const API_ROUTES = {
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        REFRESH: "/auth/refresh",
        LOGOUT: "/auth/logout",
    },
    PRODUCTS: {
        LIST: "/products",
        DETAIL: (id: string) => `/products/${id}`,
    },
    CATEGORIES: "/categories",
    USER: {
        ME: "/users/me",
    },
    CART: "/cart",
    CHECKOUT: "/checkout",
    ORDERS: "/orders",
    CANCEL: "/cancel"
} as const;

export const PROTECTED_ROUTES = [
    ROUTES.CART,
    ROUTES.CHECKOUT,
    ROUTES.ORDERS,
    ROUTES.PROFILE,
] as const;

export const AUTH_ROUTES = [ROUTES.LOGIN, ROUTES.REGISTER] as const;
