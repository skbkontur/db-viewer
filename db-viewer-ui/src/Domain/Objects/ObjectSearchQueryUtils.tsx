import { Condition } from "../Api/DataTypes/Condition";
import { ObjectFieldFilterOperator } from "../Api/DataTypes/ObjectFieldFilterOperator";
import { ObjectFilterSortOrder } from "../Api/DataTypes/ObjectFilterSortOrder";
import { Sort } from "../Api/DataTypes/Sort";
import { PlainValueMapper, QueryObject } from "../QueryStringMapping/Mappers";

import { ObjectSearchQuery } from "./ObjectSearchQuery";
import { convertOperationToString, convertStringToOperation } from "./OperationsConverter";

export class ObjectSearchQueryUtils {
    public static normalize(query: ObjectSearchQuery, removeCounts: boolean): ObjectSearchQuery {
        return {
            ...query,
            count: removeCounts ? 0 : query.count,
            offset: removeCounts ? 0 : query.offset,
            hiddenColumns: [],
        };
    }
}

export class ConditionsMapper {
    public keysToSkip: string[];

    public constructor(keysToSkip: string[]) {
        this.keysToSkip = keysToSkip;
    }

    public parse(parsedQueryString: QueryObject): Nullable<Condition[]> {
        const paths = Object.keys(parsedQueryString).filter(x => !this.keysToSkip.includes(x));
        if (paths.length === 0) {
            return null;
        }
        const arrOfOpeators = ["<=", ">=", "!=", ">", "<", "="];
        return paths.map(
            (key: string): Condition => {
                const path: string = parsedQueryString[key] || "";
                const operator: string = arrOfOpeators.filter(val => path.includes(val))[0];
                if (operator !== undefined) {
                    const value: string = path.split(operator)[1];
                    return {
                        path: key,
                        value: value,
                        operator: convertOperationToString(operator),
                    };
                }
                return {
                    path: key,
                    value: parsedQueryString[key],
                    operator: ObjectFieldFilterOperator.Equals,
                };
            }
        );
    }

    public stringify(parsedQueryString: QueryObject, arrOfCondition: null | undefined | Condition[]): QueryObject {
        if (arrOfCondition == null) {
            return parsedQueryString;
        }
        let result = parsedQueryString;
        arrOfCondition.map(item => {
            const { path, operator, value } = item;
            if (value != null && path != null) {
                result = { ...result, [path]: `${convertStringToOperation(operator)}${value}` };
            }
        });
        return result;
    }
}

export class SortMapper extends PlainValueMapper<Sort[]> {
    public constructor(queryStringParameterName: string) {
        super(queryStringParameterName);
    }

    public parseString(parameterValue: string): Sort[] {
        if (parameterValue == null || parameterValue.trim() === "") {
            return [];
        }

        const sorts = parameterValue.split(",");
        return sorts.map(x => {
            const sortInfo = x.split(":");
            return {
                path: sortInfo[0],
                sortOrder: sortInfo[1] === "asc" ? ObjectFilterSortOrder.Ascending : ObjectFilterSortOrder.Descending,
            };
        });
    }

    public stringifyValue(value: Sort[]): Nullable<string> {
        if (value.length === 0) {
            return null;
        }

        return value
            .filter(x => x.path != null && x.path !== "")
            .map(x => `${x.path}:${x.sortOrder === ObjectFilterSortOrder.Ascending ? "asc" : "desc"}`)
            .join(",");
    }
}
