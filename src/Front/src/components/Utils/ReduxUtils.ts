import { InferableComponentEnhancerWithProps } from "react-redux";
import { Action } from "redux";
import { ThunkAction } from "redux-thunk";

// Решение взято отсюда https://habr.com/post/431452/
type CutMiddleFunction<T> = T extends (
  ...arg: infer Args
) => (...args: any[]) => infer R
  ? (...arg: Args) => R
  : never;
export const unboxThunk = <Args extends any[], R, S, E, A extends Action<any>>(
  thunkFn: (...args: Args) => ThunkAction<R, S, E, A>
) => (thunkFn as any) as CutMiddleFunction<typeof thunkFn>;
export type TypeOfConnect<T> = T extends InferableComponentEnhancerWithProps<
  infer Props,
  infer _
>
  ? Props
  : never;
