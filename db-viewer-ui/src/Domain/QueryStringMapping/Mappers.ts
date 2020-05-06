export type QueryObject = any;

export interface Mapper<T> {
    parse(parsedQueryString: QueryObject): Nullable<T>;
    stringify(parsedQueryString: QueryObject, value: Nullable<T>): QueryObject;
}

export class PlainValueMapper<T> implements Mapper<T> {
    public parameterName: string;

    public constructor(queryStringParameterName: string) {
        this.parameterName = queryStringParameterName;
    }

    public parseString(_parameterValue: string): Nullable<T> {
        throw new Error("Method should be implemented");
    }

    public stringifyValue(_value: Nullable<T>): Nullable<string> {
        throw new Error("Method should be implemented");
    }

    protected parseEmpty(): Nullable<T> {
        return null;
    }

    public parse(parsedQueryString: QueryObject): Nullable<T> {
        const value = parsedQueryString[this.parameterName];
        if (value === undefined) {
            return this.parseEmpty();
        }
        if (typeof value !== "string") {
            return null;
        }
        return this.parseString(value);
    }

    public stringify(parsedQueryString: QueryObject, value: Nullable<T>): QueryObject {
        const result = this.stringifyValue(value);
        if (result === undefined || result === null) {
            return parsedQueryString;
        }
        return {
            ...parsedQueryString,
            [this.parameterName]: this.stringifyValue(value),
        };
    }
}

export class IntegerMapper extends PlainValueMapper<number> {
    public defaultValue: null | number;

    public constructor(queryStringParameterName: string, defaultValue: Nullable<number>) {
        super(queryStringParameterName);
        if (defaultValue !== undefined) {
            this.defaultValue = defaultValue;
        } else {
            this.defaultValue = null;
        }
    }

    public parseString(parameterValue: string): Nullable<number> {
        const result = parseInt(parameterValue, 10);
        return isNaN(result) ? this.defaultValue : result;
    }

    protected parseEmpty(): Nullable<number> {
        return this.defaultValue;
    }

    public stringifyValue(value: Nullable<number>): any {
        if (value == null) {
            return null;
        }
        if (this.defaultValue != null && value === this.defaultValue) {
            return null;
        }
        return value.toString();
    }
}

export class StringArrayMapper extends PlainValueMapper<string[]> {
    public defaultValue: null | Nullable<string[]>;

    public constructor(queryStringParameterName: string, defaultValue: Nullable<string[]>) {
        super(queryStringParameterName);
        this.defaultValue = defaultValue || null;
    }

    protected parseEmpty(): Nullable<any[]> {
        return this.defaultValue;
    }

    public parseString(parameterValue: Nullable<string>): Nullable<string[]> {
        if (parameterValue == null || parameterValue === "") {
            return this.defaultValue;
        }
        const values = parameterValue.split(" ");
        return values;
    }

    public stringifyValue(value: null | undefined | string[]): Nullable<string> {
        if (value == null || value.length === 0) {
            return undefined;
        }
        const result = value.filter(x => x !== null).join(" ");
        return result.length === 0 ? undefined : result;
    }
}
