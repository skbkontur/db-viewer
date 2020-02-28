import * as moment from "moment";
import { DateTimeRange, RussianDateFormat } from "Domain/EDI/DataTypes/DateTimeRange";

export class DateUtils {
    private static readonly datePickerFormat: RussianDateFormat = "DD.MM.YYYY";
    public static isSameDatesUtc(oldDate: Nullable<Date>, newDate: Nullable<Date>): boolean {
        const oldValue = oldDate ? moment(oldDate).utc() : null;
        const newValue = newDate ? moment(newDate).utc() : null;
        return (oldValue && newValue && oldValue.isSame(newValue, "day")) || oldValue === newValue;
    }

    public static isValidDate(date: Nullable<string | Date>, format?: moment.MomentFormatSpecification): date is Date {
        // explicitly check for undefined, otherwise moment().isValid() would return true,
        // because `moment(undefined)` returns current date
        if (date === null || date === undefined) {
            return false;
        }

        if (!moment(date, format).isValid()) {
            return false;
        }

        return true;
    }

    public static isCorrectTimeRange(timeRange: DateTimeRange): boolean {
        const start = timeRange.lowerBound ? moment(timeRange.lowerBound) : null;
        const end = timeRange.upperBound ? moment(timeRange.upperBound) : null;
        if (start && end) {
            return start.isBefore(end);
        }
        return true;
    }

    public static isCorrectDate(date: string): boolean {
        return moment(date).isValid();
    }

    public static isCorrectTime(time: string): boolean {
        return Boolean(time.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]/));
    }

    public static isSameDates(oldDate: Nullable<Date>, newDate: Nullable<Date>): boolean {
        const oldValue = oldDate ? moment(oldDate) : null;
        const newValue = newDate ? moment(newDate) : null;
        return (oldValue && newValue && oldValue.isSame(newValue, "day")) || oldValue === newValue;
    }
    public static isSameDateWithTime(oldDate: Nullable<Date>, newDate: Nullable<Date>): boolean {
        const oldValue = oldDate ? moment(oldDate) : null;
        const newValue = newDate ? moment(newDate) : null;
        return (oldValue && newValue && oldValue.isSame(newValue, "minute")) || oldValue === newValue;
    }

    public static isLessThan(firstDate: Date, secondDate: Date) {
        return firstDate < secondDate && !this.isSameDates(firstDate, secondDate);
    }

    public static convertDateToString(
        date: Date | string,
        timeZone: number,
        format: string = this.datePickerFormat
    ): string {
        return moment
            .utc(date)
            .utcOffset(timeZone)
            .format(format);
    }

    public static convertStringToDate(date: RussianDateFormat): Date {
        return moment(date, this.datePickerFormat).toDate();
    }
}
