import { Select, ThemeContext, SelectProps } from "@skbkontur/react-ui";
import { useContext, type ReactElement } from "react";

import { ObjectFieldFilterOperator } from "../../Domain/Api/DataTypes/ObjectFieldFilterOperator";

interface OperatorSelectProps {
    value: Nullable<ObjectFieldFilterOperator>;
    onChange: (x0: ObjectFieldFilterOperator) => void;
    availableValues: ObjectFieldFilterOperator[];
}

const operatorToString = (operation: ObjectFieldFilterOperator): string => {
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
};

export const OperatorSelect = ({ availableValues, onChange, value }: OperatorSelectProps): ReactElement => (
    <StyledSelect
        width={70}
        data-tid="OperatorSelect"
        items={availableValues.map(x => [x, operatorToString(x)] as [ObjectFieldFilterOperator, string])}
        onValueChange={nextValue => {
            if (nextValue !== null && nextValue !== undefined) {
                onChange(nextValue);
            }
        }}
        value={value || undefined}
    />
);

export const StyledSelect = <TValue = {}, TItem = {}>(props: SelectProps<TValue, TItem>): ReactElement => {
    const theme = useContext(ThemeContext);
    return (
        <Select<TValue, TItem>
            {...(props as any)}
            renderItem={(value: any, item: any) => <span style={{ color: theme.textColorDefault }}>{item}</span>}
        />
    );
};
