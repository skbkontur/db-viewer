import DatePicker from "@skbkontur/react-ui/components/DatePicker/DatePicker";
import * as React from "react";
import { TimePicker } from "./TimePicker";
import {DateTimeUtils} from "../Utils/DateTimeUtils";

interface IDateTimePickerProps {
  value: any;
  onChange: (_: any, value: any) => void;
  error: boolean;
}

export class DateTimePicker extends React.Component<IDateTimePickerProps> {
  public render(): JSX.Element {
    const { error } = this.props;
    return (
      <div>
        <span style={{ marginRight: 10 }}>
          <DatePicker
            value={this.getDatePart()}
            onChange={(e: any, date: string) => this.onDateChange(e, date)}
            error={error}
            width={150}
          />
        </span>
        <TimePicker
          value={this.getTimePart()}
          onChange={(e: any, time: string) => this.onTimeChange(e, time)}
          error={error}
          width={150}
        />
      </div>
    );
  }

  private getDatePart(): string {
    return DateTimeUtils.getDatePart(this.props.value);
  }

  private getTimePart(): string {
    return DateTimeUtils.getTimePart(this.props.value);
  }

  private onDateChange(_: any, date: string) {
    const newDate = DateTimeUtils.updateDate(this.props.value, date);
    this.props.onChange(_, newDate);
  }

  private onTimeChange(_: any, time: string) {
    const newDate = DateTimeUtils.updateTime(this.props.value, time);
    this.props.onChange(_, newDate);
  }
}
