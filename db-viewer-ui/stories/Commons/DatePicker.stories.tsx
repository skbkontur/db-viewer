import { TimeUtils } from "@skbkontur/edi-ui";
import { action } from "@storybook/addon-actions";
import React from "react";

import { DatePicker } from "../../src/Components/DateTimeRangePicker/DatePicker";
import { WithState } from "../WithState";

function getInitialValue(value: Date): { value: Date } {
    return {
        value: value,
    };
}

export default {
    title: "DatePicker",
};

export const Default = (): React.ReactElement => (
    <WithState initial={getInitialValue(new Date())}>
        {(state, onChange) => (
            <DatePicker
                value={state.value}
                onChange={x => {
                    action("onChange")(x);
                    onChange({ value: x || undefined });
                }}
            />
        )}
    </WithState>
);

export const DefaultWithTimezoneMoscow = (): React.ReactElement => (
    <WithState initial={getInitialValue(new Date())}>
        {(state, onChange) => (
            <DatePicker
                value={state.value}
                timeZone={TimeUtils.TimeZones.Moscow}
                onChange={x => {
                    action("onChange")(x);
                    onChange({ value: x || undefined });
                }}
            />
        )}
    </WithState>
);

export const Disabled = (): React.ReactElement => (
    <WithState initial={getInitialValue(new Date())}>
        {(state, onChange) => (
            <DatePicker
                value={state.value}
                disabled
                onChange={x => {
                    action("onChange")(x);
                    onChange({ value: x || undefined });
                }}
            />
        )}
    </WithState>
);

export const WithError = (): React.ReactElement => (
    <WithState initial={getInitialValue(new Date())}>
        {(state, onChange) => (
            <DatePicker
                value={state.value}
                error
                onChange={x => {
                    action("onChange")(x);
                    onChange({ value: x || undefined });
                }}
            />
        )}
    </WithState>
);
