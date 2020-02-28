import { BusinessObjectFieldFilterOperator } from "Domain/EDI/Api/AdminTools/DataTypes/BusinessObjectFieldFilterOperator";

export function convertOperationToString(operation: string): BusinessObjectFieldFilterOperator {
    switch (operation) {
        case ">=":
            return BusinessObjectFieldFilterOperator.GreaterThanOrEquals;
        case "<=":
            return BusinessObjectFieldFilterOperator.LessThanOrEquals;
        case "!=":
            return BusinessObjectFieldFilterOperator.DoesNotEqual;
        case ">":
            return BusinessObjectFieldFilterOperator.GreaterThan;
        case "<":
            return BusinessObjectFieldFilterOperator.LessThan;
        case "=":
            return BusinessObjectFieldFilterOperator.Equals;
        default:
            return BusinessObjectFieldFilterOperator.Equals;
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
