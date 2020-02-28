import { action, storiesOf } from "@kadira/storybook";
import Button from "@skbkontur/react-ui/Button";
import * as React from "react";
import { Input } from "ui";
import { TimeUtils } from "Commons/TimeUtils";
import { DateTimeRange } from "Domain/EDI/DataTypes/DateTimeRange";
import { TimeZone } from "Domain/EDI/DataTypes/Time";

import {
    DateTimeRangePicker,
    PredefinedRangeDefinition,
} from "../../src/AdminTools/Components/DateTimeRangePicker/DateTimeRangePicker";

export interface DateTimeRangePickerContainerProps {
    error?: boolean;
    value: DateTimeRange;
    disabled?: boolean;
    timeZone?: TimeZone;
    hideTime?: boolean;
    lowerBoundDefaultTime?: string;
    upperBoundDefaultTime?: string;
    predefinedRanges?: PredefinedRangeDefinition[];
}

interface DateTimeRangePickerContainerState {
    value: DateTimeRange;
}

class DateTimeRangePickerContainer extends React.Component<
    DateTimeRangePickerContainerProps,
    DateTimeRangePickerContainerState
> {
    public constructor(props: DateTimeRangePickerContainerProps) {
        super(props);
        this.state = { value: props.value };
    }

    public componentWillReceiveProps(nextProps: DateTimeRangePickerContainerProps) {
        this.setState({
            value: nextProps.value,
        });
    }

    public render(): JSX.Element {
        const { value, ...restProps } = this.props;
        usedForOmitWithDestructuring(value);

        return (
            <DateTimeRangePicker
                value={this.state.value}
                onChange={(e, nextValue) => {
                    action("onChange")(nextValue);
                    this.setState({ value: nextValue });
                }}
                {...restProps}
            />
        );
    }
}

function usedForOmitWithDestructuring(..._values: mixed[]) {
    // Do nothing
}

storiesOf(module)
    .add("Default", () => (
        <DateTimeRangePickerContainer
            value={{
                lowerBound: null,
                upperBound: null,
            }}
        />
    ))
    .add("Default [timezone=Moscow]", () => (
        <DateTimeRangePickerContainer
            timeZone={TimeUtils.TimeZones.Moscow}
            value={{
                lowerBound: null,
                upperBound: null,
            }}
        />
    ))
    .add("DateInProps", () => (
        <DateTimeRangePickerContainer
            value={{
                lowerBound: new Date("2016-10-04 10:00:00Z"),
                upperBound: new Date("2016-10-04 11:00"),
            }}
        />
    ))
    .add("CustomShortCuts", () => (
        <DateTimeRangePickerContainer
            value={{
                lowerBound: new Date("2016-10-04 10:00:00Z"),
                upperBound: new Date("2016-10-04 11:00"),
            }}
            predefinedRanges={[
                {
                    tid: "Never",
                    caption: "никогда",
                    getRange: () => ({ lowerBound: null, upperBound: null }),
                },
            ]}
        />
    ))
    .add("WithText", () => (
        <div>
            <span>123</span>
            <DateTimeRangePickerContainer
                value={{
                    lowerBound: new Date("2016-10-04 10:00:00Z"),
                    upperBound: new Date("2016-10-04 11:00"),
                }}
            />
        </div>
    ))
    .add("WithOtherControl", () => (
        <div>
            <Button>Test</Button>
            <DateTimeRangePickerContainer
                value={{
                    lowerBound: new Date("2016-10-04 10:00:00Z"),
                    upperBound: new Date("2016-10-04 11:00"),
                }}
            />
            <Input value="123" />
        </div>
    ))
    .add("WithoutTime", () => (
        <DateTimeRangePickerContainer
            hideTime
            value={{
                lowerBound: new Date("2016-10-04 10:00:00Z"),
                upperBound: new Date("2016-10-04 11:00"),
            }}
        />
    ));
