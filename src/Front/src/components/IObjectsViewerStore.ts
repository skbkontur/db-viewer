import { InferableComponentEnhancerWithProps } from "react-redux";
import { Action, applyMiddleware, combineReducers, createStore } from "redux";
import thunk, { ThunkAction } from "redux-thunk";
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

export interface IObjectsViewerStore {
  typesListStore: ITypesListStore;
  typeDetailsStore: IObjectsListStore;
  objectDetailsStore: IObjectDetailsStore;
}

// Решение взято отсюда https://habr.com/post/431452/
type CutMiddleFunction<T> = T extends (
  ...arg: infer Args
) => (...args: any[]) => infer R
  ? (...arg: Args) => R
  : never;
export const unboxThunk = <Args extends any[], R, S, E, A extends Action<any>>(
  thunkFn: (...args: Args) => ThunkAction<R, S, E, A>
) => (thunkFn as any) as CutMiddleFunction<typeof thunkFn>; /**/
export type TypeOfConnect<T> = T extends InferableComponentEnhancerWithProps<
  infer Props,
  infer _
>
  ? Props
  : never;

type AvailableActions =
  | TypesListPayload
  | ObjectsListPayload
  | ObjectDetailsPayload;

export default function configureStore() {
  return createStore(
    combineReducers<IObjectsViewerStore, AvailableActions>({
      typesListStore: typesListReducers,
      typeDetailsStore: objectsListReducers,
      objectDetailsStore: objectDetailsReducers,
    }),
    applyMiddleware(thunk)
  );
}
