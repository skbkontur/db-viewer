export function timestampToTicks(timeStr: Nullable<string> | Nullable<Date>): Nullable<string> {
    if (!timeStr) {
        return null;
    }
    const offset = BigInt("621355968000000000");
    let end = 0;
    let commonTime;
    if (typeof timeStr === "string") {
        commonTime = BigInt(new Date(timeStr).getTime());
        const timeFractionalPartMatch = /\.(\d+)[^\d]$/.exec(timeStr);
        if (timeFractionalPartMatch) {
            end = ((Number("0." + timeFractionalPartMatch[1]) * 1000) % 1) * 10000;
        }
    } else {
        commonTime = BigInt(timeStr.getTime());
    }
    return (commonTime * BigInt(10000) + offset + BigInt(end)).toString();
}

export function ticksToTimestamp(timeStr: Nullable<string>): Nullable<Date> {
    if (!timeStr) {
        return null;
    }
    const offset = BigInt("621355968000000000");
    const commonTime = BigInt(timeStr);
    return new Date(Number((commonTime - offset) / BigInt(10000)));
}
