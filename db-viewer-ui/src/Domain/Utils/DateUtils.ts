import moment from "moment";

import { RussianDateFormat } from "../DataTypes/DateTimeRange";

export class DateUtils {
    private static readonly datePickerFormat: RussianDateFormat = "DD.MM.YYYY";

    public static isCorrectTime(time: string): boolean {
        return Boolean(time.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]/));
    }

    public static convertDateToString(
        date: Date | string,
        timeZone: number,
        format: string = this.datePickerFormat
    ): string {
        return moment.utc(date).utcOffset(timeZone).format(format);
    }

    public static convertStringToDate(date: RussianDateFormat): Date {
        return moment(date, this.datePickerFormat).toDate();
    }
}
