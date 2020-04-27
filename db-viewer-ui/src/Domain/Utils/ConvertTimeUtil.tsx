import Decimal from "decimal.js";

export function timestampToTicks(timeStr: Nullable<string> | Nullable<Date>): Nullable<string> {
    if (!timeStr) {
        return null;
    }
    const offset = new Decimal("621355968000000000");
    let end = 0;
    let commonTime;
    if (typeof timeStr === "string") {
        commonTime = new Decimal(new Date(timeStr).getTime());
        const timeFractionalPartMatch = /\.(\d+)[^\d]$/.exec(timeStr);
        if (timeFractionalPartMatch) {
            end = ((Number("0." + timeFractionalPartMatch[1]) * 1000) % 1) * 10000;
        }
    } else {
        commonTime = new Decimal(timeStr.getTime());
    }
    return commonTime.mul(10000).plus(offset).plus(end).toString();
}

export function ticksToTimestamp(timeStr: Nullable<string>): Nullable<Date> {
    if (!timeStr) {
        return null;
    }
    const offset = new Decimal("621355968000000000");
    const commonTime = new Decimal(timeStr);
    return new Date(commonTime.minus(offset).div(10000).toNumber());
}
