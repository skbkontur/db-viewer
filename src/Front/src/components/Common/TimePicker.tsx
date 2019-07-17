import Input from "@skbkontur/react-ui/components/Input/Input";
import * as React from "react";

interface ITimePickerProps {
  value: any;
  onChange: (_: any, value: string) => void;
  error: boolean;
  width: number;
}

export class TimePicker extends React.Component<ITimePickerProps> {
  private static isCorrectTime(time: string): boolean {
    return Boolean(
      time.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]\.[0-9][0-9][0-9]/)
    );
  }
  public render(): JSX.Element {
    return (
      <Input
        value={this.props.value}
        mask={"99:99:99.999"}
        onChange={this.props.onChange}
        width={this.props.width}
        error={this.props.error}
        onBlur={this.handleBlur}
      />
    );
  }

  public handleBlur = (e: React.SyntheticEvent<any>) => {
    const { value } = this.props;
    if (TimePicker.isCorrectTime(value)) {
      this.props.onChange(e, value);
    } else {
      this.props.onChange(e, "");
    }
  };
}
