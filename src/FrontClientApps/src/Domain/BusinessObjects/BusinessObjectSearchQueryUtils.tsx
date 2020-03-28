import { BusinessObjectFieldFilterOperator } from "../Api/DataTypes/BusinessObjectFieldFilterOperator";
import { BusinessObjectFilterSortOrder } from "../Api/DataTypes/BusinessObjectFilterSortOrder";
import { Condition } from "../Api/DataTypes/Condition";
import { Sort } from "../Api/DataTypes/Sort";
import { PlainValueMapper, QueryObject } from "../QueryStringMapping/Mappers";

import { convertOperationToString, convertStringToOperation } from "./OperationsConverter";

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
                    operator: BusinessObjectFieldFilterOperator.Equals,
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

export class SortMapper extends PlainValueMapper<Sort> {
    public constructor(queryStringParameterName: string) {
        super(queryStringParameterName);
    }

    public parseString(parameterValue: string): Nullable<Sort> {
        if (parameterValue != null && parameterValue.trim() !== "") {
            const sortInfo = parameterValue.split(":");
            if (sortInfo[0].trim() === "") {
                return null;
            }
            return {
                path: sortInfo[0],
                sortOrder:
                    sortInfo[1] === "asc"
                        ? BusinessObjectFilterSortOrder.Ascending
                        : BusinessObjectFilterSortOrder.Descending,
            };
        }
        return null;
    }

    public stringifyValue(value: Nullable<Sort>): Nullable<string> {
        if (value == null) {
            return null;
        }
        if (value.path == null || value.path === "") {
            return null;
        }
        return `${value.path}:${value.sortOrder === BusinessObjectFilterSortOrder.Ascending ? "asc" : "desc"}`;
    }
}
