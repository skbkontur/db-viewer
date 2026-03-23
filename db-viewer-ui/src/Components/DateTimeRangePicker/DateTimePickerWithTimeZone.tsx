import { DateUtils, Time } from "@skbkontur/edi-ui";
import { Select } from "@skbkontur/react-ui";
import { useState, useEffect, type ReactElement } from "react";

import { DatePicker } from "./DatePicker";
import { jsStyles } from "./DateTimePicker.styles";
import { TimePicker } from "./TimePicker";
import { buildDateTime, getTimeZoneString } from "./helpers";

interface DateTimePickerWithTimeZone {
    error?: boolean;
    defaultTime: Time;
    value: Nullable<string>;
    onChange: (value: Nullable<string>) => void;
    disabled?: boolean;
    timeZoneEditable?: boolean;
}

export const DateTimePickerWithTimeZone = ({
    error,
    defaultTime,
    value,
    onChange,
    disabled,
    timeZoneEditable,
}: DateTimePickerWithTimeZone): ReactElement => {
    const [time, setTime] = useState<Nullable<string>>(null);
    const [offset, setOffset] = useState<Nullable<string>>(null);
    const [date, setDate] = useState<Nullable<Date>>(null);

    useEffect(() => {
        if (!value) {
            return;
        }
        const timeOffset = getTimeZoneString(value);
        setOffset(timeOffset);
        const dateTimeWithoutTimezone = timeOffset ? value.slice(0, -timeOffset.length) : value;
        setDate(DateUtils.fromLocalToUtc(new Date(dateTimeWithoutTimezone)));
        setTime(DateUtils.formatDate(dateTimeWithoutTimezone, "HH:mm:ss.SSS"));
    }, [value]);

    const handleDateChange = (newDate: Nullable<Date>): void => {
        setDate(newDate);
        onChange(buildDateTime(newDate, time, offset, defaultTime));
    };

    const handleTimeChange = (newTime: Time): void => {
        setTime(newTime);
        onChange(buildDateTime(date, newTime, offset, defaultTime));
    };

    const handleOffsetChange = (offset: string): void => {
        const nextOffset = offset === "local" ? null : "Z";
        setOffset(nextOffset);
        onChange(buildDateTime(date, time, nextOffset, defaultTime));
    };

    return (
        <span>
            <span className={jsStyles.dateRangeItem()}>
                <DatePicker
                    data-tid="Date"
                    value={date}
                    defaultTime={defaultTime}
                    onChange={handleDateChange}
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
                    disabled={disabled || !date}
                    onChange={handleTimeChange}
                    useSeconds
                />
            </span>
            <span className={jsStyles.dateRangeItem()}>
                {timeZoneEditable ? (
                    <Select<string>
                        data-tid="TimeZoneSelect"
                        defaultValue="UTC"
                        value={offset ? "UTC" : "local"}
                        items={["UTC", "local"]}
                        onValueChange={handleOffsetChange}
                    />
                ) : (
                    <span data-tid="TimeOffsetLabel">{offset}</span>
                )}
            </span>
        </span>
    );
};
