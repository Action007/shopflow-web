// Centralized error messages

export const ERRORS = {
    // Authentication errors
    AUTH: {
        INVALID_CREDENTIALS: "Invalid email or password",
        EMAIL_ALREADY_EXISTS: "An account with this email already exists",
        GENERIC: "Something went wrong. Please try again.",
    },

    // Validation errors - Email
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
    },
} as const;
