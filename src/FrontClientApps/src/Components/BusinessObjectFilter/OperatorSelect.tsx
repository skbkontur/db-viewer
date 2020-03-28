import Select from "@skbkontur/react-ui/Select";
import React from "react";

import { BusinessObjectFieldFilterOperator } from "../../Domain/Api/DataTypes/BusinessObjectFieldFilterOperator";

interface OperatorSelectProps {
    value: Nullable<BusinessObjectFieldFilterOperator>;
    onChange: (x0: BusinessObjectFieldFilterOperator) => void;
    availableValues: BusinessObjectFieldFilterOperator[];
}

function operatorToString(operation: BusinessObjectFieldFilterOperator): string {
    const filterOperators = {
        GreaterThanOrEquals: ">=",
        LessThanOrEquals: "<=",
        DoesNotEqual: "!=",
        GreaterThan: ">",
        LessThan: "<",
        Equals: "=",
    };
    const result = filterOperators[operation];
    if (result != null) {
        return result;
    }
    return "=";
}

export function OperatorSelect(props: OperatorSelectProps): JSX.Element {
    const { availableValues, value, onChange } = props;
    return (
        <Select
            width={70}
            data-tid="OperatorSelect"
            items={availableValues.map(x => [x, operatorToString(x)] as [BusinessObjectFieldFilterOperator, string])}
            onChange={(e: any, nextValue: any) => {
                if (nextValue != null) {
                    onChange(nextValue);
                }
            }}
            value={value || undefined}
        />
    );
}
