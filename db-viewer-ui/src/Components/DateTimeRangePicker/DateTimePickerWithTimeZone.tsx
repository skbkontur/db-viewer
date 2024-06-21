import { DateUtils, Time } from "@skbkontur/edi-ui";
import { Select } from "@skbkontur/react-ui";
import React, { useState, useEffect } from "react";

import { DatePicker } from "./DatePicker";
import { jsStyles } from "./DateTimePicker.styles";
import { TimePicker } from "./TimePicker";

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
}: DateTimePickerWithTimeZone): React.ReactElement => {
    const [time, setTime] = useState<Nullable<string>>(null);
    const [offset, setOffset] = useState<Nullable<string>>(null);
    const [date, setDate] = useState<Nullable<Date>>(null);
    useEffect(() => {
        loadState(value);
    }, [value]);
    useEffect(() => {
        handleDateTimeChange(date, time, offset);
    }, [date, time, offset]);

    const handleDateTimeChange = (
        newDate: Nullable<Date>,
        newTime: Nullable<Time>,
        newOffset: Nullable<string>
    ): void => {
        if (!newDate) {
            onChange(null);
            return;
        }
        const date = DateUtils.formatDate(newDate, "yyyy-MM-dd", 0);
        const newDateTime = `${date}T${newTime ?? defaultTime}${newOffset ?? ""}`;
        onChange(newDateTime);
    };

    const loadState = (dateStr: Nullable<string>): void => {
        if (!dateStr) {
            return;
        }
        const timeOffset = getTimeZoneString(dateStr);
        setOffset(timeOffset);
        const dateTimeWithoutTimezone = timeOffset ? dateStr.slice(0, -timeOffset.length) : dateStr;
        setDate(DateUtils.fromLocalToUtc(new Date(dateTimeWithoutTimezone)));
        setTime(DateUtils.formatDate(dateTimeWithoutTimezone, "HH:mm:ss.SSS"));
    };

    const getTimeZoneString = (date: string): Nullable<string> => {
        const timezoneRegex = /.*T.*(Z|[+-].*)/i;
        const matches = date.match(timezoneRegex);
        if (!matches || matches.length < 2) {
            return null;
        }
        return matches[1];
    };

    return (
        <span>
            <span className={jsStyles.dateRangeItem()}>
                <DatePicker
                    data-tid="Date"
                    value={date}
                    defaultTime={defaultTime}
                    onChange={setDate}
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
                    onChange={(e, time) => setTime(time)}
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
                        onValueChange={v => setOffset(v === "local" ? null : "Z")}
                    />
                ) : (
                    <span data-tid="TimeOffsetLabel">{offset}</span>
                )}
            </span>
        </span>
    );
};
