import { RenderErrorMessage, ValidationInfo, ValidationWrapperV1 } from "@skbkontur/react-ui-validations";
import * as React from "react";
import { DatePicker, Input } from "ui";
import { DateUtils } from "Commons/DateUtils";

interface ValidationProps<TValue> {
    required?: boolean;
    validations?: Array<(value: Nullable<TValue>) => Nullable<ValidationInfo>>;
    renderErrorMessage?: RenderErrorMessage;
    minDate?: Date | string;
    maxDate?: Date | string;
}

interface PreparedProps<TProps> {
    validationWrapperProps: {
        validationInfo: Nullable<ValidationInfo>;
        renderMessage: RenderErrorMessage | undefined;
    };
    controlProps: TProps;
}

type WrappedProps<TValue, TProps extends { value?: TValue }> = TProps & ValidationProps<TValue>;

function prepareProps<TValue, TProps extends { value?: any }>(
    props: WrappedProps<TValue, TProps>
): PreparedProps<TProps> {
    // @ts-ignore Rest types may only be created from object types
    const { required, validations = [], renderErrorMessage, ...rest } = props;
    const value = props.value;

    const conditions = validations.map(x => x(value));
    if (required && !value) {
        conditions.push({ type: "submit", message: "Поле должно быть заполнено" });
    }
    if (value != null && value instanceof Date) {
        if (
            props.minDate != null &&
            props.maxDate != null &&
            props.minDate instanceof Date &&
            props.maxDate instanceof Date
        ) {
            if (DateUtils.isLessThan(value, props.minDate) || DateUtils.isLessThan(props.maxDate, value)) {
                conditions.push({
                    type: "lostfocus",
                    message: `Допускаются значения даты с ${props.minDate.toLocaleDateString()} по ${props.maxDate.toLocaleDateString()}`,
                });
            }
        } else if (props.minDate != null && props.minDate instanceof Date) {
            if (DateUtils.isLessThan(value, props.minDate)) {
                conditions.push({
                    type: "lostfocus",
                    message: `Допускаются значения даты с ${props.minDate.toLocaleDateString()}`,
                });
            }
        } else if (props.maxDate != null && props.maxDate instanceof Date) {
            if (DateUtils.isLessThan(props.maxDate, value)) {
                conditions.push({
                    type: "lostfocus",
                    message: `Допускаются значения даты по ${props.maxDate.toLocaleDateString()}`,
                });
            }
        }
    }
    return {
        validationWrapperProps: {
            validationInfo: conditions
                .filter(validation => validation)
                .reduce((result, validation) => ({ ...validation, ...(result as any) }), undefined),
            renderMessage: renderErrorMessage,
        },
        controlProps: rest as any,
    };
}

type ExtractProps<TComponentOrTProps> = TComponentOrTProps extends React.ComponentType<infer P>
    ? (P extends { value?: any } ? P : never)
    : never;

type ExtractValue<TComponent> = ExtractProps<TComponent> extends { value?: null | infer TValue } ? TValue : never;

function wrapControl<TComponent extends React.ComponentType<ExtractProps<TComponent>>>(
    controlType: TComponent
): React.ComponentType<
    WrappedProps<
        ExtractValue<TComponent>,
        JSX.LibraryManagedAttributes<TComponent, { value?: ExtractValue<TComponent> } & ExtractProps<TComponent>>
    >
> {
    return props => {
        const { controlProps, validationWrapperProps } = prepareProps(props);
        const control = React.createElement(controlType, controlProps) as React.ReactElement;
        return React.createElement(ValidationWrapperV1, {
            ...validationWrapperProps,
            children: control,
            // @ts-ignore
            "data-tid": `${props["data-tid"]}Validation`,
        });
    };
}

const WrappedInput = wrapControl(Input);
const WrappedDatePicker = wrapControl(DatePicker);

export { WrappedInput as Input };
export { WrappedDatePicker as DatePicker };

export function errorOnSubmit<T>(
    validator: (value: T) => boolean,
    message: string | JSX.Element
): (value: T) => ValidationInfo | null {
    return (value: T) => (validator(value) ? null : { message: message, type: "submit" });
}
export function errorOnLostFocus<T>(
    validator: (value: T) => boolean,
    message: string | JSX.Element
): (value: T) => ValidationInfo | null {
    return (value: T) => (validator(value) ? null : { message: message, type: "lostfocus" });
}
