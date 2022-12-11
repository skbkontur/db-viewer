import { Select, ThemeContext, SelectProps } from "@skbkontur/react-ui";
import React from "react";

import { ObjectFieldFilterOperator } from "../../Domain/Api/DataTypes/ObjectFieldFilterOperator";

interface OperatorSelectProps {
    value: Nullable<ObjectFieldFilterOperator>;
    onChange: (x0: ObjectFieldFilterOperator) => void;
    availableValues: ObjectFieldFilterOperator[];
    disabled: boolean;
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
    const { availableValues, value, onChange, disabled } = props;
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
            disabled={disabled}
        />
    );
}

export function StyledSelect<TValue = {}, TItem = {}>(props: SelectProps<TValue, TItem>): JSX.Element {
    const theme = React.useContext(ThemeContext);
    return (
        <Select<TValue, TItem>
            {...(props as any)}
            renderItem={(value: any, item: any) => <span style={{ color: theme.textColorDefault }}>{item}</span>}
        />
    );
}
