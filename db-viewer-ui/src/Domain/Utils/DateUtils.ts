import { addMinutes, format, parse } from "date-fns";

import { RussianDateFormat } from "../DataTypes/DateTimeRange";

export class DateUtils {
    private static readonly datePickerFormat: RussianDateFormat = "dd.MM.yyyy";

    public static isCorrectTime(time: string): boolean {
        return Boolean(time.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]/));
    }

    public static convertDateToString(
        date: Date | string,
        timeZone: number | null,
        dateFormat: string = this.datePickerFormat
    ): string {
        return format(timeZone == null ? new Date(date) : this.toTimeZone(new Date(date), timeZone), dateFormat);
    }

    public static convertStringToDate(date: RussianDateFormat): Date {
        return parse(date, this.datePickerFormat, new Date());
    }

    private static toTimeZone(date: Date | string, timeZoneOffsetInMinutes: number): Date {
        const dateDate = new Date(date);
        return addMinutes(dateDate, dateDate.getTimezoneOffset() + timeZoneOffsetInMinutes);
    }
}
