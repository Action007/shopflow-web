export const APP_CONFIG = {
    CART: {
        DEBOUNCE_DELAY_MS: 400,
        OPTIMISTIC_FEEDBACK_DURATION_MS: 2000,
    },

    SEARCH: {
        DEBOUNCE_DELAY_MS: 400,
    },

    UPLOAD: {
        MAX_IMAGE_SIZE_BYTES: 5 * 1024 * 1024,
        ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
    },

    UI: {
        TOAST_DURATION_MS: 3000,
    },

    ORDER_STATUS: {
        PENDING: "outline" as const,
        PROCESSING: "secondary" as const,
        SHIPPED: "default" as const,
        DELIVERED: "default" as const,
        CANCELLED: "destructive" as const,
    },
} as const;
