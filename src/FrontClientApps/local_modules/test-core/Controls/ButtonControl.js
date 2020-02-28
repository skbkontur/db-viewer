import { Selector, t } from "testcafe";

import { applyDataTidSelector } from "./ControlCommons.js";

export function Button(selector: string): ButtonControl {
    return new ButtonControl(applyDataTidSelector(selector));
}

class ButtonControl {
    selector: Selector;

    constructor(selector: string) {
        this.selector = Selector(selector);
    }

    async click(): Promise<void> {
        await t.click(this.selector);
    }
}
