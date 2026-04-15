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
    const { page: _page, limit: _limit, ...rest } = params;
    const effectiveParams: NormalizedPaginationParams<T> = {
        ...rest,
        page: params.page ?? "1",
        limit: params.limit ?? defaultLimit,
    };

    return { effectiveParams };
}
