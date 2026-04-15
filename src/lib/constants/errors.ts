export const ERRORS = {
    AUTH: {
        INVALID_CREDENTIALS: "Invalid email or password",
        EMAIL_ALREADY_EXISTS: "An account with this email already exists",
        LOGIN_REQUIRED: "Login required",
        LOGIN_REQUIRED_DESCRIPTION:
            "Please sign in to continue with this action.",
        GENERIC: "Something went wrong. Please try again.",
    },

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
        PRODUCT: {
            NAME_REQUIRED: "Name is required",
            IMAGE_REQUIRED: "Product image is required",
            PRICE_INVALID: 'Price must be a valid decimal like "29.99"',
            STOCK_INTEGER: "Stock quantity must be a whole number",
            STOCK_NON_NEGATIVE: "Stock quantity cannot be negative",
            CATEGORY_REQUIRED: "Category is required",
        },
        CATEGORY: {
            NAME_REQUIRED: "Category name is required",
        },
        ORDER: {
            STATUS_INVALID: "Select a valid order status",
        },
    },

    CART: {
        ADD_FAILED: "Failed to add item",
        UPDATE_FAILED: "Could not update quantity",
        REMOVE_FAILED: "Could not remove item",
        ORDER_CANCEL_FAILED: "Could not cancel order",
        LOGIN_REQUIRED_DESCRIPTION:
            "Please sign in to add items to your cart.",
        GENERIC: "Cart operation failed",
    },

    PROFILE: {
        UPDATE_FAILED: "Could not update profile",
        UPDATE_SUCCESS: "Profile updated",
        IMAGE_HELP:
            "Upload a profile image first, then save your account changes.",
    },

    UPLOAD: {
        FILE_REQUIRED: "Image file is required",
        UPLOAD_FAILED: "Image upload failed",
        DELETE_FAILED: "Failed to delete upload",
    },

    WISHLIST: {
        ADD_FAILED: "Could not save to wishlist",
        REMOVE_FAILED: "Could not remove from wishlist",
        ADDED: "Saved to wishlist",
        REMOVED: "Removed from wishlist",
        EMPTY: "Your wishlist is still empty.",
    },

    CHECKOUT: {
        SHIPPING_ADDRESS_INVALID: "Please enter a full shipping address",
        CITY_REQUIRED: "City is required",
        STATE_REQUIRED: "State is required",
        ZIP_CODE_INVALID: "Zip code is required",
        PHONE_INVALID: "Phone number is required",
    },

    ORDER: {
        PLACE_FAILED: "Failed to place order. Please try again.",
        CANCEL_FAILED: "Failed to cancel order. Please try again.",
        NOT_FOUND: "Order not found",
    },

    ADMIN: {
        PRODUCT_CREATE_FAILED: "Failed to create product",
        PRODUCT_UPDATE_FAILED: "Failed to update product",
        PRODUCT_DELETE_FAILED: "Failed to delete product",
        CATEGORY_CREATE_FAILED: "Failed to create category",
        CATEGORY_UPDATE_FAILED: "Failed to update category",
        CATEGORY_DELETE_FAILED: "Failed to delete category",
        ORDER_STATUS_UPDATE_FAILED: "Failed to update order status",
        USER_UPDATE_FAILED: "Failed to update user",
    },

    PAGES: {
        AUTH: "Something went wrong with authentication.",
        SHOP: "We couldn't load this page. The server might be down.",
        NO_PRODUCTS: "No products found. Try adjusting your filters.",
        GLOBAL: "An unexpected error occurred",
    },

    GENERIC: {
        SOMETHING_WRONG: "Something went wrong",
        UNEXPECTED: "An unexpected error occurred",
        TRY_AGAIN: "Please try again.",
        REQUEST_FAILED: "Request failed",
    },
} as const;
