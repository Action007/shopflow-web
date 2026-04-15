export const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    PRODUCTS: "/products",
    PRODUCT_DETAIL: (id: string) => `/products/${id}`,
    SUPPORT: "/support",
    PROFILE: "/profile",
    WISHLIST: "/wishlist",
    CART: "/cart",
    CHECKOUT: "/checkout",
    ORDERS: "/orders",
    ORDER_DETAIL: (id: string) => `/orders/${id}`,
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
    CATEGORIES: {
        LIST: "/categories",
        DETAIL: (id: string) => `/categories/${id}`,
    },
    USER: {
        LIST: "/users",
        ME: "/users/me",
        DETAIL: (id: string) => `/users/${id}`,
    },
    UPLOADS: {
        IMAGES: "/uploads/images",
        DETAIL: (id: string) => `/uploads/${id}`,
    },
    WISHLIST: "/wishlist",
    CART: {
        ROOT: "/cart",
        ITEM: (productId: string) => `/cart/${productId}`,
    },
    CHECKOUT: "/checkout",
    ORDERS: {
        LIST: "/orders",
        DETAIL: (id: string) => `/orders/${id}`,
        CANCEL: (id: string) => `/orders/${id}/cancel`,
        STATUS: (id: string) => `/orders/${id}/status`,
    },
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
