import * as React from "react";
import { FilterType } from "../../../api/impl/FilterType";
import { Property } from "../../../api/impl/Property";
import { TypeInfo } from "../../../api/impl/TypeInfo";
import { IFilter } from "../IFilter";
import { SearchField } from "./SearchField";
import * as styles from "./SearchPanel.less";

export type FilterSelectItem = [FilterType, string];

const filterDescription: IDictionary<string> = {
  [FilterType.No]: "—",
  [FilterType.Equals]: "==",
  [FilterType.NotEquals]: "!=",
  [FilterType.Less]: "<",
  [FilterType.LessOrEqual]: "<=",
  [FilterType.Greater]: ">",
  [FilterType.GreaterOrEqual]: ">=",
};

export const buildFiltersSelect = (...args: FilterType[]): FilterSelectItem[] =>
  args.map<FilterSelectItem>((x: FilterType) => [x, filterDescription[x]]);

interface ISearchPanelProps {
  onChangeFilter: (name: string, value: IFilter) => void;
  filters: IDictionary<IFilter>;
  fields: Property[];
  validations: IDictionary<boolean>;
}

export default class SearchPanel extends React.Component<ISearchPanelProps> {
  public render() {
    return (
      <table data-tid="SearchPanel" className={styles.table}>
        <tbody>
          {this.props.fields.map(x => (
            <SearchField
              data-tid="SearchField"
              name={x.description.name}
              availableFilters={x.description.availableFilters}
              typeInfo={x.typeInfo}
              key={x.description.name}
              filter={this.props.filters[x.description.name]}
              onChangeFilter={this._handleChangeFilter}
              validations={this.props.validations}
            />
          ))}
        </tbody>
      </table>
    );
  }

  public _handleChangeFilter = (name: string, value: IFilter) =>
    this.props.onChangeFilter(name, value);
}

export interface ISearchFieldProps {
  filter: IFilter;
  name: string;
  availableFilters: FilterType[];
  typeInfo: TypeInfo;
  onChangeFilter: (name: string, value: IFilter) => void;
  validations: IDictionary<boolean>;
}
