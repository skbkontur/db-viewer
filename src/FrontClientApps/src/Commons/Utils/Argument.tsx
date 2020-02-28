import { ArgumentNullOrUndefinedError } from "./Errors";

export class Argument {
    public static shouldBeNotNullOrUndefined<T>(value: T, argumentName: string) {
        if (value === null || value === undefined) {
            throw new ArgumentNullOrUndefinedError(argumentName);
        }
    }
}
