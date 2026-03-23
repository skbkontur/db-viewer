import { TimeUtils, StringUtils } from "@skbkontur/edi-ui";
import { ColumnStack, Fit, RowStack } from "@skbkontur/react-stack-layout";
import { Input } from "@skbkontur/react-ui";
import { tooltip, ValidationInfo, ValidationWrapper } from "@skbkontur/react-ui-validations";
import type { ReactElement } from "react";

import { Condition } from "../../Domain/Api/DataTypes/Condition";
import { ObjectFieldFilterOperator } from "../../Domain/Api/DataTypes/ObjectFieldFilterOperator";
import { PropertyMetaInformation } from "../../Domain/Api/DataTypes/PropertyMetaInformation";
import { validateObjectField } from "../../Domain/Utils/ValidationUtils";
import { DateTimePicker } from "../DateTimeRangePicker/DateTimePicker";
import { FormRow } from "../FormRow/FormRow";

import { OperatorSelect, StyledSelect } from "./OperatorSelect";

interface ObjectFilterProps {
    conditions: Condition[];
    onChange: (conditions: Condition[]) => void;
    tableColumns: PropertyMetaInformation[];
}

export const ObjectFilter = ({ conditions, onChange, tableColumns }: ObjectFilterProps): ReactElement => {
    const getCondition = (property: PropertyMetaInformation): Condition => {
        const result = conditions.find(x => x.path === property.name);
        if (result == null) {
            return {
                path: property.name,
                operator: ObjectFieldFilterOperator.Equals,
                value: null,
            };
        }
        return result;
    };

    const updateItem = (property: PropertyMetaInformation, conditionUpdate: Partial<Condition>) => {
        const conditionIndex = conditions.findIndex(x => x.path === property.name);
        if (conditionIndex >= 0) {
            onChange([
                ...conditions.slice(0, conditionIndex),
                { ...conditions[conditionIndex], ...conditionUpdate },
                ...conditions.slice(conditionIndex + 1),
            ]);
        } else {
            onChange([...conditions, { ...getCondition(property), ...conditionUpdate }]);
        }
    };

    const getValidation = (property: PropertyMetaInformation, value: Nullable<string>): ValidationInfo | null => {
        if (property.isRequired && StringUtils.isNullOrWhitespace(value)) {
            return { message: "Поле должно быть заполнено", type: "submit" };
        }
        return validateObjectField(value);
    };

    const renderProperty = (property: PropertyMetaInformation, value: Nullable<string>): ReactElement => {
        const type = property.type.typeName;
        if (type === "DateTime" || type === "DateTimeOffset") {
            return (
                <ColumnStack gap={2}>
                    <Fit>
                        <DateTimePicker
                            data-tid={"DateTimePicker"}
                            defaultTime={""}
                            error={false}
                            timeZone={TimeUtils.TimeZones.UTC}
                            onChange={date => updateItem(property, { value: TimeUtils.timestampToTicks(date) })}
                            value={value ? TimeUtils.ticksToTimestamp(value) : null}
                        />
                    </Fit>
                    <Fit>
                        <ValidationWrapper
                            data-tid="DateTimeValidation"
                            renderMessage={tooltip("right middle")}
                            validationInfo={getValidation(property, value)}>
                            <Input
                                mask="999999999999999999"
                                data-tid={"DateTimeInTicks"}
                                onValueChange={nextValue => updateItem(property, { value: nextValue })}
                                value={value ? value : ""}
                            />
                        </ValidationWrapper>
                    </Fit>
                </ColumnStack>
            );
        }
        if (type === "Boolean") {
            return (
                <ValidationWrapper
                    data-tid="BooleanValidation"
                    renderMessage={tooltip("right middle")}
                    validationInfo={getValidation(property, value)}>
                    <StyledSelect
                        data-tid="BooleanSelect"
                        items={[null, "true", "false"].map(x => [x, String(x)])}
                        onValueChange={(nextValue: any) => {
                            updateItem(property, { value: nextValue });
                        }}
                        value={value || undefined}
                    />
                </ValidationWrapper>
            );
        }
        if (property.availableValues.length !== 0) {
            return (
                <ValidationWrapper
                    data-tid="EnumValidation"
                    renderMessage={tooltip("right middle")}
                    validationInfo={getValidation(property, value)}>
                    <StyledSelect
                        data-tid="EnumSelect"
                        items={[null, ...property.availableValues].map(x => [x, String(x)])}
                        onValueChange={(nextValue: any) => {
                            updateItem(property, { value: nextValue });
                        }}
                        value={value || undefined}
                    />
                </ValidationWrapper>
            );
        }
        return (
            <ValidationWrapper
                data-tid="InputValidation"
                renderMessage={tooltip("right middle")}
                validationInfo={getValidation(property, value)}>
                <Input
                    data-tid="Input"
                    onValueChange={nextValue => updateItem(property, { value: nextValue })}
                    value={value || ""}
                />
            </ValidationWrapper>
        );
    };

    return (
        <ColumnStack gap={2} data-tid="ObjectFilters">
            {tableColumns
                .map(x => [x, getCondition(x)] as [PropertyMetaInformation, Condition])
                .map(([property, condition]) => (
                    <FormRow key={property.name} captionWidth={200} caption={property.name} data-tid="Filter">
                        <RowStack baseline block gap={5} data-tid={property.name}>
                            <Fit>
                                <OperatorSelect
                                    value={condition.operator}
                                    onChange={value => updateItem(property, { operator: value })}
                                    availableValues={property.availableFilters || [ObjectFieldFilterOperator.Equals]}
                                />
                            </Fit>
                            <Fit>{renderProperty(property, condition.value)}</Fit>
                        </RowStack>
                    </FormRow>
                ))}
        </ColumnStack>
    );
};
