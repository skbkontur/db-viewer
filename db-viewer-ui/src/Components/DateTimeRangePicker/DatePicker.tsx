import { RussianDateFormat, StringUtils, Time, TimeUtils, TimeZone } from "@skbkontur/edi-ui";
import { DatePicker as DefaultDatePicker } from "@skbkontur/react-ui";
import { useEffect, useState, type ReactElement } from "react";

import { convertDateToStringWithTimezone, convertStringToDate } from "./helpers";

interface DatePickerProps {
    value: Nullable<Date>;
    onChange: (value: Nullable<Date>) => void;
    width?: string | number;
    minDate?: Date | string;
    maxDate?: Date | string;
    isHoliday?: (day: string, isWeekend: boolean) => boolean;
    timeZone?: TimeZone | number;
    defaultTime?: Time;
    disabled?: boolean;
    error?: boolean;
}

const DatePickerDefaultProps = {
    width: 120,
    minDate: "01.01.1900",
    maxDate: "31.12.2099",
    isHoliday: (_day: string, isWeekend: boolean) => isWeekend,
};

export const DatePicker = ({
    defaultTime = "00:00",
    maxDate,
    minDate,
    onChange,
    timeZone = TimeUtils.TimeZones.UTC,
    value,
    ...restProps
}: DatePickerProps): ReactElement => {
    const [date, setDate] = useState("");

    useEffect(() => {
        setDate(convertDateToStringWithTimezone(value, timeZone));
    }, [value, timeZone]);

    const handleChange = (newStringifiedDate: RussianDateFormat): void => {
        setDate(newStringifiedDate);
        if (StringUtils.isNullOrWhitespace(newStringifiedDate)) {
            onChange(null);
            return;
        }

        if (!DefaultDatePicker.validate(newStringifiedDate)) {
            return;
        }

        onChange(convertStringToDate(newStringifiedDate, defaultTime, timeZone));
    };

    return (
        <DefaultDatePicker
            {...DatePickerDefaultProps}
            {...restProps}
            maxDate={convertDateToStringWithTimezone(maxDate, timeZone)}
            minDate={convertDateToStringWithTimezone(minDate, timeZone)}
            value={date}
            onValueChange={handleChange}
        />
    );
};
