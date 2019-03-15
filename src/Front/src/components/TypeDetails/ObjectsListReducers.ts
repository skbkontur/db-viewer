import { LoaderState } from "../Common/FullPageLoader";
import { IDictionary } from "../TypesList/IDictionary";

import {
  ObjectsListActionTypes,
  ObjectsListPayload,
} from "./ObjectsList.actions";

export interface ILoadable<T> {
  loadingStatus: LoaderState;
  data?: T;
}

export interface IObjectsListData {
  list: ILoadable<Nullable<any[]>>;
  count: ILoadable<Nullable<number>>;
}

const defaultTypeDetailsData: IObjectsListData = {
  list: null,
  count: null,
};

export interface IObjectsListStore {
  types: IDictionary<IObjectsListData>;
}

const defaultState: IObjectsListStore = {
  types: {},
};

export function objectsListReducers(
  state: IObjectsListStore = defaultState,
  action?: ObjectsListPayload
): IObjectsListStore {
  switch (action.type) {
    case ObjectsListActionTypes.SearchStart:
      return change(state, action.typeIdentifier, data => ({
        ...data,
        list: {
          loadingStatus: LoaderState.Loading,
          data: data.list ? data.list.data : null,
        },
      }));
    case ObjectsListActionTypes.SearchSuccess:
      return change(state, action.typeIdentifier, data => ({
        ...data,
        list: {
          data: action.list,
          loadingStatus: LoaderState.Success,
        },
      }));
    case ObjectsListActionTypes.SearchFail:
      return change(state, action.typeIdentifier, data => ({
        ...data,
        list: {
          loadingStatus: LoaderState.Failed,
          data: data.list ? data.list.data : null,
        },
      }));
    case ObjectsListActionTypes.CountStart:
      return change(state, action.typeIdentifier, data => ({
        ...data,
        count: {
          loadingStatus: LoaderState.Loading,
          data: data.count ? data.count.data : null,
        },
      }));
    case ObjectsListActionTypes.CountSuccess:
      return change(state, action.typeIdentifier, data => ({
        ...data,
        count: {
          data: action.count,
          loadingStatus: LoaderState.Success,
        },
      }));
    case ObjectsListActionTypes.CountFail:
      return change(state, action.typeIdentifier, data => ({
        ...data,
        count: {
          loadingStatus: LoaderState.Failed,
          data: data.count ? data.count.data : null,
        },
      }));
    default:
      return state;
  }
}

function change(
  state: IObjectsListStore,
  typeIdentifier: string,
  changes: (currentState: IObjectsListData) => IObjectsListData
): IObjectsListStore {
  const typeData = state.types[typeIdentifier] || defaultTypeDetailsData;
  return {
    ...state,
    types: {
      ...state.types,
      [typeIdentifier]: {
        ...changes(typeData),
      },
    },
  };
}
