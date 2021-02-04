import moment from "moment";
import React from "react";

import { Time, TimeZone } from "../../Domain/DataTypes/Time";
import { DateUtils } from "../../Domain/Utils/DateUtils";
import { TimeUtils } from "../../Domain/Utils/TimeUtils";

import { DatePicker } from "./DatePicker";
import styles from "./DateTimePicker.less";
import { TimePicker } from "./TimePicker";

interface DateTimePickerProps {
    error?: boolean;
    defaultTime: Time;
    value: Nullable<Date>;
    onChange: (value: Nullable<Date>) => void;
    timeZone?: TimeZone | number;
    autoFocus?: boolean;
    disabled?: boolean;
}

interface DateTimePickerState {
    time: Nullable<string>;
}

export class DateTimePicker extends React.Component<DateTimePickerProps, DateTimePickerState> {
    public state = {
        time: null,
    };

    public componentDidMount(): void {
        const { value, timeZone } = this.props;
        this.setTimeToState(value, timeZone);
    }

    public componentDidUpdate(prevProps: DateTimePickerProps): void {
        const { value, timeZone } = this.props;
        if (prevProps.value !== value || prevProps.timeZone !== timeZone) {
            this.setTimeToState(value, timeZone);
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
        onChange(newDateTime);
    };

    public render(): JSX.Element {
        const { value, error, defaultTime, timeZone, disabled, onChange } = this.props;
        const { time } = this.state;
        return (
            <span>
                <span className={styles.dateRangeItem}>
                    <DatePicker
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
                <span className={styles.dateRangeItem}>
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

    private readonly setTimeToState = (date: Nullable<Date>, timeZone: Nullable<TimeZone | number>): void => {
        if (date === null || date === undefined) {
            return;
        }

        const timeZoneOffset = TimeUtils.getTimeZoneOffsetOrDefault(timeZone);
        const time = DateUtils.convertDateToString(date, timeZoneOffset, "HH:mm");
        this.setState({ time: time });
    };
}
