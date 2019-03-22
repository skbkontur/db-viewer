import { applyMiddleware, combineReducers, createStore, Store } from "redux";
import thunk from "redux-thunk";
import { ObjectDetailsPayload } from "./ObjectDetails/ObjectDetailsView.actions";
import {
  IObjectDetailsStore,
  objectDetailsReducers,
} from "./ObjectDetails/ObjectDetailsView.reducers";
import { ObjectsListPayload } from "./TypeDetails/ObjectsList.actions";
import {
  IObjectsListStore,
  objectsListReducers,
} from "./TypeDetails/ObjectsList.reducers";
import { TypesListPayload } from "./TypesList/TypesList.actions";
import {
  ITypesListStore,
  typesListReducers,
} from "./TypesList/TypesList.reducers";

export interface IDBViewerStore {
  typesListStore: ITypesListStore;
  typeDetailsStore: IObjectsListStore;
  objectDetailsStore: IObjectDetailsStore;
}

type AvailableActions =
  | TypesListPayload
  | ObjectsListPayload
  | ObjectDetailsPayload;

export function configureStore(): Store<IDBViewerStore> {
  return createStore(
    combineReducers<IDBViewerStore, AvailableActions>({
      typesListStore: typesListReducers,
      typeDetailsStore: objectsListReducers,
      objectDetailsStore: objectDetailsReducers,
    }),
    applyMiddleware(thunk)
  );
}
