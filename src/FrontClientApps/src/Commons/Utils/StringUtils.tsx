import { Argument } from "./Argument";
import { ArgumentError } from "./Errors";

export class StringUtils {
    public static isNullOrWhitespace(value: Nullable<string>): value is null | undefined | "" {
        return value === null || value === undefined || value.trim() === "";
    }

    public static removeLeadingZeroes(value: Nullable<string>): Nullable<string> {
        return StringUtils.trimStart(value, "0");
    }

    public static trimStart(value: Nullable<string>, character: string): Nullable<string> {
        Argument.shouldBeNotNullOrUndefined(character, "character");
        if (character.length !== 1) {
            throw new ArgumentError("character length must be equal 1", "character");
        }
        if (value === null || value === undefined) {
            return value;
        }
        let startIndex = 0;
        while (value[startIndex] === character) {
            startIndex++;
        }
        return value.substr(startIndex);
    }

    public static normalizeWhitespaces(value: Nullable<string>): Nullable<string> {
        if (value == null) {
            return value;
        }

        return value.trim().replace(/\s+/g, " ");
    }

    // Используется для оптимизации
    // tslint:disable no-bitwise
    public static getHashCode(value: string): number {
        let result = 0;

        if (value.length === 0) {
            return result;
        }
        for (let i = 0; i < value.length; i++) {
            const chr = value.charCodeAt(i);
            result = (result << 5) - result + chr;
            result |= 0;
        }
        return result;
    }
    // tslint:enable no-bitwise
}
