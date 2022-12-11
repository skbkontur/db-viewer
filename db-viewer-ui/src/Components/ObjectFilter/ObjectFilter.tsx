import HelpDotIcon from "@skbkontur/react-icons/HelpDot";
import { ColumnStack, Fit, RowStack } from "@skbkontur/react-stack-layout";
import { Input, Link, Tooltip } from "@skbkontur/react-ui";
import { tooltip, ValidationInfo, ValidationWrapper } from "@skbkontur/react-ui-validations";
import React from "react";

import { Condition } from "../../Domain/Api/DataTypes/Condition";
import { ObjectFieldFilterOperator } from "../../Domain/Api/DataTypes/ObjectFieldFilterOperator";
import { PropertyMetaInformation } from "../../Domain/Api/DataTypes/PropertyMetaInformation";
import { ticksToTimestamp, timestampToTicks } from "../../Domain/Utils/ConvertTimeUtil";
import { StringUtils } from "../../Domain/Utils/StringUtils";
import { TimeUtils } from "../../Domain/Utils/TimeUtils";
import { validateObjectField } from "../../Domain/Utils/ValidationUtils";
import { DateTimePicker } from "../DateTimeRangePicker/DateTimePicker";
import { FormRow } from "../FormRow/FormRow";
import { getMissingFilters, MissingFilters } from "../ObjectTable/TooltipContent";

import { OperatorSelect, StyledSelect } from "./OperatorSelect";

interface ObjectFilterProps {
    conditions: Condition[];
    onChange: (conditions: Condition[]) => void;
    tableColumns: PropertyMetaInformation[];
}

export class ObjectFilter extends React.Component<ObjectFilterProps> {
    public getCondition(property: PropertyMetaInformation): Condition {
        const { conditions } = this.props;
        const result = conditions.find(x => x.path === property.name);
        if (result == null) {
            return {
                path: property.name,
                operator: ObjectFieldFilterOperator.Equals,
                value: null,
            };
        }
        return result;
    }

    public brokenDependency(condition: Condition, dependent: undefined | PropertyMetaInformation): boolean {
        console.info(`brokenDependency(${condition.path}, ${dependent?.name})`);
        if (!dependent) {
            return false;
        }

        const requirement = dependent.requiredForFilter.find(x => x.propertyName === condition.path);
        if (!requirement) {
            return false;
        }

        console.info(StringUtils.isNullOrWhitespace(condition.value));
        console.info(requirement.availableFilters.indexOf(condition.operator) === -1);
        return (
            StringUtils.isNullOrWhitespace(condition.value) ||
            requirement.availableFilters.indexOf(condition.operator) === -1
        );
    }

    public updateItem(property: PropertyMetaInformation, conditionUpdate: Partial<Condition>): void {
        const { onChange, tableColumns } = this.props;

        const thisCondition = {
            ...(this.props.conditions.find(x => x.path === property.name) ?? this.getCondition(property)),
            ...conditionUpdate,
        };
        const dependents = tableColumns.filter(x => x.requiredForFilter.find(y => y.propertyName === property.name));
        console.info(this.props.conditions);
        const conditions = this.props.conditions.filter(
            x =>
                !this.brokenDependency(
                    thisCondition,
                    dependents.find(d => d.name === x.path)
                )
        );
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

    public renderProperty(property: PropertyMetaInformation, value: Nullable<string>, disabled: boolean): JSX.Element {
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
                            onChange={date => this.updateItem(property, { value: timestampToTicks(date) })}
                            value={value ? ticksToTimestamp(value) : null}
                            disabled={disabled}
                        />
                    </Fit>
                    <Fit>
                        <ValidationWrapper
                            data-tid="DateTimeValidation"
                            renderMessage={tooltip("right middle")}
                            validationInfo={this.getValidation(property, value)}>
                            <Input
                                mask="999999999999999999"
                                data-tid={"DateTimeInTicks"}
                                onValueChange={nextValue => this.updateItem(property, { value: nextValue })}
                                value={value ? value : ""}
                                disabled={disabled}
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
                    validationInfo={this.getValidation(property, value)}>
                    <StyledSelect
                        data-tid="BooleanSelect"
                        items={[null, "true", "false"].map(x => [x, String(x)])}
                        onValueChange={(nextValue: any) => {
                            this.updateItem(property, { value: nextValue });
                        }}
                        value={value || undefined}
                        disabled={disabled}
                    />
                </ValidationWrapper>
            );
        }
        if (property.availableValues.length !== 0) {
            return (
                <ValidationWrapper
                    data-tid="EnumValidation"
                    renderMessage={tooltip("right middle")}
                    validationInfo={this.getValidation(property, value)}>
                    <StyledSelect
                        data-tid="EnumSelect"
                        items={[null, ...property.availableValues].map(x => [x, String(x)])}
                        onValueChange={(nextValue: any) => {
                            this.updateItem(property, { value: nextValue });
                        }}
                        value={value || undefined}
                        disabled={disabled}
                    />
                </ValidationWrapper>
            );
        }
        return (
            <ValidationWrapper
                data-tid="InputValidation"
                renderMessage={tooltip("right middle")}
                validationInfo={this.getValidation(property, value)}>
                <Input
                    data-tid="Input"
                    onValueChange={nextValue => this.updateItem(property, { value: nextValue })}
                    value={value || ""}
                    disabled={disabled}
                />
            </ValidationWrapper>
        );
    }

    public getValidation(property: PropertyMetaInformation, value: string | null | undefined): ValidationInfo | null {
        if (property.isRequired && StringUtils.isNullOrWhitespace(value)) {
            return { message: "Поле должно быть заполнено", type: "submit" };
        }
        return validateObjectField(value);
    }

    public renderRow(property: PropertyMetaInformation, condition: Condition): JSX.Element {
        const { conditions } = this.props;
        const missingFilters = getMissingFilters(property.requiredForFilter, conditions);
        console.info(property.name, missingFilters);
        return (
            <FormRow
                hint={property.meta}
                key={property.name}
                captionWidth={200}
                caption={property.name}
                data-tid="Filter">
                <RowStack baseline block gap={5} data-tid={property.name}>
                    <Fit>
                        <OperatorSelect
                            value={condition.operator}
                            onChange={value => this.updateItem(property, { operator: value })}
                            availableValues={property.availableFilters || [ObjectFieldFilterOperator.Equals]}
                            disabled={missingFilters.length !== 0}
                        />
                    </Fit>
                    <Fit>{this.renderProperty(property, condition.value, missingFilters.length !== 0)}</Fit>
                    {missingFilters.length !== 0 && (
                        <Fit style={{ marginLeft: -20 }}>
                            <Tooltip
                                render={() => (
                                    <MissingFilters
                                        title="Для поиска по этому полю должны быть указаны следующие фильтры:"
                                        missingFilters={missingFilters}
                                    />
                                )}
                                pos="right middle">
                                <Link icon={<HelpDotIcon size={14} />} />
                            </Tooltip>
                        </Fit>
                    )}
                </RowStack>
            </FormRow>
        );
    }

    public render(): JSX.Element {
        const { tableColumns } = this.props;

        return (
            <ColumnStack gap={2} data-tid="ObjectFilters">
                {tableColumns
                    .map(x => [x, this.getCondition(x)] as [PropertyMetaInformation, Condition])
                    .map(([property, condition]) => this.renderRow(property, condition))}
            </ColumnStack>
        );
    }
}
