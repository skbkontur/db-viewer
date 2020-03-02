import moment from "moment";
import React from "react";
import { ICanBeValidated } from "Domain/DataTypes/DateTimeRange";
import { Time, TimeZone } from "Domain/DataTypes/Time";
import { DateUtils } from "Domain/Utils/DateUtils";
import { TimeUtils } from "Domain/Utils/TimeUtils";

import { DatePicker } from "./DatePicker";
import { TimePicker } from "./TimePicker";

import cn from "./DateTimePicker.less";

interface DateTimePickerProps {
    error?: boolean;
    defaultTime: Time;
    value: Nullable<Date>;
    onChange: (e: React.SyntheticEvent<any>, value: Nullable<Date>) => void;
    timeZone?: TimeZone | number;
    autoFocus?: boolean;
    disabled?: boolean;
}

interface DateTimePickerState {
    time: Nullable<string>;
}

export class DateTimePicker extends React.Component<DateTimePickerProps, DateTimePickerState>
    implements ICanBeValidated {
    private datePicker: Nullable<DatePicker>;
    public state = {
        time: null,
    };

    public componentDidMount = (): void => {
        const { value, timeZone } = this.props;

        if (value === null || value === undefined) {
            return;
        }

        this.setTimeToState(value, timeZone);
    };

    public componentWillReceiveProps = ({ value, timeZone }: DateTimePickerProps): void => {
        if (value === null || value === undefined) {
            return;
        }

        this.setTimeToState(value, timeZone);
    };

    public focus(): void {
        if (this.datePicker != null) {
            this.datePicker.focus();
        }
    }

    public handleTimeChange = (e: React.SyntheticEvent<any>, newTime: Time): void => {
        const { value, timeZone, onChange } = this.props;
        if (value === null || value === undefined) {
            return;
        }

        const timeZoneOffset = TimeUtils.getTimeZoneOffsetOrDefault(timeZone);
        const date = DateUtils.convertDateToString(value, timeZoneOffset, "YYYY-MM-DD");
        const newDateTime = moment(`${date}T${newTime}${TimeUtils.timeZoneOffsetToString(timeZoneOffset)}`).toDate();
        onChange(e, newDateTime);
    };

    public render(): JSX.Element {
        const { value, error, defaultTime, timeZone, disabled, onChange } = this.props;
        const { time } = this.state;
        return (
            <span>
                <span className={cn("date-range-item")}>
                    <DatePicker
                        ref={el => (this.datePicker = el)}
                        data-tid="Date"
                        timeZone={timeZone}
                        value={value}
                        defaultTime={time || defaultTime}
                        onChange={onChange}
                        error={error}
                        disabled={disabled}
                        width={110}
                    />
                </span>
                <span className={cn("date-range-item")}>
                    <TimePicker
                        data-tid="Time"
                        value={time === defaultTime ? null : time}
                        error={error}
                        defaultTime={defaultTime}
                        disabled={disabled || value === null}
                        onChange={this.handleTimeChange}
                    />
                </span>
            </span>
        );
    }

    private readonly setTimeToState = (date: Date, timeZone: Nullable<TimeZone | number>): void => {
        const timeZoneOffset = TimeUtils.getTimeZoneOffsetOrDefault(timeZone);
        const time = DateUtils.convertDateToString(date, timeZoneOffset, "HH:mm");
        this.setState({ time: time });
    };
}
