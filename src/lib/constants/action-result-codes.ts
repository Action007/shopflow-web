export const ACTION_RESULT_CODES = {
    UNAUTHORIZED: "UNAUTHORIZED",
    API_ERROR: "API_ERROR",
    UNKNOWN: "UNKNOWN",
} as const;

export type ActionResultCode =
    (typeof ACTION_RESULT_CODES)[keyof typeof ACTION_RESULT_CODES];
