import { t } from "testcafe";

import { checkScreenshot, restoreScreenshots } from "./ScreenshotTesting";
import { Input } from "./Controls/InputControl";
import { Button } from "./Controls/ButtonControl";

export { Input, Button, checkScreenshot, restoreScreenshots };

export function expect<T>(value: ReExecutablePromise<T>): ExpectationTarget<T> {
    return t.expect(value);
}

export function storyUrl(kind: string, story: string): string {
    return `http://localhost:6006/iframe.html?selectedKind=${encodeURIComponent(
        kind
    )}&selectedStory=${encodeURIComponent(story)}`;
}
