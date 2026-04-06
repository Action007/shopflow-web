// Centralized error messages

export const ERRORS = {
    // Authentication errors
    AUTH: {
        INVALID_CREDENTIALS: "Invalid email or password",
        EMAIL_ALREADY_EXISTS: "An account with this email already exists",
        GENERIC: "Something went wrong. Please try again.",
    },

    // Validation errors
    VALIDATION: {
        EMAIL: {
            INVALID: "Invalid email address",
        },
        PASSWORD: {
            MIN_6: "Password must be at least 6 characters",
            MIN_8: "Password must be at least 8 characters",
            MISMATCH: "Passwords do not match",
        },
        FIRST_NAME: {
            REQUIRED: "First name is required",
        },
        LAST_NAME: {
            REQUIRED: "Last name is required",
        },
    },

    // Cart errors
    CART: {
        ADD_FAILED: "Failed to add item",
        UPDATE_FAILED: "Could not update quantity",
        REMOVE_FAILED: "Could not remove item",
        GENERIC: "Cart operation failed",
    },

    // Checkout errors
    CHECKOUT: {
        SHIPPING_ADDRESS_INVALID: "Please enter a full shipping address",
        CITY_REQUIRED: "City is required",
        STATE_REQUIRED: "State is required",
        ZIP_CODE_INVALID: "Zip code is required",
        PHONE_INVALID: "Phone number is required",
    },

    // Order errors
    ORDER: {
        PLACE_FAILED: "Failed to place order. Please try again.",
        NOT_FOUND: "Order not found",
    },

    // Page-level errors
    PAGES: {
        AUTH: "Something went wrong with authentication.",
        SHOP: "We couldn't load this page. The server might be down.",
        GLOBAL: "An unexpected error occurred",
    },

    // Generic errors
    GENERIC: {
        SOMETHING_WRONG: "Something went wrong",
        UNEXPECTED: "An unexpected error occurred",
        TRY_AGAIN: "Please try again.",
    },
} as const;
