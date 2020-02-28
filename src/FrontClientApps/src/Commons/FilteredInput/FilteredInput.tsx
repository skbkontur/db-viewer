import * as React from "react";
import { Input } from "ui";

import cn from "./FilteredInput.less";

export interface FilterValueResult<T> {
    hintValue?: string;
    displayValue: string | null;
    actualValue: T;
}

interface FilteredInputProps<T> {
    value: T;
    leftIcon?: Nullable<JSX.Element>;
    onChange: (event: React.SyntheticEvent<any>, value: T) => void;
    filterValue: (value: string) => FilterValueResult<T> | null;
    valueForView: (value: T) => string;
    valueForEdit: (value: T) => string;
    hintForView?: (value: T) => string | null;
    hintForEdit?: (value: T) => string | null;
    onKeyDown?: (event: React.KeyboardEvent<any>) => void;
    onBlur?: (event: React.SyntheticEvent<any>) => void;
    onFocus?: (event: React.SyntheticEvent<any>) => void;
    selectValueOnFocus?: boolean;
    align?: "left" | "right";
    error?: boolean;
    disabled?: boolean;
    width?: number | string;
    maxLength?: number;
    placeholder?: string;
}

interface HintState {
    hintValue: Nullable<string>;
    hintClip: Nullable<number>;
}

interface FilteredInputState extends HintState {
    displayValue: Nullable<string>;
}

export class FilteredInput<T> extends React.Component<FilteredInputProps<T>, FilteredInputState> {
    public props: FilteredInputProps<T>;
    public state: FilteredInputState = {
        displayValue: null,
        hintValue: null,
        hintClip: null,
    };

    public innerInput: Input | null = null;
    public testWidth: HTMLDivElement | null = null;
    public root: HTMLElement | null = null;

    public focused = false;
    public selectionStart = 0;
    public selectionEnd = 0;

    public componentWillMount() {
        this.reformatValueForView(this.props.value);
    }

    public componentDidMount() {
        this.reformatValueForView(this.props.value);
    }

    public componentWillReceiveProps(nextProps: FilteredInputProps<T>) {
        if (nextProps.value !== this.props.value) {
            if (!this.focused) {
                this.reformatValueForView(nextProps.value);
            }
        }
    }

    public focus() {
        if (this.innerInput != null) {
            this.innerInput.focus();
        }
    }

    public handleInputChange(event: SyntheticEvent<any>, value: string) {
        const { onChange, filterValue } = this.props;
        const filteredValue = filterValue(value);
        if (filteredValue !== null) {
            this.setState({
                displayValue: filteredValue.displayValue,
                ...this.getHintState(filteredValue.hintValue, filteredValue.displayValue),
            });
            onChange(event, filteredValue.actualValue);
        } else if (this.innerInput != null) {
            this.setState({}, () => {
                if (this.innerInput != null) {
                    this.innerInput.setSelectionRange(this.selectionStart, this.selectionEnd);
                }
            });
        }
    }

    public selectValue = () => {
        const selectionLength = this.state.displayValue != null ? this.state.displayValue.length : 5;
        if (this.innerInput != null && this.props.selectValueOnFocus) {
            this.innerInput.setSelectionRange(0, selectionLength);
        }
    };

    public getHintState(hintValue: Nullable<string>, displayValue: Nullable<string>): HintState {
        if (hintValue === null || hintValue === undefined) {
            return {
                hintValue: this.state.hintValue,
                hintClip: this.state.hintClip,
            };
        }
        return {
            hintValue: hintValue,
            hintClip: this.getClip(displayValue),
        };
    }

    public getViewHintState(value: T): HintState {
        const { hintForView, valueForView } = this.props;
        if (hintForView === null || hintForView === undefined) {
            return {
                hintValue: this.state.hintValue,
                hintClip: this.state.hintClip,
            };
        }
        return {
            hintValue: hintForView(value),
            hintClip: this.getClip(valueForView(value)),
        };
    }

    public getEditHintState(value: T): HintState {
        const { hintForEdit, valueForEdit } = this.props;
        if (hintForEdit === null || hintForEdit === undefined) {
            return {
                hintValue: this.state.hintValue,
                hintClip: this.state.hintClip,
            };
        }
        return {
            hintValue: hintForEdit(value),
            hintClip: this.getClip(valueForEdit(value)),
        };
    }

    public getClip(value: Nullable<string>): number {
        if (this.testWidth != null && this.root != null) {
            this.testWidth.innerHTML = value || "";
            const result = this.root.offsetWidth - this.testWidth.offsetWidth;
            return result - 9;
        }
        return 0;
    }

    public reformatValueForView(value: T) {
        if (this.state.displayValue !== this.props.valueForView(value)) {
            this.setState({
                displayValue: this.props.valueForView(value),
                ...this.getViewHintState(value),
            });
        }
    }

    public reformatValueForEdit(value: T) {
        if (this.state.displayValue !== this.props.valueForEdit(value)) {
            this.setState(
                {
                    displayValue: this.props.valueForEdit(value),
                    ...this.getEditHintState(value),
                },
                this.selectValue
            );
        }
    }

    public handleBlur(event: SyntheticEvent<any>) {
        const displayValueForEdit = this.props.valueForEdit(this.props.value);
        const nextDisplayValue = this.props.valueForView(this.props.value);
        this.setState({
            displayValue: nextDisplayValue,
            ...this.getViewHintState(this.props.value),
        });
        const filteredValue = this.props.filterValue(displayValueForEdit);
        if (filteredValue != null) {
            this.props.onChange(event, filteredValue.actualValue);
        }
    }

    public render(): JSX.Element {
        const {
            value: _value,
            filterValue,
            valueForView,
            valueForEdit,
            hintForView,
            hintForEdit,
            selectValueOnFocus,
            leftIcon,
            onKeyDown,
            onBlur,
            onFocus,
            onChange,
            ...restProps
        } = this.props;
        const { hintClip } = this.state;
        return (
            <span className={cn("root")} ref={el => (this.root = el)}>
                <div className={cn("test-width")} ref={el => (this.testWidth = el)} />
                {this.state.hintValue &&
                    hintClip !== null &&
                    hintClip !== undefined && (
                        <div className={cn("hint-container")} style={{ clip: `rect(auto,${hintClip}px,auto,0px)` }}>
                            <Input {...restProps} disabled borderless placeholder={this.state.hintValue} value={""} />
                        </div>
                    )}
                <span className={cn("input-container")}>
                    <Input
                        {...restProps}
                        leftIcon={leftIcon}
                        data-tid="innerInput"
                        ref={el => (this.innerInput = el)}
                        value={this.state.displayValue || ""}
                        onChange={(event, value) => this.handleInputChange(event, value)}
                        onBlur={event => {
                            this.focused = false;
                            this.handleBlur(event);
                            if (onBlur !== null && onBlur !== undefined) {
                                onBlur(event);
                            }
                        }}
                        onFocus={event => {
                            this.focused = true;
                            this.reformatValueForEdit(this.props.value);
                            this.selectValue();
                            if (onFocus != null) {
                                onFocus(event);
                            }
                        }}
                        onKeyDown={event => {
                            const target = event.target;
                            if (target instanceof HTMLInputElement) {
                                this.selectionStart = target.selectionStart || 0;
                                this.selectionEnd = target.selectionEnd || 0;
                                if (onKeyDown !== null && onKeyDown !== undefined) {
                                    onKeyDown(event);
                                }
                            }
                        }}
                    />
                </span>
            </span>
        );
    }
}
