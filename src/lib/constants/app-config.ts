// Timing, debounce, animation durations, and other app-wide settings

export const APP_CONFIG = {
    // Cart operations
    CART: {
        DEBOUNCE_DELAY_MS: 400, // Delay before sending quantity update to API
        OPTIMISTIC_FEEDBACK_DURATION_MS: 2000, // How long to show "Added!" state
    },

    // UI animations/transitions
    UI: {
        TOAST_DURATION_MS: 3000, // Default toast notification duration
    },
} as const;
