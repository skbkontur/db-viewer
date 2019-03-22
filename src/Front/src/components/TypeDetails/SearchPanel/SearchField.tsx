import Select from "@skbkontur/react-ui/Select";
import * as React from "react";
import { FilterType } from "../../../api/impl/FilterType";
import FieldEditor from "../../Common/FieldEditor";
import {
  buildFiltersSelect,
  FilterSelectItem,
  ISearchFieldProps,
} from "./SearchPanel";

export class SearchField extends React.Component<ISearchFieldProps> {
  public filters: FilterSelectItem[];
  constructor(props: ISearchFieldProps) {
    super(props);
    this.filters = buildFiltersSelect(...props.availableFilters);
  }

  public render() {
    return (
      <tr>
        <td>{this.props.name}</td>
        <td>
          <Select
            width={80}
            value={this.props.filter.type}
            items={this.filters}
            onChange={this._handleChangeFilterType}
          />
        </td>
        <td>
          <FieldEditor
            typeInfo={this.props.typeInfo}
            value={this.props.filter.value}
            onChange={this._handleChangeFilterValue}
            error={!!this.props.validations[this.props.name]}
          />
        </td>
      </tr>
    );
  }

  public _handleChangeFilterType = (_, v: FilterType) =>
    this.props.onChangeFilter(this.props.name, {
      type: v,
      value: this.props.filter.value,
    });

  public _handleChangeFilterValue = (v: any) => {
    let newType = this.props.filter.type;
    if (
      this.props.filter.type === FilterType.No &&
      v !== "" &&
      this.props.availableFilters.some(x => x === FilterType.Equals)
    ) {
      newType = FilterType.Equals;
    }
    if (
      this.props.filter.type !== FilterType.No &&
      v === "" &&
      this.props.availableFilters.some(x => x === FilterType.No)
    ) {
      newType = FilterType.No;
    }
    this.props.onChangeFilter(this.props.name, { value: v, type: newType });
  };
}
