export class StringUtils {
    public static isNullOrWhitespace(value: Nullable<string>): value is null | undefined | "" {
        return value === null || value === undefined || value.trim() === "";
    }

    public static capitalizeFirstLetter(str?: string): string {
        if (str == null || str.length === 0) {
            return "";
        }
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}
