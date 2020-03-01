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

    public static lowerFirstLetter(str?: string): string {
        if (str == null || str.length === 0) {
            return "";
        }
        return str.charAt(0).toLowerCase() + str.slice(1);
    }

    public static checkWordByCase(target: string, query: string): boolean {
        const queryStrings = StringUtils.capitalizeFirstLetter(query).match(/[A-Z,0-9]{1}[a-z]*/g);
        const targetStrings = target.match(/[A-Z,0-9]{1}[a-z]*/g);
        if (queryStrings && targetStrings) {
            let queryStringIndex = 0;
            for (const targetString of targetStrings) {
                if (queryStringIndex < queryStrings.length && targetString.startsWith(queryStrings[queryStringIndex])) {
                    queryStringIndex++;
                }
            }
            if (queryStringIndex === queryStrings.length) {
                return true;
            }
        }
        return false;
    }
}
