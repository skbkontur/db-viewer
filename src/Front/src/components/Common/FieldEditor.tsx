import Select from "@skbkontur/react-ui/components/Select";
import CurrencyInput from "@skbkontur/react-ui/CurrencyInput";
import Input from "@skbkontur/react-ui/Input";
import * as React from "react";
import { PrimitiveType } from "../../api/impl/PrimitiveType";
import { TypeInfo } from "../../api/impl/TypeInfo";
import { DateTimePicker } from "./DateTimePicker";

export type EnumSelectItem = [string, string];

interface IProps {
  value: any;
  typeInfo: TypeInfo;
  onChange: (value: any) => void;
  dateAsInput?: boolean;
  error?: boolean;
}

export default class FieldEditor extends React.Component<IProps> {
  public render() {
    switch (this.props.typeInfo.type) {
      case PrimitiveType.DateTime:
        return (
          <DateTimePicker
            value={this.props.value}
            onChange={(_, v) => this.props.onChange(v)}
            error={this.props.error}
          />
        );
      case PrimitiveType.Enum:
        return this.renderSelect(
          this.props.typeInfo.canBeNull,
          this.props.typeInfo.availableValues.map<EnumSelectItem>(x => [x, x])
        );
      case PrimitiveType.Bool:
        return this.renderSelect(this.props.typeInfo.canBeNull, [
          [true, "true"],
          [false, "false"],
        ]);
      case PrimitiveType.Char:
      case PrimitiveType.String:
        return (
          <Input
            value={this.props.value}
            onChange={(_, v) => this.props.onChange(v)}
            width={310}
            error={this.props.error}
          />
        );
      case PrimitiveType.Byte:
      case PrimitiveType.SByte:
      case PrimitiveType.Decimal:
      case PrimitiveType.Int:
      case PrimitiveType.Long:
      case PrimitiveType.Short:
        return (
          <CurrencyInput
            value={this.props.value}
            onChange={this.handleChangeNumber}
            fractionDigits={
              this.props.typeInfo.type === PrimitiveType.Decimal ? 5 : 0
            }
            signed
            width={310}
            error={this.props.error}
          />
        );
      case PrimitiveType.Dictionary:
      case PrimitiveType.HashSet:
      case PrimitiveType.Enumerable:
      case PrimitiveType.Class:
      case PrimitiveType.ByteArray:
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
