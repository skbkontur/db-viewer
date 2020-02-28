import { Page } from "puppeteer";
import { spy } from "sinon";

import { BrowserExecutionContext } from "./EnvironmentContexts/BrowserExecutionContext";
import { ExecutionEnvironment, getExecutionEnvironment } from "./EnvironmentContexts/ExecutionEnvironment";
import { TestRunnerExecutionContext } from "./EnvironmentContexts/TestRunnerExecutionContext";

export type RefHolder<T> = ((x: null | T) => void) & RefHolderProxy<T>;

export function refHolder<T>(): ((x: null | T) => void) & RefHolderProxy<T> {
    switch (getExecutionEnvironment()) {
        case ExecutionEnvironment.TestRunner: {
            TestRunnerExecutionContext.externalObjectsCounter++;
            const externalObjectId = "EO-" + TestRunnerExecutionContext.externalObjectsCounter;
            return new RefHolderProxy<T>(externalObjectId) as any;
            break;
        }
        case ExecutionEnvironment.Browser: {
            BrowserExecutionContext.externalObjectsCounter++;
            const externalObjectId = "EO-" + BrowserExecutionContext.externalObjectsCounter;
            const instance = { refValue: null };
            BrowserExecutionContext.externalInstances[externalObjectId] = instance;
            return ((x: any) => (BrowserExecutionContext.externalInstances[externalObjectId].refValue = x)) as any;
            break;
        }
        default:
            throw new Error("Unknown execution context or execution context was not set correctly");
    }
}

export function remoteState<T>(initialValue: T): RemoteStateHandle<T> & T {
    switch (getExecutionEnvironment()) {
        case ExecutionEnvironment.TestRunner: {
            TestRunnerExecutionContext.externalObjectsCounter++;
            const externalObjectId = "EO-" + TestRunnerExecutionContext.externalObjectsCounter;
            return new RemoteStateHandle<T>(externalObjectId) as any;
            break;
        }
        case ExecutionEnvironment.Browser: {
            BrowserExecutionContext.externalObjectsCounter++;
            const externalObjectId = "EO-" + BrowserExecutionContext.externalObjectsCounter;
            const instance = initialValue;
            BrowserExecutionContext.externalInstances[externalObjectId] = instance;
            return instance as any;
            break;
        }
        default:
            throw new Error("Unknown execution context or execution context was not set correctly");
    }
}

export function remoteSpy(): SinonRemoteSpyHandle & any {
    switch (getExecutionEnvironment()) {
        case ExecutionEnvironment.TestRunner: {
            TestRunnerExecutionContext.externalObjectsCounter++;
            const externalObjectId = "EO-" + TestRunnerExecutionContext.externalObjectsCounter;
            return new SinonRemoteSpyHandle(externalObjectId);
            break;
        }
        case ExecutionEnvironment.Browser: {
            BrowserExecutionContext.externalObjectsCounter++;
            const externalObjectId = "EO-" + BrowserExecutionContext.externalObjectsCounter;
            const instance = spy();
            BrowserExecutionContext.externalInstances[externalObjectId] = instance;
            return instance as any;
            break;
        }
        default:
            throw new Error("Unknown execution context or execution context was not set correctly");
    }
}

export class SinonRemoteSpyHandle {
    private readonly externalObjectId: string;

    public constructor(externalObjectId: string) {
        this.externalObjectId = externalObjectId;
    }

    public async callCount(): Promise<number> {
        return this.getCurrentPage().evaluate(
            `BrowserExecutionContext.externalInstances['${this.externalObjectId}'].callCount`
        );
    }

    private getCurrentPage(): Page {
        const result = TestRunnerExecutionContext.currentPage;
        if (result == undefined) {
            throw new Error("Current page is not set");
        }
        return result;
    }
}

export class RemoteStateHandle<T> {
    private readonly externalObjectId: string;

    public constructor(externalObjectId: string) {
        this.externalObjectId = externalObjectId;
    }

    public async get<TR>(getter: (state: T) => TR): Promise<TR> {
        const evaluateFunction = `
(function () { 
    var getter = ${getter.toString()};
    var stateObject = BrowserExecutionContext.externalInstances['${this.externalObjectId}'];
    return getter(stateObject)
})()`;
        const remoteStateValue = await this.getCurrentPage().evaluate(evaluateFunction);
        return remoteStateValue;
    }

    private getCurrentPage(): Page {
        const result = TestRunnerExecutionContext.currentPage;
        if (result == undefined) {
            throw new Error("Current page is not set");
        }
        return result;
    }
}

export class RefHolderProxy<T> {
    private readonly externalObjectId: string;

    public constructor(externalObjectId: string) {
        this.externalObjectId = externalObjectId;
    }

    public async get<TR>(getter: (state: T) => TR): Promise<TR> {
        const evaluateFunction = `
(function () {
    var getter = ${getter.toString()};
    var stateObject =  BrowserExecutionContext.externalInstances['${this.externalObjectId}'];
    return getter(stateObject.refValue);
})()`;
        const remoteStateValue = await this.getCurrentPage().evaluate(evaluateFunction);
        return remoteStateValue;
    }

    private getCurrentPage(): Page {
        const result = TestRunnerExecutionContext.currentPage;
        if (result == undefined) {
            throw new Error("Current page is not set");
        }
        return result;
    }
}
