import Select from "@skbkontur/react-ui/Select";
import * as React from "react";

import { ObjectFieldFilterOperator } from "../../Domain/Api/DataTypes/ObjectFieldFilterOperator";

interface OperatorSelectProps {
    value: Nullable<ObjectFieldFilterOperator>;
    onChange: (x0: ObjectFieldFilterOperator) => void;
    availableValues: ObjectFieldFilterOperator[];
}

function operatorToString(operation: ObjectFieldFilterOperator): string {
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
            items={availableValues.map(x => [x, operatorToString(x)] as [ObjectFieldFilterOperator, string])}
            onChange={(e: any, nextValue: any) => {
                if (nextValue != null) {
                    onChange(nextValue);
                }
            }}
            value={value || undefined}
        />
    );
}
