import { Time, TimeUtils } from "@skbkontur/edi-ui";
import { Input } from "@skbkontur/react-ui";
import { useEffect, useState, type ReactElement } from "react";

interface TimePickerProps {
    error?: boolean;
    value: Nullable<Time>;
    defaultTime: Time;
    disabled?: boolean;
    onChange: (value: Time) => void;
    warning?: boolean;
    useSeconds?: boolean;
}

const unlessNull = <T,>(value: Nullable<T>, defaultValue: T): T => {
    if (value === null || value === undefined) {
        return defaultValue;
    }
    return value;
};

const emptyValue = "";

export const TimePicker = ({
    disabled,
    warning,
    error,
    useSeconds,
    defaultTime,
    value,
    onChange,
}: TimePickerProps): ReactElement => {
    const [innerValue, setInnerValue] = useState(() => unlessNull(value, emptyValue));

    useEffect(() => {
        setInnerValue(unlessNull(value, emptyValue));
    }, [value]);

    const handleBlur = () => {
        const trimmed = innerValue.endsWith(".") || innerValue.endsWith(":") ? innerValue.slice(0, -1) : innerValue;
        if (TimeUtils.isCorrectTime(trimmed)) {
            onChange(trimmed);
            if (defaultTime === trimmed) {
                setInnerValue(emptyValue);
            }
        } else {
            setInnerValue(emptyValue);
            onChange(defaultTime || "00:00");
        }
    };

    const handleFocus = () => {
        if (!TimeUtils.isCorrectTime(innerValue)) {
            setInnerValue(defaultTime);
        }
    };

    return (
        <Input
            disabled={disabled}
            mask={useSeconds ? "99:99:99.999" : "99:99"}
            value={innerValue}
            width={useSeconds ? 96 : 58}
            error={error}
            placeholder={disabled ? undefined : defaultTime}
            onValueChange={setInnerValue}
            onBlur={handleBlur}
            onFocus={handleFocus}
            warning={warning}
        />
    );
};
