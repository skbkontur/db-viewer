export declare type PropertyPicker<T, V> = (x: T) => V;

export declare interface Lens<T, TResult> {
    get(target: T): TResult;
    set(target: T, value: TResult): T;
}

export declare function pathLens<TTarget extends {}, TProp>(
    propertyPicker: (target: TTarget) => TProp
): Lens<TTarget, TProp>;

export declare function getPath<TTarget extends {}, TProp>(propertyPicker: (target: TTarget) => TProp): string[];

export declare function view<TTarget, TProp>(lens: Lens<TTarget, TProp>, target: TTarget): TProp;

export declare function set<TTarget, TProp>(lens: Lens<TTarget, TProp>, value: TProp, target: TTarget): TTarget;

export declare function idx<TTarget, TProp>(t: TTarget, pick: (target: TTarget) => TProp): TProp;
