import { FilterType } from "../../api/impl/FilterType";

export interface IFilter {
  type?: FilterType;
  value?: any;
}
