import { Page } from "puppeteer";

export interface ITestRunnerExecutionContext {
    currentPage?: Page;
    externalObjectsCounter: number;
}

const TestRunnerExecutionContext: ITestRunnerExecutionContext = {
    externalObjectsCounter: 0,
};

export { TestRunnerExecutionContext };
