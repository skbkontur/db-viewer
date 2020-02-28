import fs from "fs";
import path from "path";

import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import glob from "glob";
import mkdirp from "mkdirp";
import { ClientFunction } from "testcafe";

const targetDir = path.resolve(path.join(__dirname, "..", "..", "screenshots"));

export async function checkScreenshot(test: TestController, name: string): Promise<void> {
    mkdirp.sync(getScreenshotsDirectory(test, name));
    const baselineHtml = getBaselineHtmlPath(test, name);
    if (!fs.existsSync(baselineHtml)) {
        const fullHtml = await getAllHtml();
        fs.writeFileSync(baselineHtml, fullHtml);
        await test.takeScreenshot(getBaselineScreenshotFileName(test, name));
    }
    const baselineScreenshotPath = getBaselineScreenshotPath(test, name);
    const etalon = await readPicture(baselineScreenshotPath);
    const currentScreenshotFileName = getCurrentScreenshotFileName(test, name);
    await test.takeScreenshot(currentScreenshotFileName);
    const currentScreenshotPath = getCurrentScreenshotPath(test, name);
    const current = await readPicture(currentScreenshotPath);

    const diff = new PNG({ width: etalon.width, height: etalon.height });
    const result = pixelmatch(etalon.data, current.data, diff.data, etalon.width, etalon.height, {
        threshold: 0.1,
    });
    const diffScreenshotPath = getDiffScreenshotPath(test, name);
    await diff.pack().pipe(fs.createWriteStream(diffScreenshotPath));
    await test.expect(result).lt(30);
}

export async function restoreScreenshots(test: TestController): Promise<void> {
    const files = glob.sync(path.join(targetDir, "**/*.baseline.html"));
    for (const file of files) {
        await restoreScreenshot(test, file);
    }
}

function getBaseName(test: TestController, name: string): string {
    return test.testRun.test.fixture.name + "/" + test.testRun.test.name + "-" + name;
}

function getScreenshotsDirectory(test: TestController, _name: string): string {
    return path.join(targetDir, test.testRun.test.fixture.name);
}

function getBaselineScreenshotFileNameByHtmlPath(pathToHtml: string): string {
    return pathToHtml
        .replace(/\\/g, "/")
        .replace(targetDir.replace(/\\/g, "/"), "")
        .replace(/^[\/\\]/, "")
        .replace(".html", ".png");
}

function getBaselineHtmlPath(test: TestController, name: string): string {
    return path.join(targetDir, getBaseName(test, name) + ".baseline.html");
}

function getBaselineScreenshotFileName(test: TestController, name: string): string {
    return getBaseName(test, name) + ".baseline.png";
}

function getBaselineScreenshotPath(test: TestController, name: string): string {
    return path.join(targetDir, getBaselineScreenshotFileName(test, name));
}

function getCurrentScreenshotFileName(test: TestController, name: string): string {
    return getBaseName(test, name) + ".current.png";
}

function getCurrentScreenshotPath(test: TestController, name: string): string {
    return path.join(targetDir, getCurrentScreenshotFileName(test, name));
}

function getDiffScreenshotPath(test: TestController, name: string): string {
    return path.join(targetDir, getBaseName(test, name) + ".diff.png");
}

async function readPicture(path: string): Promise<PNG> {
    return new Promise(resolve => {
        const img1 = fs
            .createReadStream(path)
            .pipe(new PNG())
            .on("parsed", () => {
                resolve(((img1: any): PNG));
            });
    });
}

const getAllHtml = ClientFunction(() => {
    if (document.activeElement != null) {
        document.activeElement.id = "__FOCUSED_ID__";
    }
    if (document.documentElement == null) {
        throw new Error("DocumentElement not found");
    }
    const root = document.documentElement.cloneNode(true);
    [...root.querySelectorAll("script")].forEach(x => {
        if (x.remove) x.remove();
    });
    [...root.querySelectorAll("link")].forEach(x => {
        if (x.remove) x.remove();
    });
    const scriptTag = document.createElement("script");
    scriptTag.type = "text/javascript";
    scriptTag.text =
        "var a = document.querySelectorAll(\"[id='__FOCUSED_ID__']\")[0];" +
        "if (a) { document.activeElement = a; } " +
        "if (a && typeof a.focus === 'function') { a.focus(); }";
    root.appendChild(scriptTag);
    return "<!DOCTYPE html>" + root.outerHTML;
});

async function restoreScreenshot(test: TestController, pathToHtml: string): Promise<void> {
    await test.navigateTo("file:///" + pathToHtml.replace("\\", "/"));
    await test.resizeWindow(1024, 768);
    await test.takeScreenshot(getBaselineScreenshotFileNameByHtmlPath(pathToHtml));
}
