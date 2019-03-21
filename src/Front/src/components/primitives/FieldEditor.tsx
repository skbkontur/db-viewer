import DatePicker from "@skbkontur/react-ui/components/DatePicker";
import Select from "@skbkontur/react-ui/components/Select";
import CurrencyInput from "@skbkontur/react-ui/CurrencyInput";
import Input from "@skbkontur/react-ui/Input";
import * as React from "react";
import { FieldInfo } from "../../api/impl/FieldInfo";
import { FieldType } from "../../api/impl/FieldType";

export type EnumSelectItem = [string, string];

interface IProps {
  value: any;
  typeInfo: FieldInfo;
  onChange: (value: any) => void;
  dateAsInput?: boolean;
  error?: boolean;
}

export default class FieldEditor extends React.Component<IProps> {
  public render() {
    switch (this.props.typeInfo.type) {
      case FieldType.DateTime:
        if (this.props.dateAsInput) {
          return (
            <Input
              value={this.props.value}
              onChange={(_, v) => this.props.onChange(v)}
              width={310}
              error={this.props.error}
            />
          );
        }
        return (
          <DatePicker
            value={this.props.value}
            onChange={(_, v) => this.props.onChange(v)}
            width={310}
            error={this.props.error}
          />
        );
      case FieldType.Enum:
        return this.renderSelect(
          this.props.typeInfo.canBeNull,
          this.props.typeInfo.availableValues.map<EnumSelectItem>(x => [x, x])
        );
      case FieldType.Bool:
        return this.renderSelect(this.props.typeInfo.canBeNull, [
          [true, "true"],
          [false, "false"],
        ]);
      case FieldType.Char:
      case FieldType.String:
        return (
          <Input
            value={this.props.value}
            onChange={(_, v) => this.props.onChange(v)}
            width={310}
            error={this.props.error}
          />
        );
      case FieldType.Byte:
      case FieldType.Decimal:
      case FieldType.Int:
      case FieldType.Long:
        return (
          <CurrencyInput
            value={this.props.value}
            onChange={this.handleChangeNumber}
            fractionDigits={
              this.props.typeInfo.type === FieldType.Decimal ? 5 : 0
            }
            signed
            width={310}
            error={this.props.error}
          />
        );
      case FieldType.Dictionary:
      case FieldType.HashSet:
      case FieldType.Enumerable:
      case FieldType.Class:
        return null;
    }
  }

  private handleChangeNumber = (_, value: number | null) => {
    const result =
      value == null &&
      "canBeNull" in this.props.typeInfo &&
      !this.props.typeInfo.canBeNull
        ? 0
        : value;
    this.props.onChange(result);
  };

  private renderSelect(canBeNull: boolean, items: any[]) {
    const selectItems1: any[] = [];
    if (canBeNull) {
      selectItems1.push([null, "(null)"]);
    }
    selectItems1.push(...items);
    return (
      <Select
        width={310}
        value={this.props.value}
        items={selectItems1}
        onChange={(_, v) => this.props.onChange(v)}
      />
    );
  }
}
