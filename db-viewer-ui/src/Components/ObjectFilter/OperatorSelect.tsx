import { Select, ThemeContext } from "@skbkontur/react-ui";
import React from "react";

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
    const theme = React.useContext(ThemeContext);
    return (
        <Select
            width={70}
            data-tid="OperatorSelect"
            items={availableValues.map(x => [x, operatorToString(x)] as [ObjectFieldFilterOperator, string])}
            onValueChange={(nextValue: any) => {
                if (nextValue != null) {
                    onChange(nextValue);
                }
            }}
            value={value || undefined}
            renderItem={(value: any, item: any) => <span style={{ color: theme.textColorDefault }}>{item}</span>}
        />
    );
}
