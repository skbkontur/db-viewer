export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export function isNotNullOrUndefined<T extends Object>(input: null | undefined | T): input is T {
    return input != null;
}

// Wokraround for
// https://github.com/Microsoft/TypeScript/issues/10727
// https://github.com/Microsoft/TypeScript/pull/13288
export function spread<T extends Object>(fullValue: T, values: Partial<T>): T {
    // @ts-ignore
    return { ...fullValue, ...values };
}
