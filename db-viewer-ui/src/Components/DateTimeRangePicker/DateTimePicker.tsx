import React from "react";

import { Time, TimeZone } from "../../Domain/DataTypes/Time";
import { DateUtils } from "../../Domain/Utils/DateUtils";
import { TimeUtils } from "../../Domain/Utils/TimeUtils";

import { DatePicker } from "./DatePicker";
import { jsStyles } from "./DateTimePicker.styles";
import { TimePicker } from "./TimePicker";

interface DateTimePickerProps {
    error?: boolean;
    defaultTime: Time;
    value: Nullable<Date>;
    onChange: (value: Nullable<Date>) => void;
    timeZone?: TimeZone | number;
    disabled?: boolean;
}

export function DateTimePicker({
    error,
    defaultTime,
    value,
    onChange,
    timeZone,
    disabled,
}: DateTimePickerProps): JSX.Element {
    const [time, setTime] = React.useState<Nullable<string>>(null);
    React.useEffect(() => setTimeToState(value, timeZone), [value, timeZone]);

    const handleDateTimeChange = (newDate: Nullable<Date>, newTime: Nullable<Time>): void => {
        if (!newDate) {
            return;
        }
        const timeZoneOffset = TimeUtils.getTimeZoneOffsetOrDefault(timeZone);
        const date = DateUtils.convertDateToString(newDate, timeZoneOffset, "yyyy-MM-dd");
        const newDateTime = !newTime
            ? DateUtils.toTimeZone(new Date(date), timeZoneOffset)
            : new Date(`${date}T${newTime}${TimeUtils.timeZoneOffsetToString(timeZoneOffset)}`);
        onChange(newDateTime);
    };

    const setTimeToState = (date: Nullable<Date>, timeZone: Nullable<TimeZone | number>): void => {
        if (!date) {
            return;
        }

        const timeZoneOffset = TimeUtils.getTimeZoneOffsetOrDefault(timeZone);
        const time = DateUtils.convertDateToString(date, timeZoneOffset, "HH:mm");
        setTime(time);
    };

    return (
        <span>
            <span className={jsStyles.dateRangeItem()}>
                <DatePicker
                    data-tid="Date"
                    timeZone={timeZone}
                    value={value}
                    defaultTime={time || defaultTime}
                    onChange={newDate => handleDateTimeChange(newDate, time)}
                    error={error}
                    disabled={disabled}
                    width={110}
                />
            </span>
            <span className={jsStyles.dateRangeItem()}>
                <TimePicker
                    data-tid="Time"
                    value={time === defaultTime ? null : time}
                    error={error}
                    defaultTime={defaultTime}
                    disabled={disabled || value === null}
                    onChange={(_, newTime) => handleDateTimeChange(value, newTime)}
                />
            </span>
        </span>
    );
}
