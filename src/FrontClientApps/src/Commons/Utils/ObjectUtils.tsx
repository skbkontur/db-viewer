import * as _ from "lodash";

import { StringUtils } from "./StringUtils";

export class ObjectUtils {
    public static deleteRedundantWhitespaces(x: any): any {
        if (x != null && typeof x === "string") {
            return StringUtils.normalizeWhitespaces(x);
        }

        if (x == null || typeof x !== "object" || x instanceof Date) {
            return x;
        }

        if (Array.isArray(x)) {
            return x.map(ObjectUtils.deleteRedundantWhitespaces);
        }

        const obj = {};
        Object.keys(x).forEach(key => {
            obj[key] = ObjectUtils.deleteRedundantWhitespaces(x[key]);
        });

        return obj;
    }

    public static removeWhitespaceFields(oldObject: any): any {
        if (typeof oldObject === "string") {
            if (oldObject && !oldObject.replace(/\s/g, "")) {
                return null;
            }
        } else if (oldObject && Array.isArray(oldObject)) {
            return oldObject.map(x => ObjectUtils.removeWhitespaceFields(x));
        } else if (oldObject && oldObject instanceof Date) {
            return oldObject;
        } else if (oldObject && typeof oldObject === "object") {
            const newObject = {};
            Object.keys(oldObject).forEach(key => {
                newObject[key] = ObjectUtils.removeWhitespaceFields(oldObject[key]);
            });
            return newObject;
        }
        return oldObject;
    }

    public static notEmpty<TValue>(value: Nullable<TValue>): value is TValue {
        return value !== null && value !== undefined;
    }

    public static notNull<TValue>(value: Nullable<TValue>): TValue {
        if (value == null) {
            throw new Error("InvalidProgramStateException: value is null");
        }
        return value;
    }

    public static containsInAnyValueSubstring(x: Object, searchValue: string, options: SearchOptions): boolean {
        const value = options.ignoreCase ? searchValue.toUpperCase() : searchValue;
        return containsSubstring(x, value, options);
    }
}

const containsSubstring = (x: Object, searchValue: string, options: SearchOptions): boolean => {
    if (x == null) {
        return false;
    }

    if (typeof x === "string") {
        return options.ignoreCase ? x.toUpperCase().includes(searchValue) : x.includes(searchValue);
    }

    if (Array.isArray(x)) {
        return x.some(element => containsSubstring(element, searchValue, options));
    }

    const filteredKeys = Object.keys(x).filter(
        x => options.isExcludedFromSearchField == null || !options.isExcludedFromSearchField(x)
    );

    return filteredKeys.some(key => containsSubstring(x[key], searchValue, options));
};

export interface SearchOptions {
    isExcludedFromSearchField?: (fieldName: string) => boolean;
    ignoreCase: boolean;
}
