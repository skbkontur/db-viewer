import { ApplicationError } from "Commons/Errors";

export class ArgumentError extends ApplicationError {
    public argumentName: string;

    public constructor(message: string, argumentName: string) {
        super(message);
        this.argumentName = argumentName;
    }
}

export class ArgumentNullOrUndefinedError extends ArgumentError {
    public constructor(argumentName: string) {
        super(`Argument is null or undefined ${argumentName}`, argumentName);
    }
}
