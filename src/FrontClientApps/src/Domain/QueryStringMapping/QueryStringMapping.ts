import qs from "qs";

type QueryObject = any;

export type Parser<T> = (entity: T, parsedQueryString: QueryObject) => T;
export type Stringifier<T> = (entity: T, parsedQueryString: QueryObject) => QueryObject;

export class QueryStringMapping<T> {
    public parsers: Array<Parser<T>>;
    public stringifiers: Array<Stringifier<T>>;

    public constructor(parsers: Array<Parser<T>>, stringifiers: Array<Stringifier<T>>) {
        this.parsers = parsers;
        this.stringifiers = stringifiers;
    }

    public parse(queryString: Nullable<string>): T {
        const parsedQueryString = qs.parse((queryString || "").replace(/^\?/, ""));
        let result: T = {} as any;
        for (const parser of this.parsers) {
            result = parser(result, parsedQueryString);
        }
        return result;
    }

    public stringify(entity: T | null): string {
        if (entity === null) {
            return "";
        }
        let parsedQueryString = {};
        for (const stringifier of this.stringifiers) {
            parsedQueryString = stringifier(entity, parsedQueryString);
        }
        const result = qs.stringify(parsedQueryString, { format: "RFC1738" });
        if (result.length === 0) {
            return "";
        }
        return "?" + result;
    }
}
