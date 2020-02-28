declare interface IReducerBuilder {
    on(name: string, fn: (state: any, x: any) => any): IReducerBuilder;
    scopedOver(x: any, y: any, z: any): any;
}

export declare function defineReducer(state: any): IReducerBuilder;
export declare const perform: any;
