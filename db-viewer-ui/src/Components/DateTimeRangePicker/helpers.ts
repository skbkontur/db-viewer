import { DateUtils, RussianDateFormat, Time, TimeUtils, TimeZone } from "@skbkontur/edi-ui";

export const convertDateToStringWithTimezone = (date: Nullable<Date | string>, timeZone?: number) =>
    date ? DateUtils.formatDate(date, "dd.MM.yyyy", TimeUtils.getTimeZoneOffsetOrDefault(timeZone)) : "";

export const convertStringToDate = (
    newStringifiedDate: RussianDateFormat,
    defaultTime?: Time,
    timeZone?: TimeZone | number
): Date => {
    const dateParsed = DateUtils.parseDate(newStringifiedDate);
    const ISODate = DateUtils.formatDate(dateParsed, "yyyy-MM-dd");
    const time = defaultTime || "00:00";
    const timeZoneOffset = TimeUtils.getTimeZoneOffsetOrDefault(timeZone);
    return new Date(`${ISODate}T${time}${TimeUtils.timeZoneOffsetToString(timeZoneOffset)}`);
};

export const getTimeZoneString = (date: string): Nullable<string> => {
    const timezoneRegex = /.*T.*(Z|[+-].*)/i;
    const matches = date.match(timezoneRegex);
    if (!matches || matches.length < 2) {
        return null;
    }
    return matches[1];
};

export const buildDateTime = (
    date: Nullable<Date>,
    time: Nullable<Time>,
    offset: Nullable<string>,
    defaultTime?: Nullable<Time>
): Nullable<string> => {
    if (!date) {
        return null;
    }
    const datePart = DateUtils.formatDate(date, "yyyy-MM-dd", 0);
    return `${datePart}T${time ?? defaultTime}${offset ?? ""}`;
};

export const padTime = (input: string, useSeconds?: boolean): string => {
    const cleaned = input?.replace(/[:.]+$/, "");
    if (!cleaned) {
        return "";
    }
    const [h = "", m = "", rest = ""] = cleaned.split(":");
    const [s = "", ms = ""] = rest.split(".");

    const hours = h.padStart(2, "0");
    const minutes = m.padEnd(2, "0");
    const seconds = s.padEnd(2, "0");
    const milliseconds = ms.padEnd(3, "0");

    if (!useSeconds) {
        return `${hours}:${minutes}`;
    }

    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
};
