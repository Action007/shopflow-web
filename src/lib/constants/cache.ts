export const CACHE_CONFIG = {
    CATALOG_REVALIDATE_SECONDS: 300,
    STATIC_PRODUCT_PARAMS_LIMIT: 50,
} as const;

export const CACHE_TAGS = {
    PRODUCTS: "products",
    CATEGORIES: "categories",
    ORDERS: "orders",
    CART: "cart",
    USERS: "users",
} as const;

export const getProductTag = (productId: string) => `product-${productId}`;
