import DatePicker from "@skbkontur/react-ui/components/DatePicker/DatePicker";
import * as React from "react";
import { TimePicker } from "./TimePicker";

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
    return this.props.value.split(" ")[0];
  }

  private getTimePart(): string {
    return this.props.value.split(" ")[1];
  }

  private onDateChange(_: any, date: string) {
    const { value } = this.props;
    let newDate = date;
    const oldTime = value.split(" ")[1];
    if (oldTime != null) {
      newDate = newDate + " " + oldTime;
    }
    this.props.onChange(_, newDate);
  }

  private onTimeChange(_: any, time: string) {
    const { value } = this.props;
    let oldDate = value.split(" ")[0];
    if (time != null) {
      oldDate = oldDate + " " + time;
    }
    this.props.onChange(_, oldDate);
  }
}
