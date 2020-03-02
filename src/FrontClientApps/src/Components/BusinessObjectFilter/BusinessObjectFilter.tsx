import { ColumnStack, Fit, RowStack } from "@skbkontur/react-stack-layout";
import { tooltip, ValidationWrapperV1 } from "@skbkontur/react-ui-validations";
import Checkbox from "@skbkontur/react-ui/Checkbox";
import Input from "@skbkontur/react-ui/Input";
import * as React from "react";
import { BusinessObjectFieldFilterOperator } from "Domain/Api/DataTypes/BusinessObjectFieldFilterOperator";
import { Condition } from "Domain/Api/DataTypes/Condition";
import { Property } from "Domain/BusinessObjects/Property";
import { ticksToTimestamp, timestampToTicks } from "Domain/Utils/ConvertTimeUtil";
import { TimeUtils } from "Domain/Utils/TimeUtils";
import { validateBusinessObjectField } from "Domain/Utils/ValidationUtils";

import { DateTimePicker } from "../DateTimeRangePicker/DateTimePicker";
import { FormRow } from "../FormRow/FormRow";

import { OperatorSelect } from "./OperatorSelect";

interface BusinessObjectFilterProps {
    conditions: Condition[];
    onChange: (conditions: Condition[]) => void;
    tableColumns: Property[];
}

export class BusinessObjectFilter extends React.Component<BusinessObjectFilterProps> {
    public getCondition(property: Property): Condition {
        const { conditions } = this.props;
        const result = conditions.find(x => x.path === property.name);
        if (result == null) {
            return {
                path: property.name,
                operator: BusinessObjectFieldFilterOperator.Equals,
                value: null,
            };
        }
        return result;
    }

    public updateItem(property: Property, conditionUpdate: Partial<Condition>) {
        const { conditions, onChange } = this.props;
        const conditionIndex = conditions.findIndex(x => x.path === property.name);
        if (conditionIndex >= 0) {
            onChange([
                ...conditions.slice(0, conditionIndex),
                { ...conditions[conditionIndex], ...conditionUpdate },
                ...conditions.slice(conditionIndex + 1),
            ]);
        } else {
            onChange([...conditions, { ...this.getCondition(property), ...conditionUpdate }]);
        }
    }

    public isTypeComparable(type: Nullable<string>): boolean {
        if (type == null) {
            return false;
        }
        const comparableTypes = ["DateTime", "Decimal"];
        return comparableTypes.indexOf(type) !== -1;
    }

    public renderProperty(property: Property, value: Nullable<string>): JSX.Element {
        if (property.type === "DateTime") {
            return (
                <ColumnStack gap={2}>
                    <Fit>
                        <DateTimePicker
                            data-tid={"DateTimePicker"}
                            defaultTime={""}
                            error={false}
                            timeZone={TimeUtils.TimeZones.UTC}
                            onChange={(e, date) =>
                                this.updateItem(property, {
                                    value: timestampToTicks(date),
                                })
                            }
                            value={value ? ticksToTimestamp(value) : null}
                        />
                    </Fit>
                    <Fit>
                        <Input
                            data-tid={"DateTimeInTicks"}
                            onChange={(e, nextValue) => this.updateItem(property, { value: nextValue })}
                            value={value ? value : ""}
                        />
                    </Fit>
                </ColumnStack>
            );
        }
        if (property.type === "Boolean") {
            return (
                <Checkbox
                    checked={value === "true"}
                    onChange={(e, checked) => this.updateItem(property, { value: String(checked) })}
                />
            );
        }
        return (
            <ValidationWrapperV1
                data-tid="InputValidation"
                renderMessage={tooltip("right middle")}
                validationInfo={validateBusinessObjectField(value)}>
                <Input
                    data-tid={"Input"}
                    onChange={(e, nextValue) => this.updateItem(property, { value: nextValue })}
                    value={value || ""}
                />
            </ValidationWrapperV1>
        );
    }

    public render(): JSX.Element {
        const { tableColumns } = this.props;

        return (
            <ColumnStack gap={2} data-tid="BusinessObjectFilters">
                {tableColumns
                    .map(x => [x, this.getCondition(x)] as [Property, Condition])
                    .map(([property, condition]) => (
                        <FormRow key={property.name} captionWidth={200} caption={property.name} data-tid="Filter">
                            <RowStack baseline block gap={5} data-tid={property.name}>
                                <Fit>
                                    <OperatorSelect
                                        value={condition.operator}
                                        onChange={value => this.updateItem(property, { operator: value })}
                                        availableValues={
                                            this.isTypeComparable(property.type)
                                                ? (Object.keys(
                                                      BusinessObjectFieldFilterOperator
                                                  ) as BusinessObjectFieldFilterOperator[])
                                                : [
                                                      BusinessObjectFieldFilterOperator.Equals,
                                                      BusinessObjectFieldFilterOperator.DoesNotEqual,
                                                  ]
                                        }
                                    />
                                </Fit>
                                <Fit>{this.renderProperty(property, condition.value)}</Fit>
                            </RowStack>
                        </FormRow>
                    ))}
            </ColumnStack>
        );
    }
}
