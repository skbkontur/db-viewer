// tslint:disable:file-name-casing
declare type Nullable<T> = null | undefined | T;
declare interface IDictionary<TValue> {
  [key: string]: TValue;
}
