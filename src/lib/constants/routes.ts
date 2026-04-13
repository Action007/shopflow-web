export const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    PRODUCTS: "/products",
    SUPPORT: "/support",
    PROFILE: "/profile",
    WISHLIST: "/wishlist",
    CART: "/cart",
    CHECKOUT: "/checkout",
    ORDERS: "/orders",
    ADMIN: {
        ROOT: "/admin",
        PRODUCTS: "/admin/products",
        CATEGORIES: "/admin/categories",
        USERS: "/admin/users",
        ORDERS: "/admin/orders",
    },
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
    WISHLIST: "/wishlist",
    CART: "/cart",
    CHECKOUT: "/checkout",
    ORDERS: "/orders",
    CANCEL: "/cancel"
} as const;

export const PROTECTED_ROUTES = [
    ROUTES.WISHLIST,
    ROUTES.CART,
    ROUTES.CHECKOUT,
    ROUTES.ORDERS,
    ROUTES.PROFILE,
    ROUTES.ADMIN.ROOT,
] as const;

export const AUTH_ROUTES = [ROUTES.LOGIN, ROUTES.REGISTER] as const;
