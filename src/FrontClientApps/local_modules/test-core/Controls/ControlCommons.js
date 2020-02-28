export function applyDataTidSelector(selector: string): string {
    return selector.replace(/##([\w\d\-]+)/gi, (_, tid: string) => "[data-tid~='" + tid + "']");
}
