export function createPages(
    totalPageCount: number,
    currentPage: number,
    limit: null | number = null
): Array<Nullable<number>> {
    let totalCount = totalPageCount;
    if (limit != null) {
        totalCount = Math.max(Math.min(limit, totalPageCount), currentPage);
    }
    const visibleNumberFromCurrentAndBounds = 2;
    const result: Array<Nullable<number>> = [];
    let begin = currentPage - visibleNumberFromCurrentAndBounds;
    let end = currentPage + visibleNumberFromCurrentAndBounds;

    for (let i = 1; i <= visibleNumberFromCurrentAndBounds && i < begin; i++) {
        result.push(i);
    }
    if (begin > 3) {
        result.push(null);
    }
    const endList =
        totalCount - visibleNumberFromCurrentAndBounds + 1 > end
            ? totalCount - visibleNumberFromCurrentAndBounds + 1
            : end + 1;
    if (begin <= 0) {
        begin = 1;
    }
    if (end >= totalCount) {
        end = totalCount;
    }
    for (let i = begin; i <= end; i++) {
        result.push(i);
    }

    if (end < totalCount - visibleNumberFromCurrentAndBounds) {
        result.push(null);
    }

    if (limit == null || totalPageCount < limit) {
        for (let i = endList; i <= totalCount; i++) {
            result.push(i);
        }
    }
    return result;
}
