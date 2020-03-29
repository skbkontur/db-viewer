import { ObjectFieldFilterOperator } from "../Api/DataTypes/ObjectFieldFilterOperator";

export function convertOperationToString(operation: string): ObjectFieldFilterOperator {
    switch (operation) {
        case ">=":
            return ObjectFieldFilterOperator.GreaterThanOrEquals;
        case "<=":
            return ObjectFieldFilterOperator.LessThanOrEquals;
        case "!=":
            return ObjectFieldFilterOperator.DoesNotEqual;
        case ">":
            return ObjectFieldFilterOperator.GreaterThan;
        case "<":
            return ObjectFieldFilterOperator.LessThan;
        case "=":
            return ObjectFieldFilterOperator.Equals;
        default:
            return ObjectFieldFilterOperator.Equals;
    }
}

export function convertStringToOperation(operation: string): string {
    switch (operation) {
        case "GreaterThanOrEquals":
            return ">=";
        case "LessThanOrEquals":
            return "<=";
        case "DoesNotEqual":
            return "!=";
        case "GreaterThan":
            return ">";
        case "LessThan":
            return "<";
        case "Equals":
            return "=";
        default:
            return "=";
    }
}
