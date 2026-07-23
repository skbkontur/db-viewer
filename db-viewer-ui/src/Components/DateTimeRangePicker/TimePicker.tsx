import { Time, TimeUtils } from "@skbkontur/edi-ui";
import { MaskedInput } from "@skbkontur/react-ui";
import { useEffect, useState, type ReactElement, useMemo } from "react";

import { padTime } from "./helpers";

interface TimePickerProps {
    error?: boolean;
    value: Nullable<Time>;
    defaultTime: Time;
    disabled?: boolean;
    onChange: (value: Time) => void;
    warning?: boolean;
    useSeconds?: boolean;
}

export const TimePicker = ({
    disabled,
    warning,
    error,
    useSeconds,
    defaultTime,
    value,
    onChange,
}: TimePickerProps): ReactElement => {
    const [innerValue, setInnerValue] = useState(() => value ?? "");

    const formatChars = useMemo(
        () => ({
            "9": "[0-9]",
            H: "[0-2]",
            h: innerValue.startsWith("2") ? "[0-3]" : "[0-9]",
            M: "[0-5]",
            m: "[0-9]",
            S: "[0-5]",
            s: "[0-9]",
        }),
        [innerValue]
    );

    useEffect(() => {
        setInnerValue(value ?? "");
    }, [value]);

    const handleBlur = () => {
        const paddedTime = padTime(innerValue, useSeconds);

        if (paddedTime && TimeUtils.isCorrectTime(paddedTime)) {
            setInnerValue(paddedTime);
            onChange(paddedTime);
            return;
        }
        const fallback = defaultTime || (useSeconds ? "00:00:00.000" : "00:00");
        setInnerValue(fallback);
        onChange(fallback);
    };

    return (
        <MaskedInput
            unmask
            disabled={disabled}
            mask={useSeconds ? "Hh{:}Mm{:}Ss{.}999" : "Hh{:}Mm"}
            formatChars={formatChars}
            value={innerValue}
            width={useSeconds ? 96 : 58}
            error={error}
            placeholder={disabled ? undefined : defaultTime}
            onValueChange={setInnerValue}
            onBlur={handleBlur}
            warning={warning}
        />
    );
};
