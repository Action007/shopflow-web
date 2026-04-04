// Centralized route and API endpoint definitions

// Frontend routes
export const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    PRODUCTS: "/products",
    CART: "/cart",
    CHECKOUT: "/checkout",
    ORDERS: "/orders",
} as const;

// API endpoints
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
    CART: "/cart",
    CHECKOUT: "/checkout",
    ORDERS: "/orders",
} as const;

// Protected routes (require authentication)
export const PROTECTED_ROUTES = [
    ROUTES.CART,
    ROUTES.CHECKOUT,
    ROUTES.ORDERS,
] as const;

// Auth routes (redirect to home if already authenticated)
export const AUTH_ROUTES = [ROUTES.LOGIN, ROUTES.REGISTER] as const;
