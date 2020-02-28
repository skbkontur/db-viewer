export interface FluxStandardAction {
    type: string;
    meta: any;
    payload: any;
    data?: any;
}

export type ReduxDispatch = (action: Partial<FluxStandardAction>) => any;
