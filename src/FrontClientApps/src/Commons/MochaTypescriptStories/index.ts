import { context } from "mocha-typescript";
import puppeteer, { Page } from "puppeteer";
import {
    ExecutionEnvironment,
    getExecutionEnvironment,
} from "Commons/MochaTypescriptStories/EnvironmentContexts/ExecutionEnvironment";
import { TestRunnerExecutionContext } from "Commons/MochaTypescriptStories/EnvironmentContexts/TestRunnerExecutionContext";

interface MochaRunContext {
    title: string;
    parent?: MochaRunContext;
}

interface MochaContext {
    test: MochaRunContext;
}

const defaultMochaContext: MochaContext = { test: { title: "No title" } };

export class StorybookTestBase {
    @context public mocha: MochaContext = defaultMochaContext;

    protected async render(x: JSX.Element): Promise<Page> {
        if (getExecutionEnvironment() === ExecutionEnvironment.TestRunner) {
            return this.openPuppeteerPage(this.getCurrentTestStoryUrl());
        } else {
            throw { result: x };
        }
    }

    public before() {
        TestRunnerExecutionContext.externalObjectsCounter = 0;
    }

    private async openPuppeteerPage(url: string) {
        const width = 1280;
        const height = 720;
        const browser = await puppeteer.launch({
            headless: false,
            args: [`--window-size=${width + 17},${height + 138}`],
            slowMo: 100,
        });
        const page = await browser.newPage();
        TestRunnerExecutionContext.currentPage = page;
        await page.setViewport({ width: width, height: height });
        const parentTest = this.mocha.test.parent;
        if (parentTest == null) {
            throw new Error("Incorent test structure");
        }
        const navigationAwaiter = page.waitForNavigation({ waitUntil: "domcontentloaded" });
        await page.goto(url);
        await navigationAwaiter;
        return page;
    }

    private getCurrentTestStoryUrl(): string {
        const parentTest = this.mocha.test.parent;
        if (parentTest == null) {
            throw new Error("Incorent test structure");
        }
        const storyBookUrl = `http://localhost:6006/iframe.html`;
        const storyNameEncoded = encodeURIComponent(this.mocha.test.title);
        const storyKindEncoded = encodeURIComponent(parentTest.title);
        return `${storyBookUrl}?selectedKind=${storyKindEncoded}&selectedStory=${storyNameEncoded}`;
    }
}
