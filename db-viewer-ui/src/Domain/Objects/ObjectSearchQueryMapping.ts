import { StringUtils } from "@skbkontur/edi-ui";

import { Condition } from "../Api/DataTypes/Condition";
import { Sort } from "../Api/DataTypes/Sort";

import { ObjectSearchQuery } from "./ObjectSearchQuery";
import {
    convertOperationToString,
    convertSortToString,
    convertStringToOperation,
    convertStringToSort,
} from "./OperationsConverter";

interface SearchQueryStringified {
    conditions: string;
    sorts: string;
    count: string;
    offset: string;
    hiddenColumns?: string;
    shownColumns?: string;
}

export class ObjectSearchQueryMapping {
    public static normalize(query: ObjectSearchQuery, removeCounts: boolean): ObjectSearchQuery {
        return {
            ...query,
            count: removeCounts ? 0 : query.count,
            offset: removeCounts ? 0 : query.offset,
            hiddenColumns: [],
        };
    }

    public static parse(query: string, columns: string[]): ObjectSearchQuery {
        const url = new URLSearchParams(query);
        const conditions = url.get("conditions");
        const sorts = url.get("sorts");
        const count = url.get("count");
        const offset = url.get("offset");
        const hiddenColumns = url.get("hiddenColumns");
        const shownColumns = url.get("shownColumns");

        return {
            conditions: parseConditions(conditions, columns),
            sorts: parseSorts(sorts),
            count: count ? parseInt(count) : 20,
            offset: offset ? parseInt(offset) : 0,
            hiddenColumns: parseHiddenColumns(shownColumns, hiddenColumns, columns),
        };
    }

    public static stringify(query: ObjectSearchQuery, columns: string[]): string {
        let params: Partial<SearchQueryStringified> = {};
        if (query.conditions.length !== 0) {
            params.conditions = stringifyConditions(query.conditions);
        }
        if (query.sorts.length !== 0) {
            params.sorts = stringifySorts(query.sorts);
        }
        if (query.count !== 20) {
            params.count = query.count.toString();
        }
        if (query.offset !== 0) {
            params.offset = query.offset.toString();
        }
        if (query.hiddenColumns.length !== 0) {
            params = { ...params, ...stringifyHiddenColumns(query.hiddenColumns, columns) };
        }
        return `?${new URLSearchParams(params)}`;
    }
}

const outerSep = ";";
const innerSep = ":";

/*
 * note: Single condition has format path:operator:value;
 * complicated parse function to handle edge cases
 * eg. conditions = `Id:=:ab:cd:e;f;g;ScopeId:=:a;b`, columns = ["Id", "ScopeId"]
 * should return [
 *   { path: "Id", operator: Equals, value: "ab:cd:e;f;g" },
 *   { path: "ScopeId", operator: Equals, value: "a;b" },
 * ]
 */
function parseConditions(conditions: string | null, columns: string[]): Condition[] {
    if (StringUtils.isNullOrWhitespace(conditions)) {
        return [];
    }
    const result: Condition[] = [];
    let current = 0;
    let next = 0;
    while ((next = conditions.indexOf(outerSep, next + 1)) !== -1) {
        const nextPath = conditions.substring(next + 1, conditions.indexOf(innerSep, next + 1));
        if (columns.indexOf(nextPath) !== -1) {
            result.push(parseCondition(conditions, current, next));
            current = next + 1;
        }
    }
    if (current >= 0 && current < conditions.length) {
        result.push(parseCondition(conditions, current));
    }
    return result;
}

function parseCondition(conditions: string, start: number, end?: number): Condition {
    const sep1 = conditions.indexOf(innerSep, start);
    const sep2 = conditions.indexOf(innerSep, sep1 + 1);
    return {
        path: conditions.substring(start, sep1),
        operator: convertOperationToString(conditions.substring(sep1 + 1, sep2)),
        value: conditions.substring(sep2 + 1, end),
    };
}

function parseSorts(sorts: string | null): Sort[] {
    if (StringUtils.isNullOrWhitespace(sorts)) {
        return [];
    }
    return sorts.split(outerSep).map(s => {
        const [path, order] = s.split(innerSep);
        return {
            path: path,
            sortOrder: convertStringToSort(order),
        };
    });
}

function parseHiddenColumns(shownColumns: string | null, hiddenColumns: string | null, columns: string[]): string[] {
    if (shownColumns != null) {
        const cols = shownColumns.split(outerSep);
        return columns.filter(c => cols.indexOf(c) === -1);
    } else if (hiddenColumns != null) {
        return hiddenColumns.split(outerSep);
    }
    return [];
}

function stringifyConditions(conditions: Condition[]): string {
    return conditions.map(c => [c.path, convertStringToOperation(c.operator), c.value].join(innerSep)).join(outerSep);
}

function stringifySorts(sorts: Sort[]): string {
    return sorts.map(s => [s.path, convertSortToString(s.sortOrder)].join(innerSep)).join(outerSep);
}

function stringifyHiddenColumns(hiddenColumns: string[], columns: string[]): Partial<SearchQueryStringified> {
    const result: Partial<SearchQueryStringified> = {};
    if (hiddenColumns.length >= columns.length - hiddenColumns.length) {
        result.shownColumns = columns.filter(c => hiddenColumns.indexOf(c) === -1).join(outerSep);
    } else {
        result.hiddenColumns = hiddenColumns.join(outerSep);
    }
    return result;
}
