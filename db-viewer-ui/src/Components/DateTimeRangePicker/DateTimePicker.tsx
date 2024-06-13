import { Time, TimeZone, TimeUtils, DateUtils } from "@skbkontur/edi-ui";
import React from "react";

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
}: DateTimePickerProps): React.ReactElement {
    const [time, setTime] = React.useState<Nullable<string>>(null);
    React.useEffect(() => setTimeToState(value, timeZone), [value, timeZone]);

    const handleTimeChange = (newTime: Time): void => {
        if (value === null || value === undefined) {
            return;
        }

        const timeZoneOffset = TimeUtils.getTimeZoneOffsetOrDefault(timeZone);
        const date = DateUtils.formatDate(value, "yyyy-MM-dd", timeZoneOffset);
        const newDateTime = new Date(`${date}T${newTime}${TimeUtils.timeZoneOffsetToString(timeZoneOffset)}`);
        onChange(newDateTime);
    };

    const setTimeToState = (date: Nullable<Date>, timeZone: Nullable<TimeZone | number>): void => {
        if (date === null || date === undefined) {
            return;
        }

        const timeZoneOffset = TimeUtils.getTimeZoneOffsetOrDefault(timeZone);
        const time = DateUtils.formatDate(date, "HH:mm", timeZoneOffset);
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
                    onChange={onChange}
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
                    onChange={(e, time) => handleTimeChange(time)}
                />
            </span>
        </span>
    );
}
