export interface BasePaginationSearchParams {
    page?: string;
    limit?: string;
}

type NormalizedPaginationParams<T extends BasePaginationSearchParams> = Omit<
    T,
    "page" | "limit"
> & {
    page: string;
    limit: string;
};

export function normalizePaginationParams<T extends BasePaginationSearchParams>(
    params: T,
    defaultLimit = "10",
) {
    const normalizedParams = new URLSearchParams();
    normalizedParams.set("page", params.page ?? "1");
    normalizedParams.set("limit", params.limit ?? defaultLimit);

    for (const [key, value] of Object.entries(params) as Array<
        [string, string | undefined]
    >) {
        if (!value || key === "page" || key === "limit") {
            continue;
        }

        normalizedParams.set(key, value);
    }

    const { page: _page, limit: _limit, ...rest } = params;
    const effectiveParams: NormalizedPaginationParams<T> = {
        ...rest,
        page: params.page ?? "1",
        limit: params.limit ?? defaultLimit,
    };

    return {
        needsRedirect: !params.page || !params.limit,
        queryString: `?${normalizedParams.toString()}`,
        effectiveParams,
    };
}
