declare class StringUtils {
    public static isNullOrWhitespace(value: null | undefined | string): boolean;
    public static removeLeadingZeroes(value: null | undefined | string): null | undefined | string;
    public static trimStart(value: null | undefined | string, character: string): null | undefined | string;
    public static getHashCode(value: string): number;
}

export default StringUtils;
