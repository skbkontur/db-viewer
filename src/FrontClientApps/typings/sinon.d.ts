export declare interface Spy1<T, TResult> {
    (arg1: T): TResult;
    callCount: number;
    calledOnce: boolean;
    called: boolean;
    args: Array<[T]>;
}

export declare interface Spy0<TResult> {
    (): TResult;
    callCount: number;
    calledOnce: boolean;
    called: boolean;
    args: void[];
}

export declare interface Spy2<T1, T2, TResult> {
    (arg1: T1, arg2: T2): TResult;
    callCount: number;
    calledOnce: boolean;
    called: boolean;
    args: Array<[T1, T2]>;
}

export declare function spy<TResult>(): Spy0<TResult>;
export declare function spy<T1, TResult>(): Spy1<T1, TResult>;
export declare function spy<T1, T2, TResult>(): Spy2<T1, T2, TResult>;

// Кажется тут какой-то баг в правиле unified-signatures
// Во всяком случае я не могу по другому написать эти дефинишины
// tslint:disable unified-signatures
export declare function spy<TResult>(fn: () => TResult): Spy0<TResult>;
export declare function spy<T1, TResult>(fn: (a1: T1) => TResult): Spy1<T1, TResult>;
export declare function spy<T1, T2, TResult>(fn: (a1: T1, a2: T2) => TResult): Spy2<T1, T2, TResult>;
// tslint:enable unified-signatures
