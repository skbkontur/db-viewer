export class DateTimeUtils {
  public static getDatePart(dateTime: string): string {
    const localDateTime = DateTimeUtils.toLocalDateTime(dateTime);
    return localDateTime ? localDateTime.split(" ")[0] : localDateTime;
  }
  public static getDatePartUtc(dateTime: string): string {
    return dateTime.split("T")[0];
  }
  public static getTimePart(dateTime: string): string {
    const localDateTime = DateTimeUtils.toLocalDateTime(dateTime);
    return localDateTime ? localDateTime.split(" ")[1] : localDateTime;
  }
  public static toLocalDateTime(value: string) {
    if (DateTimeUtils.isUtcDateTime(value)) {
      return DateTimeUtils.getLocalDateTimeFromUtc(value);
    }
    return value;
  }
  public static updateDate(oldDateTime: string, newDate: string): string {
    const oldTime = DateTimeUtils.getTimePart(oldDateTime);
    if (oldTime != null) {
      return DateTimeUtils.isUtcDateTime(oldDateTime)
        ? `${DateTimeUtils.getUtcDate(newDate)}T${DateTimeUtils.getUtcTime(oldTime)}Z`
        : `${newDate} ${oldTime}`;
    }
    return DateTimeUtils.isUtcDateTime(oldDateTime)
      ? DateTimeUtils.getUtcDate(newDate)
      : newDate;
  }
  public static updateTime(oldDateTime: string, time: string): string {
    if (!oldDateTime || !time) {
      return oldDateTime;
    }
    return DateTimeUtils.isUtcDateTime(oldDateTime)
      ? `${DateTimeUtils.getDatePartUtc(oldDateTime)}T${DateTimeUtils.getUtcTime(time)}Z`
      : `${DateTimeUtils.getDatePart(oldDateTime)} ${time}`;
  }
  private static isUtcDateTime(value: string): boolean {
    return value && value.indexOf("T") !== -1;
  }
  private static getLocalDateTimeFromUtc(value: string): string {
    const parts = value.split("T");
    const date = parts[0];
    const time = parts[1].indexOf("Z") !== -1
      ? parts[1].substring(0, parts[1].length - 1)
      : parts[1];
    const dateParts = date.split("-");
    return `${dateParts[2]}.${dateParts[1]}.${dateParts[0]} ${time}.000`;
  }
  private static getUtcDate(date: string) {
    const parts = date.split(".");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  private static getUtcTime(time: string): string {
    return time.indexOf(".") !== -1
      ? `${time.substring(0, time.indexOf("."))}.000`
      : `${time}.000`;
  }
}
