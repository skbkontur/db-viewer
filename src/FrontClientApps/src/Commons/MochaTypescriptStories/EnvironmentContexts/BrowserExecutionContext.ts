export interface IBrowserExecutionContext {
    externalInstances: { [key: string]: any };
    externalObjectsCounter: number;
}

const BrowserExecutionContext = {
    externalInstances: {},
    externalObjectsCounter: 0,
};

window["BrowserExecutionContext"] = BrowserExecutionContext;

export { BrowserExecutionContext };
