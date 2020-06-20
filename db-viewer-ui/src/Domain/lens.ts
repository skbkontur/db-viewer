/* eslint-disable no-useless-escape */
import get from "lodash/get";

export type PropertyPicker<T, V> = (x: T) => V;

export interface Lens<T, TResult> {
    get(target: T): TResult;
    set(target: T, value: TResult): T;
}

export function pathLens<TTarget extends {}, TProp>(propertyPicker: (target: TTarget) => TProp): Lens<TTarget, TProp> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const fieldsString = /return [^\{\}\(\)]*?\.([^\{\}\(\)]*?)\s*[;\}]/.exec(propertyPicker.toString())[1];
    return {
        get: (x: TTarget) => get(x, fieldsString),
        set: (x: TTarget, value: TProp) => {
            return fieldsString
                .split(".")
                .reduce((result: any[], path: string, index: number) => {
                    const target = result[index - 1] ? result[index - 1][2] : x;
                    return [...result, [path, target, target == null ? null : target[path]]];
                }, [])
                .reduceRight((nextValue, [path, target]) => {
                    return {
                        ...target,
                        [path]: nextValue,
                    };
                }, value);
        },
    };
}
