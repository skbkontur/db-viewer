import { Select, ThemeContext, SelectProps } from "@skbkontur/react-ui";
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

export function OperatorSelect(props: OperatorSelectProps): React.ReactElement {
    const { availableValues, value, onChange } = props;
    return (
        <StyledSelect
            width={70}
            data-tid="OperatorSelect"
            items={availableValues.map(x => [x, operatorToString(x)] as [ObjectFieldFilterOperator, string])}
            onValueChange={(nextValue: any) => {
                if (nextValue != null) {
                    onChange(nextValue);
                }
            }}
            value={value || undefined}
        />
    );
}

export function StyledSelect<TValue = {}, TItem = {}>(props: SelectProps<TValue, TItem>): React.ReactElement {
    const theme = React.useContext(ThemeContext);
    return (
        <Select<TValue, TItem>
            {...(props as any)}
            renderItem={(value: any, item: any) => <span style={{ color: theme.textColorDefault }}>{item}</span>}
        />
    );
}
