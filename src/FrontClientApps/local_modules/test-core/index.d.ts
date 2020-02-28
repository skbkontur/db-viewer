export declare const Input: any;
export declare const Button: any;
export declare const checkScreenshot: any;
export declare const restoreScreenshots: any;

export declare class ExpectationTarget<T> {
    public eql(expectValue: T): Promise<void>;
    public lt(expectValue: T): Promise<void>;
}

export declare class ReExecutablePromise<T> extends Promise<T> {}

export declare function expect<T>(value: ReExecutablePromise<T>): ExpectationTarget<T>;

export declare function storyUrl(kind: string, story: string): string;
