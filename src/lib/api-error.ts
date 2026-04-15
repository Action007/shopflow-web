import { ERRORS } from "@/lib/constants/errors";

export interface ApiErrorLike {
    message?: string;
    statusCode?: number;
}

export function getApiErrorStatus(error: unknown): number | undefined {
    if (
        typeof error === "object" &&
        error !== null &&
        "statusCode" in error &&
        typeof error.statusCode === "number"
    ) {
        return error.statusCode;
    }

    return undefined;
}

export function isAuthzError(error: unknown): boolean {
    const status = getApiErrorStatus(error);
    return status === 401 || status === 403;
}

export function getApiErrorPresentation(error: unknown) {
    const status = getApiErrorStatus(error);

    if (status === 401) {
        return {
            title: ERRORS.API.SESSION_REQUIRED_TITLE,
            description: ERRORS.API.SESSION_REQUIRED_DESCRIPTION,
            retryable: false,
        };
    }

    if (status === 403) {
        return {
            title: ERRORS.API.ACCESS_RESTRICTED_TITLE,
            description: ERRORS.API.ACCESS_RESTRICTED_DESCRIPTION,
            retryable: false,
        };
    }

    return {
        title: ERRORS.GENERIC.SOMETHING_WRONG,
        description:
            (typeof error === "object" &&
                error !== null &&
                "message" in error &&
                typeof error.message === "string" &&
                error.message) ||
            ERRORS.API.REQUEST_INCOMPLETE,
        retryable: true,
    };
}
