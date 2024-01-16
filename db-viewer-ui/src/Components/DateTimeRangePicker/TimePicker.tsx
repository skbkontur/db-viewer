import { Input } from "@skbkontur/react-ui";
import React from "react";

import { Time } from "../../Domain/DataTypes/Time";
import { DateUtils } from "../../Domain/Utils/DateUtils";

interface TimePickerProps {
    error?: boolean;
    value: Nullable<Time>;
    defaultTime: Time;
    disabled?: boolean;
    onChange: (e: React.SyntheticEvent<any>, value: Time) => void;
    warning?: boolean;
    useSeconds?: boolean;
}

interface TimePickerState {
    value: string;
}

function unlessNull<T>(value: Nullable<T>, defaultValue: T): T {
    if (value === null || value === undefined) {
        return defaultValue;
    }
    return value;
}

const emptyValue = "";

export class TimePicker extends React.Component<TimePickerProps, TimePickerState> {
    public constructor(props: TimePickerProps) {
        super(props);
        this.state = { value: unlessNull(props.value, emptyValue) };
    }

    public componentDidUpdate(prevProps: TimePickerProps): void {
        if (prevProps.value !== this.props.value) {
            this.setState({ value: unlessNull(this.props.value, emptyValue) });
        }
    }

    private handleChange = (value: string) => {
        this.setState({ value: value });
    };

    private handleBlur = (e: React.SyntheticEvent<any>) => {
        const { defaultTime } = this.props;
        const { value } = this.state;
        const trimmed = value.endsWith(".") || value.endsWith(":") ? value.slice(0, -1) : value;
        if (DateUtils.isCorrectTime(trimmed)) {
            this.props.onChange(e, trimmed);
            if (defaultTime === trimmed) {
                this.setState({ value: emptyValue });
            }
        } else {
            this.setState({ value: emptyValue });
            this.props.onChange(e, defaultTime || "00:00");
        }
    };

    private handleFocus = () => {
        const { defaultTime } = this.props;
        if (!DateUtils.isCorrectTime(this.state.value)) {
            this.setState({ value: defaultTime });
        }
    };

    public render(): React.ReactElement {
        const { disabled, warning, error, useSeconds, defaultTime } = this.props;
        return (
            <Input
                disabled={disabled}
                mask={useSeconds ? "99:99:99.999" : "99:99"}
                value={this.state.value}
                width={useSeconds ? 96 : 58}
                error={error}
                placeholder={disabled ? undefined : defaultTime}
                onValueChange={this.handleChange}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                warning={warning}
            />
        );
    }
}
