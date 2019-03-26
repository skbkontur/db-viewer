import { keyBy } from "lodash";
import { TypeModel } from "../../api/impl/TypeModel";
import { LoaderState } from "../Common/FullPageLoader";
import {
  BusinessObjectsTypesListActionType,
  TypesListPayload,
} from "./TypesList.actions";

export interface ITypesListFilter {
  searchString: string;
}

export interface ITypesListStore {
  loadingState: LoaderState;
  rawList: TypeModel[];
  list: TypeModel[];
  descriptions: IDictionary<TypeModel>;
  filters: ITypesListFilter;
}

const defaultState: ITypesListStore = {
  loadingState: LoaderState.Loading,
  list: null,
  rawList: null,
  filters: { searchString: "" },
  descriptions: null,
};

export function typesListReducers(
  state: ITypesListStore = defaultState,
  action?: TypesListPayload
): ITypesListStore {
  switch (action.type) {
    case BusinessObjectsTypesListActionType.Success:
      return {
        ...state,
        loadingState: LoaderState.Success,
        rawList: action.list,
        list: applyFilters(state.filters, action.list),
        descriptions: keyBy<TypeModel>(action.list, item => item.name),
      };
    case BusinessObjectsTypesListActionType.Fail:
      return {
        ...state,
        loadingState: LoaderState.Failed,
      };
    case BusinessObjectsTypesListActionType.ChangeSearchString:
      return updateFilters(state, {
        ...state.filters,
        searchString: action.searchString,
      });
    default:
      return state;
  }
}

function updateFilters(state: ITypesListStore, newFilters) {
  return {
    ...state,
    list: applyFilters(newFilters, state.rawList),
    filters: newFilters,
  };
}

function applyFilters(
  filters: ITypesListFilter,
  list: TypeModel[]
): TypeModel[] {
  return list.filter(x => matches(x, filters));
}

function matches(type: TypeModel, filter: ITypesListFilter): boolean {
  const lowerPattern = filter.searchString.toLowerCase();
  const lowerExample = type.name.toLowerCase();
  let exIdx = 0;
  // tslint:disable-next-line:prefer-for-of
  for (let patternIdx = 0; patternIdx < lowerPattern.length; patternIdx++) {
    while (
      exIdx < lowerExample.length &&
      lowerPattern[patternIdx] !== lowerExample[exIdx]
    ) {
      exIdx++;
    }
    if (exIdx === lowerExample.length) {
      return false;
    }
    exIdx++;
  }
  return true;
}
