import Input from "@skbkontur/react-ui/Input";
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

    public componentWillReceiveProps({ value }: TimePickerProps) {
        if (value !== this.props.value) {
            this.setState({ value: unlessNull(value, emptyValue) });
        }
    }

    public handleChange = (e: React.SyntheticEvent<any>, value: string) => {
        this.setState({ value: value });
    };

    public handleBlur = (e: React.SyntheticEvent<any>) => {
        const { defaultTime } = this.props;
        const { value } = this.state;
        if (DateUtils.isCorrectTime(value)) {
            this.props.onChange(e, value);
            if (defaultTime === value) {
                this.setState({ value: emptyValue });
            }
        } else {
            this.setState({ value: emptyValue });
            this.props.onChange(e, defaultTime || "00:00");
        }
    };

    public handleFocus = () => {
        const { defaultTime } = this.props;
        if (!DateUtils.isCorrectTime(this.state.value)) {
            this.setState({ value: defaultTime });
        }
    };

    public render(): JSX.Element {
        return (
            <Input
                data-tid="Input"
                disabled={this.props.disabled}
                mask="99:99"
                value={this.state.value}
                width={58}
                error={this.props.error}
                placeholder={this.props.disabled ? undefined : this.props.defaultTime}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                warning={this.props.warning}
            />
        );
    }
}
