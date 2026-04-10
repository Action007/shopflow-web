export const COOKIE_NAMES = {
    ACCESS_TOKEN: "access_token",
    REFRESH_TOKEN: "refresh_token",
} as const;

export const COOKIE_CONFIG = {
    HTTPONLY: true,
    SECURE: process.env.NODE_ENV === "production",
    SAME_SITE: "lax" as const,
    PATH_ROOT: "/",
    PATH_AUTH: "/",
} as const;

export const TOKEN_EXPIRY = {
    ACCESS_TOKEN: 60 * 15,
    REFRESH_TOKEN: 60 * 60 * 24 * 7,
} as const;

export const HEADER_NAMES = {
    AUTHORIZATION: "Authorization",
    CONTENT_TYPE: "Content-Type",
} as const;

export const ENV_VARS = {
    API_URL: process.env.API_URL,
    NODE_ENV: process.env.NODE_ENV,
} as const;
