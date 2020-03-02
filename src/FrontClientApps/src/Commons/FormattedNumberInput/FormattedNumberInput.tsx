import * as React from "react";
import { numeral } from "Commons/edi-numeral";

import { FilteredInput, FilterValueResult } from "../FilteredInput/FilteredInput";

interface FormattedNumberInputProps {
    viewFormat?: Nullable<string>;
    editFormat?: Nullable<string>;
    value: Nullable<number>;
    align?: "left" | "right";
    leftIcon?: Nullable<JSX.Element>;
    onChange: (event: React.SyntheticEvent<any>, value: Nullable<number>) => void;
    width?: number | string;
    onBlur?: (event: React.SyntheticEvent<any>) => void;
    onFocus?: (event: React.SyntheticEvent<any>) => void;
    onKeyDown?: (event: React.KeyboardEvent<any>) => void;
    selectValueOnFocus?: boolean;
    error?: boolean;
    allowNegativeValue?: boolean;
    maxLength?: number;
    placeholder?: string;
}

export class FormattedNumberInput extends React.Component<FormattedNumberInputProps> {
    public static numberRegexp = /^\s*\d*(\.\d*)?\s*$/;
    public static numberWithNegativeRegexp = /^\s*-?\d*(\.\d*)?\s*$/;
    public filteredInput: Nullable<FilteredInput<Nullable<number>>>;

    public handleFilterValue = (value: string): FilterValueResult<Nullable<number>> | null => {
        const str = value ? value.replace(",", ".") : value;
        const regExp = this.props.allowNegativeValue
            ? FormattedNumberInput.numberWithNegativeRegexp
            : FormattedNumberInput.numberRegexp;

        if (regExp.test(str)) {
            if (str.trim() === "") {
                return {
                    displayValue: null,
                    actualValue: null,
                };
            }
            if (str.trim() === "-") {
                return {
                    displayValue: str,
                    actualValue: 0,
                };
            }
            return {
                displayValue: str,
                actualValue: parseFloat(str),
            };
        }
        return null;
    };

    public handleValueForView(value: Nullable<number>): string {
        return value != null
            ? numeral(value).format(this.props.viewFormat || this.props.editFormat || "0,0.0[00000]")
            : "";
    }

    public handleValueForEdit(value: Nullable<number>): string {
        return value != null ? numeral(value).format(this.props.editFormat || "0,0.0[00000]") : "";
    }

    public focus() {
        if (this.filteredInput != null) {
            this.filteredInput.focus();
        }
    }

    public render(): JSX.Element {
        const {
            value,
            leftIcon,
            viewFormat: _viewFormat,
            editFormat: _editFormat,
            allowNegativeValue: _allowNegativeValue,
            ...restProps
        } = this.props;

        return (
            <FilteredInput
                ref={(x: Nullable<FilteredInput<Nullable<number>>>) => (this.filteredInput = x)}
                {...restProps}
                leftIcon={leftIcon}
                value={value}
                filterValue={nextValue => this.handleFilterValue(nextValue)}
                valueForView={nextValue => this.handleValueForView(nextValue)}
                valueForEdit={nextValue => this.handleValueForEdit(nextValue)}
            />
        );
    }
}
