import { Dispatch } from "react-redux";
import { ThunkAction } from "redux-thunk";
import Apis from "../../api/Apis";
import { Filter } from "../../api/impl/Filter";
import { FilterType } from "../../api/impl/FilterType";
import { Sort } from "../../api/impl/Sort";
import { IObjectsViewerStore } from "../IObjectsViewerStore";
import { IDictionary } from "../TypesList/IDictionary";
import { sleep } from "../utils/PromiseUtils";
import { IFilter } from "./IFilter";

export enum ObjectsListActionTypes {
  SearchStart = "ObjectsList/SearchStart",
  SearchSuccess = "ObjectsList/SearchSuccess",
  SearchFail = "ObjectsList/SearchFail",
  CountStart = "ObjectsList/CountStart",
  CountSuccess = "ObjectsList/CountSuccess",
  CountFail = "ObjectsList/CountFail",
}

interface ISearchStart {
  type: ObjectsListActionTypes.SearchStart;
  typeIdentifier: string;
}

interface ISearchSuccess {
  type: ObjectsListActionTypes.SearchSuccess;
  typeIdentifier: string;
  list: object[];
}

interface ISearchFail {
  type: ObjectsListActionTypes.SearchFail;
  typeIdentifier: string;
}

interface ICountStart {
  type: ObjectsListActionTypes.CountStart;
  typeIdentifier: string;
}

interface ICountSuccess {
  type: ObjectsListActionTypes.CountSuccess;
  typeIdentifier: string;
  count: Nullable<number>;
}

interface ICountFail {
  type: ObjectsListActionTypes.CountFail;
  typeIdentifier: string;
}

export type ObjectsListPayload =
  | ISearchStart
  | ISearchSuccess
  | ISearchFail
  | ICountStart
  | ICountSuccess
  | ICountFail;

export default class ObjectsListActions {
  public static search(
    typeIdentifier: string,
    filters: IDictionary<IFilter>,
    sorts: Sort[],
    skip: number,
    take: number
  ): ThunkAction<Promise<void>, IObjectsViewerStore, null, ObjectsListPayload> {
    return async (dispatch: Dispatch<ObjectsListPayload>) => {
      dispatch({ type: ObjectsListActionTypes.SearchStart, typeIdentifier });
      try {
        const [list] = await Promise.all([
          Apis.businessObjectsListApi.find(typeIdentifier, {
            filters: ObjectsListActions.buildFiltersModels(filters),
            sorts,
            from: skip,
            count: take,
          }),
          sleep(1000),
        ]);
        dispatch({
          type: ObjectsListActionTypes.SearchSuccess,
          typeIdentifier,
          list,
        } as ISearchSuccess);
      } catch (e) {
        console.error("Failed to search", e);
        dispatch({ type: ObjectsListActionTypes.SearchFail, typeIdentifier });
      }
    };
  }

  public static count(
    typeIdentifier: string,
    filters: IDictionary<IFilter>,
    countLimit: number
  ): ThunkAction<Promise<void>, IObjectsViewerStore, null, ObjectsListPayload> {
    return async (dispatch: Dispatch<ObjectsListPayload>) => {
      dispatch({ type: ObjectsListActionTypes.CountStart, typeIdentifier });
      try {
        const [count] = await Promise.all([
          Apis.businessObjectsListApi.count(typeIdentifier, {
            filters: ObjectsListActions.buildFiltersModels(filters),
            limit: countLimit,
          }),
          sleep(1000),
        ]);
        dispatch({
          type: ObjectsListActionTypes.CountSuccess,
          typeIdentifier,
          count,
        });
      } catch (e) {
        console.error("Failed to count", e);
        dispatch({ type: ObjectsListActionTypes.CountFail, typeIdentifier });
      }
    };
  }

  private static buildFiltersModels(filters: IDictionary<IFilter>): Filter[] {
    return Object.keys(filters)
      .map(x => {
        const filter = filters[x];
        if (filter.type === FilterType.No) {
          return null;
        }
        return {
          field: x,
          type: filter.type,
          value: filter.value,
        };
      })
      .filter(x => !!x);
  }
}
