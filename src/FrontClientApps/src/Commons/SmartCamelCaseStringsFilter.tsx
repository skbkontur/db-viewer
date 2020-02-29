import _ from "lodash";
import { StringUtils } from "Commons/Utils/StringUtils";

interface FilterResult {
    source: string;
    highlighted: any[];
}

function notNullIdentity<T>(value: Nullable<T>): T {
    if (value === null || value === undefined) {
        throw new Error("InvalidProgramState");
    }
    return value;
}

export function checkWordByCase(target: string, query: string): boolean {
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

export class SmartCamelCaseStringsFilter {
    public array: string[];
    public highlightFunc: (value: string) => any;

    public constructor(array: string[], highlightFunc: (value: string) => any) {
        this.array = array;
        this.highlightFunc = highlightFunc;
    }

    public filter(query: string): FilterResult[] {
        return _.uniqBy(
            ([] as FilterResult[]).concat(
                this.array.filter(x => x === query).map((x): FilterResult => ({
                    source: x,
                    highlighted: [this.highlightFunc(x)],
                })),
                this.array
                    .map(x => this.checkWordByCase1(x, query))
                    .filter(x => x != null)
                    .map(notNullIdentity),
                /^[a-z]+$/.test(query)
                    ? this.array
                          .map(x => this.checkWordByCase1(x, query.toUpperCase()))
                          .filter(x => x != null)
                          .map(notNullIdentity)
                    : []
            ),
            x => x.source
        );
    }

    public highlight(value: string): any {
        return this.highlightFunc(value);
    }

    public notHighlight(value: string): string {
        return value;
    }

    public checkWordByCase1(target: string, query: string): FilterResult | null {
        const queryStrings = query.match(/[A-Z,0-9]{1}[a-z]*/g);
        const targetStrings = target.match(/[A-Z,0-9]{1}[a-z]*/g);
        if (queryStrings && targetStrings) {
            let queryStringIndex = 0;
            const result: any[] = [];
            for (const targetString of targetStrings) {
                if (queryStringIndex < queryStrings.length && targetString.startsWith(queryStrings[queryStringIndex])) {
                    result.push(this.highlight(targetString.substring(0, queryStrings[queryStringIndex].length)));
                    if (targetString.substring(queryStrings[queryStringIndex].length).length > 0) {
                        result.push(this.notHighlight(targetString.substring(queryStrings[queryStringIndex].length)));
                    }
                    queryStringIndex++;
                } else {
                    result.push(this.notHighlight(targetString));
                }
            }
            if (queryStringIndex === queryStrings.length) {
                return { source: target, highlighted: result };
            }
        }
        return null;
    }
}
