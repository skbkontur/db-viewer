import { FieldInfo } from "../../api/impl/FieldInfo";
import { LoaderState } from "../Common/FullPageLoader";
import {
  ObjectDetailsActionTypes,
  ObjectDetailsPayload,
} from "./ObjectDetailsView.actions";

export interface IObjectDetailsStore {
  loadingStatus: LoaderState;
  object: any;
  typeInfo: FieldInfo;
}

const defaultState: IObjectDetailsStore = {
  loadingStatus: LoaderState.Loading,
  object: null,
  typeInfo: null,
};

export function objectDetailsReducers(
  state: IObjectDetailsStore = defaultState,
  action?: ObjectDetailsPayload
): IObjectDetailsStore {
  switch (action.type) {
    case ObjectDetailsActionTypes.LoadStart:
      return {
        loadingStatus: LoaderState.Loading,
        object: null,
        typeInfo: null,
      };
    case ObjectDetailsActionTypes.LoadSuccess:
      return {
        loadingStatus: LoaderState.Success,
        object: action.object,
        typeInfo: action.typeInfo,
      };
    case ObjectDetailsActionTypes.LoadFail:
      return {
        loadingStatus: LoaderState.Failed,
        object: null,
        typeInfo: null,
      };
    case ObjectDetailsActionTypes.SaveSuccess:
      return {
        ...state,
        object: action.result,
      };
    case ObjectDetailsActionTypes.Clear:
      return {
        loadingStatus: LoaderState.Loading,
        object: null,
        typeInfo: null,
      };
    default:
      return state;
  }
}
